/**
 * Extract a list of stock symbols from Google finance
 * 
 * Use PhantomJS and pass in the exchange name as the 1st argument.
 * 
 * The output file is "exchange_name".json.
 * 
 * phantomjs getStockSymbols.js NASDAQ
 * 
 */

"use strict";

String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

String.prototype.isEmpty = function() {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
};

var system = require('system'),
    page = require('webpage').create(),
    timestamp,
    targetUrl;

var fs = require('fs');

// Log to console in PhantomJS sandbox
//page.onConsoleMessage = function(msg) {
//    system.stderr.writeLine(msg);
//};

var GOOGLE_FINANCE_URL_GET_EXCHANGE_SYMBOLS = 'https://www.google.com/finance?q=%5B%28exchange+%3D%3D+%22{0}%22%29%5D&restype=company&noIL=1&num=5000&ei=5YbOV4ieA9exugTRyZOoCw';
var exchangeName = '';

if (system.args.length === 1) {
    console.log('Pass in the exchange name');
    phantom.exit(1);
} else {
    timestamp = Date.now();
    exchangeName = system.args[1];
    console.log('Getting stock symbols for [' + exchangeName + ']');

    targetUrl = GOOGLE_FINANCE_URL_GET_EXCHANGE_SYMBOLS.format(system.args[1]);
    console.log('target url ' + targetUrl);
    page.open(targetUrl, function(status) {
        if (status !== 'success') {
            console.log('Failed to load the address');
        } else {
            // Actual extraction logic here                 
            var stocks = page.evaluate(function() {
                var stocks = [];
                try {
                    var counter = 1;
                    for (counter = 1; counter <= 10000; counter++) {
                        // company
                        var cells = document.querySelectorAll("a#rc-" + counter);
                        var company = Array.prototype.map.call(cells, function(cell) {
                            return cell.innerText;
                        });

                        // symbols
                        cells = document.querySelectorAll("a#rct-" + counter);
                        var symbol = Array.prototype.map.call(cells, function(cell) {
                            return cell.innerText;
                        });
                        if (company.toString() !== '' && symbol.toString() !== '') {
                            stocks.push({ company: company.toString(), symbol: symbol.toString() });
                        } else {
                            //console.log("company" + company);
                            //console.log("symbol" + symbol);
                        }
                    }
                    // console.log(JSON.stringify(stocks));
                } catch (e) {
                    console.log("Error: " + e.message);
                }
                return stocks;
            });


            if (stocks.length > 0) {
                console.log('Total stocks: ' + stocks.length);
                var fileName = exchangeName + '.json';
                console.log('Writing to ' + fileName);
                fs.write(fileName, JSON.stringify(stocks), 'w');
            } else {
                console.log('Unable to retrieve stock list. Check if the exchange name is valid');
            }
        }
        timestamp = Date.now() - timestamp;
        console.log('Total time: ' + (timestamp / 1000) + ' seconds');
        phantom.exit();
    });
}