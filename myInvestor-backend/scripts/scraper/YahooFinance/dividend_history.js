/**
 * Node.js script to scrap dividend history from Yahoo Finance.
 * 
 * node dividend_history.js <yahoo finance exchange symbol> <from year> <to year>
 */
"use strict";

const CASSANDRA_HOST = 'localhost';
const CASSANDRA_KEYSPACE = 'myinvestor';

const cassandra = require('cassandra-driver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');
const http = require('http');

// https://query1.finance.yahoo.com/v7/finance/download/6742.KL?period1=1274803200&period2=1495728000&interval=1d&events=div&crumb=xZCgl1rxPCP

var HOST_NAME = 'chart.finance.yahoo.com';
var URL_PATH = '/table.csv?s=%s&a=0&b=1&c=%s&d=11&e=31&f=%s&g=v&ignore=.csv';

// http://chart.finance.yahoo.com/table.csv?s=6742.KL&a=0&b=1&c=2006&d=11&e=31&f=2017&g=v&ignore=.csv

if (process.argv.length !== 5) {
    console.error("node dividend_history.js <Yahoo Finance Exchange Symbol> <from year> <to year>");
    process.exit(1);
}
const yfExchangeName = process.argv[2];
const fromYear = process.argv[3];
const toYear = process.argv[4];

var stocks = [];
var client;

try {
    console.log("Downloading dividend histories for [" + yfExchangeName + "]");


    // Connect to cassandra
    connect();

    // Retrieve the stock list
    getStocks(yfExchangeName);



} catch (e) {
    console.error(e.message);
    process.exit(1);
}


function connect() {
    client = new cassandra.Client({ contactPoints: [CASSANDRA_HOST], keyspace: CASSANDRA_KEYSPACE });
    console.log('Connecting to Cassandra');
    client.connect();
}

function getStocks(exchangeName) {
    console.log('Retrieving dividend histories for [' + exchangeName + ']');
    const query = 'SELECT g_stock_symbol, g_stock_name, g_exchange_name, y_stock_symbol, y_stock_name, y_exchange_name FROM g2yfinance_mapping WHERE y_exchange_name = ?';
    client.execute(query, [exchangeName], { prepare: true }, function(err, result) {
        if (err) throw err;
        stocks = result.rows;
        getDividendHistories(0);
    });

}

function getDividendHistories(counter) {
    if (counter === stocks.length) {
        shutDown();
    }
    var stock = stocks[counter];
    console.log("[" + (counter + 1) + "/" + stocks.length + "] - Processing [" + stock.y_stock_symbol + "]");
    downloadHistories(counter, stock.y_stock_symbol);
}

function downloadHistories(counter, stockSymbol) {
    console.log('Downloading from Yahoo Finance');
    var path = util.format(URL_PATH, encodeURIComponent(stockSymbol), fromYear, toYear);
    var options = {
        host: HOST_NAME,
        path: path
    };

    var callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            try {
                if (response.statusCode == 404) {
                    console.log('No dividend history');
                    // continue with the next symbol
                    getDividendHistories(++counter);
                    return;
                }
                var histories = csvToArray(str);
                if (histories.length > 0) {
                    var dividendInfos = [];
                    for (var i = 0; i < histories.length; i++) {
                        var history = histories[i];
                        if (history.Date !== '') {
                            dividendInfos.push({ Date: history.Date, Dividends: history.Dividends });
                        }
                    }
                    if (dividendInfos.length > 0) {
                        // console.log(dividendInfos);
                        // Insert dividend historiesy
                        insertDividends(counter, dividendInfos);
                    } else {
                        console.log('No dividend history');
                        // continue with the next symbol
                        getDividendHistories(++counter);
                    }
                } else {
                    // continue with the next symbol
                    getDividendHistories(++counter);
                }
            } catch (e) {
                console.error("Error parsing result", e);
                // continue with the next symbol
                getDividendHistories(++counter);
            }
        });
    }
    var req = http.request(options, callback);

    req.on('error', function(e) {
        // General error, i.e.
        //  - ECONNRESET - server closed the socket unexpectedly
        //  - ECONNREFUSED - server did not listen
        //  - HPE_INVALID_VERSION
        //  - HPE_INVALID_STATUS
        //  - ... (other HPE_* codes) - server returned garbage
        console.log(e);

        // continue with the next symbol
        getDividendHistories(++counter);
    });

    req.on('timeout', function() {
        // Timeout happend. Server received request, but not handled it
        // (i.e. doesn't send any response or it took to long).
        // You don't know what happend.
        // It will emit 'error' message as well (with ECONNRESET code).

        console.log('timeout');
        req.abort();

        // continue with the next symbol
        getDividendHistories(++counter);
    });

    //req.setTimeout(5000);
    req.end();

}

function insertDividends(counter, dividendInfos) {
    var insert = 'INSERT INTO dividend_history (y_stock_symbol, y_exchange_name, dividend_date, dividend) VALUES (?, ?, ?, ?)';
    var stock = stocks[counter];
    var batchQueries = [];
    for (var i = 0; i < dividendInfos.length; i++) {
        var dividendInfo = dividendInfos[i];
        batchQueries.push({
            query: insert,
            params: [stock.y_stock_symbol, stock.y_exchange_name, dividendInfo.Date, dividendInfo.Dividends]
        });
    }
    client.batch(batchQueries, { prepare: true }, function(err) {
        if (err) {
            // Do nothing
        }
        console.log("Dividend histories downloaded");
        // continue with the next symbol
        getDividendHistories(++counter);
    });
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

function parseDate(s) {
    if (s === undefined || s === null || s === '') return '';
    var p = s.split('/');
    if (p.length >= 3)
        return p[2] + "-" + zeroFill(p[0], 2) + "-" + zeroFill(p[1], 2);
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

function isEmpty(s) {
    if (s === undefined || s === null || s === '');
}

function shutDown() {
    console.log('Shutting down');
    client.shutdown();
    process.exit(0);
}