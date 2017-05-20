/**
 * Insert stock info into Cassandra.
 * 
 * E.g.
 * 
 * node insertStockInfo.js KLSE
 * 
 */
"use strict";

const CASSANDRA_HOST = 'localhost';
const CASSANDRA_KEYSPACE = 'myinvestor';

const cassandra = require('cassandra-driver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const async = require('async');

const exchangeName = process.argv[2];
var client;
var stocks = [];
var stockCount = 0; 

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
    });
}

function insert() {
    var counter = 0;
    processStock(counter);    
}

function shutDown(){
    console.log('Shutting down');
    client.shutdown();
    process.exit(0);
}


function processStock(counter) {      
    var stock = stocks[counter];
    var current = counter + 1;
    console.log('[' + current + "/" + stocks.length + "] - " + stock.stock_symbol); 
    var filePath = exchangeName + path.sep + stock.stock_symbol + ".json";
    try {
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            var info = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            var insert = 'INSERT INTO stock_info (exchange_name, stock_symbol, info_52weeks_from, info_52weeks_to,' +
                'info_beta,' +
                'info_change,' +
                'info_change_percentage,' +
                'info_current_price,' +
                'info_dividend_yield,' +
                'info_eps,' +
                'info_inst_own,' +
                'info_market_capital,' +
                'info_open,' +
                'info_pe,' +
                'info_range_from,' +
                'info_range_to,' +
                'info_shares,' +
                'info_time,' +
                'info_volume,' +
                'info_extracted_timestamp' +
                ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                //') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS';


            var params = [exchangeName, stock.stock_symbol, getNumberFromArr(info._52Weeks, 0), getNumberFromArr(info._52Weeks, 1),
            getNumberValue(info.beta), getNumberValue(info.change), getPercentageValue(info.changePercentage),
            getNumberValue(info.current), getStringValue(info.dividendYield), getNumberValue(info.eps),
            getPercentageValue(info.instOwn), getStringValue(info.marketCapital), getNumberValue(info.open),
            getNumberValue(info.pe), getNumberFromArr(info.range, 0), getNumberFromArr(info.range, 1),
            getStringValue(info.shares), getStringValue(info.time), getStringValue(info.volume), (new Date()).yyyymmdd()
            ];
           
            client.execute(insert, params, { prepare: true }, function (err, result) {
                if (err) {
                    // Do nothing
                    console.log(err);
                }
                if (++stockCount == stocks.length) {
                    shutDown();
                } else {
                    processStock(stockCount);
                }
            });
        } else {
            if (++stockCount == stocks.length) {
                shutDown();
            } else {
                processStock(stockCount);
            }
        }
    } catch (e) {
        console.log('Unable to process ' + filePath, e.message, e);
         if (++stockCount == stocks.length) {
            shutDown();
         } else {
            processStock(stockCount);
         }
    }    
}

if (process.argv.length !== 3) {
    console.error("Please pass in the exchange name");
    process.exit(1);
}

try {   
   connect();
   getStocks();
} catch (err) {
    console.error('There was an error', err.message, err.stack);
}    


function getPercentageValue(value) {
    return getNumberValue(value).toString().replace('%', '');
}

function getNumberFromArr(arr, index) {
    try {
        var values = arr.split('-');
        if (values.length > 0) {
            return parseFloat(values[index]);
        }
    } catch (e) {
        return 0;
    }
}

function getNumberValue(val) {
    if (val === '-' || val === '') return 0;
    return val;
}

function getStringValue(val) {
    if (val === '-') return '';
    return val;
}

Date.prototype.yyyymmdd = function () {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return (this.getFullYear()) + '-' + (mm.length === 2 ? '' : '0', mm) + '-' + (dd.length === 2 ? '' : '0', dd); // padding
};
