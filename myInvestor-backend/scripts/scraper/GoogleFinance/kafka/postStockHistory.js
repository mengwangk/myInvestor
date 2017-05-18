/**
 * Node.js script to insert stock history into Cassandra database.
 * 
 */

"use strict";

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

const CASSANDRA_HOST = 'localhost';
const CASSANDRA_KEYSPACE = 'myinvestor';

const cassandra = require('cassandra-driver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const async = require('async');

var request = require("request");
var cheerio = require("cheerio");

var GOOGLE_FINANCE_URL_GET_STOCK_HISTORY = 'http://www.google.com/finance/historical?q={0}%3A{1}&ei=zsb0V4H5K5LQuATWx7_oDQ&output=csv';

if (process.argv.length !== 3) {
    console.error("Please pass in the exchange name");
    process.exit(1);
}
const exchangeName = process.argv[2];
try {
    const client = new cassandra.Client({ contactPoints: [CASSANDRA_HOST], keyspace: CASSANDRA_KEYSPACE });
    var stocks = [];
    async.series([
        function connect(next) {
            console.log('Connecting to Cassandra');
            client.connect(next);
        },
        function getStocks(next) {
            const query = 'SELECT exchange_name, stock_symbol, stock_name FROM stock WHERE exchange_name = ?';
            client.eachRow(query, [exchangeName], { prepare: true },
                function (n, row) {
                    stocks.push(row);
                },
                function (err) {
                    if (err) return next(err);
                    next();
                }
            );
        },        
        function insert(next) {
            var historicalDataUrl;
            var counter = 0;
            //for (var counter = 0; counter < stocks.length; counter++) {
            for (var counter = 0; counter < 1; counter++) {
                var stock = stocks[counter];
                historicalDataUrl = GOOGLE_FINANCE_URL_GET_STOCK_HISTORY;
                historicalDataUrl = historicalDataUrl.format(stock.exchange_name, encodeURIComponent(stock.stock_symbol));
                //console.log(historicalDataUrl);
                request.get(historicalDataUrl, function (error, response, body) {
                    if (!error && response.statusCode == 200) {              
                        var histories = csvToArray(body);    
                         //console.log(histories);                    
                         if (histories.length > 5) { // Condition if history is available
                            var recordCount = 0;                   
                            for (var i = 0; i < histories.length; i++) {                                                       
                                var dt = parseDate(histories[i]["TxnDate"]);
                                if (dt === '') continue;

                                // Check in Cassandra on the stock history 
                               
                                const query = 'SELECT MAX(history_date) FROM stock_history WHERE exchange_name = ? and stock_symbol = ?';
                                client.execute(query, [exchangeName], { prepare: true }, function (err, result) {
                                    if (err) return next(err);
                                    var row = result.first();
                                    if (row !== null) {
                                        // Latest date
                                    }                                        
                                    next();
                                });

                                // Post the stock history to Kafka

                            }
                         }
                    } else {
                        console.log("Error retrieving stock history: " + error);
                    }
                });
                console.log('Updating history for ' + stock.stock_symbol);           
            }
            console.log("Total stocks updated: " + stocks.length);
            next();
        }        
    ], function (err) {
        if (err) {
            console.error('There was an error', err.message, err.stack);
        }
        console.log('Shutting down');
        client.shutdown();
    });
} catch (e) {
    console.error(e.message);
    process.exit(1);
}

function getNumberValue(val) {
    if (val === '-') return 0;
    return val;
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

function parseDate(s) {
    if (s === undefined || s === null) return '';
    var months = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };
    var p = s.split('-');
    if (p.length >= 3)
        return (parseInt(p[2]) + 2000) + "-" + zeroFill(months[p[1].toLowerCase()], 2) + "-" + zeroFill(p[0], 2);
    return '';
}

function csvToArray(csvString) {
    //console.log(csvString);
    var csvArray = [];
    var csvRows = csvString.split(/\n/);
    var csvHeaders = csvRows.shift().split(',');
    for (var rowIndex = 0; rowIndex < csvRows.length; ++rowIndex) {
        var rowArray = csvRows[rowIndex].split(',');
        var rowObject = csvArray[rowIndex] = {};
        for (var propIndex = 0; propIndex < rowArray.length; ++propIndex) {
            var propValue = rowArray[propIndex].replace(/^"|"$/g, '');
            var propLabel = csvHeaders[propIndex].replace(/^"|"$/g, '');
            if (propLabel.toLowerCase().includes("date")) {
                propLabel = "TxnDate";               
            }
            rowObject[propLabel] = propValue;
        }
    }
    return csvArray;
}