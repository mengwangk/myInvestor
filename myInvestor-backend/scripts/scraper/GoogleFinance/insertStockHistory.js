/**
 * Node.js script to insert stock history into Cassandra database.
 * 
 * node insertStockHistory <EXCHANGE NAME>
 */

"use strict";

const CASSANDRA_HOST = 'localhost';
const CASSANDRA_KEYSPACE = 'myinvestor';

const cassandra = require('cassandra-driver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const async = require('async');
//var sleep = require('sleep');

if (process.argv.length !== 3) {
    console.error("Please pass in the exchange name");
    process.exit(1);
}
const exchangeName = process.argv[2];

var client;
var stockCount = 0;
var stocks;

function StockValidation(exchangeName, stockSymbol, dbCount, rowCount) {
    this.exchangeName = exchangeName;
    this.stockSymbol = stockSymbol;
    this.dbCount = dbCount;
    this.rowCount = rowCount;
}

function processStock(counter) {
    //console.log(' value === ' + JSON.stringify(stocks[counter]));
    var stock = stocks[counter];
    var current = counter + 1;
    console.log('[' + current + "/" + stocks.length + "] - " + stock.stock_symbol);
    var filePath = exchangeName + path.sep + stock.stock_symbol + ".csv";
    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
        // Read the file
        var content = fs.readFileSync(filePath, "utf-8");
        var histories = csvToArray(content);
        var batchQueries = [];
        if (histories.length > 5) { // Condition if history is available
            var recordCount = 0;
            for (var i = 0; i < histories.length; i++) {
                var txnDate = parseDate(histories[i].Date);
                if (txnDate === '') continue;
                // Create a batch query
                var insert = 'INSERT INTO stock_history (exchange_name, stock_symbol, history_date, history_close, history_high, history_low, history_open, history_volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                batchQueries.push({ query: insert, params: [exchangeName, stock.stock_symbol, txnDate, getNumberValue(histories[i].Close), getNumberValue(histories[i].High), getNumberValue(histories[i].Low), getNumberValue(histories[i].Open), getNumberValue(histories[i].Volume)] });
            }

            client.batch(batchQueries, { prepare: true }, function(err) {
                if (err) {
                    // Do nothing
                    console.log(err);
                }
                if (++stockCount === stocks.length) {
                    sanityCheck();
                } else {
                    processStock(stockCount);
                }
            });
        } else {
            if (++stockCount === stocks.length) {
                sanityCheck();
            } else {
                processStock(stockCount);
            }
        }
    } else {
        if (++stockCount === stocks.length) {
            sanityCheck();
        } else {
            processStock(stockCount);
        }
    }

    return ++counter;
}

function connect() {
    client = new cassandra.Client({ contactPoints: [CASSANDRA_HOST], keyspace: CASSANDRA_KEYSPACE });
    console.log('Connecting to Cassandra');
    client.connect();
}

function getStocks() {
    const query = 'SELECT exchange_name, stock_symbol, stock_name FROM stock WHERE exchange_name = ?';
    client.execute(query, [exchangeName], { prepare: true }, function(err, result) {
        if (err) throw err;
        stocks = result.rows;
        insert();
        //sanityCheck();
    });
}

function insert() {
    var counter = 0;
    processStock(counter);
}

function shutDown() {
    console.log('Shutting down');
    client.shutdown();
    process.exit(0);
}

function sanityCheck() {
    console.log('Perform sanity check');
    var counter = 0;
    compareCount(counter);

    // shutDown();    
}

function compareCount(counter) {
    var stock = stocks[counter];
    var current = counter + 1;
    //console.log('Validating [' + current + "/" + stocks.length + "] - " + stock.stock_symbol);   
    var filePath = exchangeName + path.sep + stock.stock_symbol + ".csv";
    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
        // Read the file
        var content = fs.readFileSync(filePath, "utf-8");
        var histories = csvToArray(content);
        var batchQueries = [];
        if (histories.length > 5) { // Condition if history is available
            var recordCount = 0;
            var lastValidDate;
            for (var i = 0; i < histories.length; i++) {
                var txnDate = parseDate(histories[i].Date);
                if (txnDate === '') {
                    continue;
                } else {
                    lastValidDate = txnDate;
                }
                recordCount++;
            }
            var query = "select count(stock_symbol) as rowcount from stock_history where exchange_name = ? and stock_symbol = ? and history_date >= ?";
            client.execute(query, [exchangeName, stock.stock_symbol, lastValidDate], { prepare: true }, function(err, result) {
                if (err) throw err;
                var dbCount = 0;
                var row = result.first();
                if (row !== null)
                    dbCount = row.rowcount;
                if (dbCount != recordCount) {
                    console.log(stock.stock_symbol + " --- File row count [" + recordCount + "] ----- Database record count [" + dbCount + "]");
                }
                if (++counter === stocks.length) {
                    shutDown();
                } else {
                    compareCount(counter);
                }
            });
        } else {
            if (++counter === stocks.length) {
                shutDown();
            } else {
                compareCount(counter);
            }
        }
    } else {
        if (++counter === stocks.length) {
            shutDown;
        } else {
            compareCount(counter);
        }
    }
    return ++counter;
}

try {
    connect();
    getStocks();
} catch (err) {
    console.error('There was an error', err.message, err.stack);
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
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12
    };
    var p = s.split('-');
    if (p.length >= 3)
        return (parseInt(p[2]) + 2000) + "-" + zeroFill(months[p[1].toLowerCase()], 2) + "-" + zeroFill(p[0], 2);
    return '';
}

function csvToArray(csvString) {
    var csvArray = [];
    var csvRows = csvString.split(/\n/);
    var csvHeaders = csvRows.shift().split(',');
    for (var rowIndex = 0; rowIndex < csvRows.length; ++rowIndex) {
        var rowArray = csvRows[rowIndex].split(',');
        var rowObject = csvArray[rowIndex] = {};
        for (var propIndex = 0; propIndex < rowArray.length; ++propIndex) {
            var propValue = rowArray[propIndex].replace(/^"|"$/g, '');
            var propLabel = csvHeaders[propIndex].replace(/^"|"$/g, '');
            rowObject[propLabel] = propValue;
        }
    }
    return csvArray;
}