/**
 * Node.js script to map Google Finance stock symbols to Yahoo Finance.
 * 
 * node g2yfinance_mapper.js <google finance exchange symbol> <yahoo finance exchange symbol> <S|N>
 * 
 * e.g.node g2yfinance_mapper.js NASDAQ NMS S
 * 
 * 
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

var HOST_NAME = 'autoc.finance.yahoo.com';
var URL_PATH = '/autoc?query=%s&region=EU&lang=en-GB';

var IGNORE_WORDS = ['berhad', 'bhd'];

// http://stackoverflow.com/questions/32899143/yahoo-finance-api-stock-ticker-lookup-only-allowing-exact-match


if (process.argv.length !== 5) {
    console.error("node g2yfinance_mapper.js <Google Finance Exchange Symbol> <Yahoo Finance Exchange Symbol> <S|N>");
    console.error("S = symbol, N = name");
    process.exit(1);
}
const gfExchangeName = process.argv[2];
const yfExchangeName = process.argv[3];
const mapCriteria = process.argv[4].toUpperCase();

const MATCH_SYMBOL = "S";
const MATCH_NAME = "N";

if (mapCriteria !== MATCH_NAME && mapCriteria != MATCH_SYMBOL) {
    console.error("Match criteria must be S or N");
    process.exit(1);
}

var stocks = [];
var client;

try {
    console.log("Mapping symbols from [" + gfExchangeName + "] to [" + yfExchangeName + "]");

    // Connect to cassandra
    connect();

    // Retrieve the stock list
    getStocks(gfExchangeName);



} catch (e) {
    console.error(e.message);
    process.exit(1);
}


String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace);
    }
    return replaceString;
};


function connect() {
    client = new cassandra.Client({ contactPoints: [CASSANDRA_HOST], keyspace: CASSANDRA_KEYSPACE });
    console.log('Connecting to Cassandra');
    client.connect();
}

function getStocks(exchangeName) {
    console.log('Retrieving all stocks for [' + exchangeName + ']');
    const query = 'SELECT exchange_name, stock_symbol, stock_name FROM stock WHERE exchange_name = ?';
    client.execute(query, [exchangeName], { prepare: true }, function(err, result) {
        if (err) throw err;
        stocks = result.rows;
        mapToYFinance(0);
    });
}

function mapToYFinance(counter) {
    if (counter === stocks.length) {
        shutDown();
    }
    var stock = stocks[counter];
    console.log("[" + (counter + 1) + "/" + stocks.length + "] - Mapping [" + stock.stock_symbol + "]");

    if (mapCriteria === MATCH_NAME) {
        var stockName = stock.stock_name;
        stockName = stockName.toLowerCase().replaceArray(IGNORE_WORDS, '');
        yfStockSymbolMapping(counter, stockName);
    } else {
        yfStockSymbolMapping(counter, stock.stock_symbol);
    }
}

function shutDown() {
    console.log('Shutting down');
    client.shutdown();
    process.exit(0);
}

function yfStockSymbolMapping(counter, searchName) {
    var path = util.format(URL_PATH, encodeURIComponent(searchName));
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
                var resultSet = JSON.parse(str);
                var result = resultSet.ResultSet.Result;
                if (result.length > 0) {
                    // result found
                    var mappedStocks = [];
                    for (var index = 0, len = result.length; index < len; ++index) {
                        var obj = result[index];
                        if (obj.exch === yfExchangeName) {
                            mappedStocks.push({ symbol: obj.symbol, name: obj.name, exch: obj.exch, type: obj.type });
                        }
                    }
                    if (mappedStocks.length > 0) {
                        insertMapping(counter, mappedStocks);
                    } else {
                        // continue with the next symbol
                        mapToYFinance(++counter);
                    }
                } else {
                    // continue with the next symbol
                    mapToYFinance(++counter);
                }
            } catch (e) {
                console.error("Error parsing result", e);
                // continue with the next symbol
                mapToYFinance(++counter);
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
        mapToYFinance(++counter);
    });

    req.on('timeout', function() {
        // Timeout happend. Server received request, but not handled it
        // (i.e. doesn't send any response or it took to long).
        // You don't know what happend.
        // It will emit 'error' message as well (with ECONNRESET code).

        console.log('timeout');
        req.abort();

        // continue with the next symbol
        mapToYFinance(++counter);
    });

    //req.setTimeout(5000);
    req.end();

}

function insertMapping(counter, mappedStocks) {
    var insert = 'INSERT INTO g2yfinance_mapping (g_stock_symbol, g_stock_name, g_exchange_name, y_stock_symbol, y_stock_name, y_exchange_name) VALUES (?, ?, ?, ?, ?, ?)';
    var stock = stocks[counter];
    var batchQueries = [];
    for (var i = 0; i < mappedStocks.length; i++) {
        var mappedStock = mappedStocks[i];
        batchQueries.push({
            query: insert,
            params: [stock.stock_symbol, stock.stock_name, stock.exchange_name, mappedStock.symbol, mappedStock.name, mappedStock.exch]
        });
    }
    client.batch(batchQueries, { prepare: true }, function(err) {
        if (err) {
            // Do nothing
        }
        // continue with the next symbol
        mapToYFinance(++counter);
    });
}