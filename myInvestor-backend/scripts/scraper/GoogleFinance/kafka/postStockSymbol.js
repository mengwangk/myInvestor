/**
 * Node.js script to insert stocks into Cassandra database.
 * 
 */
"use strict";

const CASSANDRA_HOST = 'localhost';
const CASSANDRA_KEYSPACE = 'myinvestor';
const POST_URL = "http://localhost:8080/stock";

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const async = require('async');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

if (process.argv.length !== 3) {
    console.error("Please pass in the stock exchange symbol file");
    process.exit(1);
}
const filePath = process.argv[2];

function Stock(exchangeName, stockSymbol, stockName) {
  this.exchangeName = exchangeName;
  this.stockSymbol = stockSymbol;
  this.stockName = stockName;
}

try {
    var stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        console.error('file not exist');
        process.exit(1);
    }
    // Read the JSON file
    var stocks = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    var exchangeName = path.basename(filePath).split('.')[0];
   
    var counter = 0;
    for (var i = 0; i < stocks.length; i++) {
        var stock = stocks[i];
        var obj = new Stock(exchangeName, stock.symbol, stock.company)
        console.log(JSON.stringify(obj));

        // construct an HTTP request
        var xhr = new XMLHttpRequest();
        xhr.open("POST", POST_URL, false);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        
        // send the collected data as JSON
        xhr.send(JSON.stringify(obj));
        if (xhr.readyState== 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        } else {
            console.log('Error posting ' + obj.stockSymbol);
        }
       // xhr.o = function () {
            // done
        //};
    }
    console.log('Total stocks inserted: ' + stocks.length);

} catch (e) {
    console.error(e.message);
    process.exit(1);
}