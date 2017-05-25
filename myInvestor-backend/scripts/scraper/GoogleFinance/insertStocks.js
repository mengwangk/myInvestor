/**
 * Node.js script to insert stocks into Cassandra database.
 * 
 * node insertStocks.js KLSE.json
 */
"use strict";

const CASSANDRA_HOST = 'localhost';
const CASSANDRA_KEYSPACE = 'myinvestor';

const cassandra = require('cassandra-driver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const async = require('async');

if (process.argv.length !== 3) {
    console.error("Please pass in the stock exchange symbol file");
    process.exit(1);
}
const filePath = process.argv[2];
try {
    var stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        console.error('file not exist');
        process.exit(1);
    }
    // Read the JSON file
    var stocks = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    var exchangeName = path.basename(filePath).split('.')[0];
    //var exchangeId = '';

    const client = new cassandra.Client({ contactPoints: [CASSANDRA_HOST], keyspace: CASSANDRA_KEYSPACE });
    async.series([
        function connect(next) {
            console.log('Connecting to Cassandra');
            client.connect(next);
        },
        /*
        function getExchangeId(next) {
            const query = 'SELECT exchange_id, exchange_name FROM exchange WHERE exchange_name = ?';
            client.execute(query, [exchangeName], { prepare: true }, function (err, result) {
                if (err) return next(err);
                var row = result.first();
                if (row !== null)
                    exchangeId = row.exchange_id;
                next();
            });
        },
        */
        function insert(next) {
            var counter = 0;
            for (var i = 0; i < stocks.length; i++) {
                var stock = stocks[i];
                var insert = 'INSERT INTO stock (exchange_name, stock_symbol, stock_name) VALUES (?, ?, ?)';
                // console.log(stock.symbol);
                client.execute(insert, [exchangeName, stock.symbol, stock.company], { prepare: true }, function(err, result) {
                    if (err) {
                        // Do nothing
                    }
                    if (++counter == stocks.length) {
                        next();
                    }
                });
            }
            console.log('Total stocks inserted: ' + stocks.length);
        },
        function update(next) {
            var sql = 'UPDATE exchange set stock_count = ? WHERE exchange_name = ?';
            client.execute(sql, [stocks.length, exchangeName], { prepare: true }, function(err, result) {
                if (err) {
                    // Do nothing
                }
                next();
            });
        }
    ], function(err) {
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