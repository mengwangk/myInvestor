var models = require('express-cassandra');
var config = require('config');
const winston = require('winston');
const debug = require('debug')('myinvestor:myinvestor');

var myinvestor = function () {
    init();
};

/*
function myinvestor() {
    init();
}
*/

function init() {
    // Tell express-cassandra to use the models-directory, and
    // use bind() to load the models using cassandra configurations.
    var host = config.get('cassandra.host');
    var port = config.get('cassandra.port');
    var keyspace = config.get('cassandra.keyspace');
    models.setDirectory(__dirname + '/models').bind({
        clientOptions: {
            contactPoints: [host],
            protocolOptions: { port: port },
            keyspace: keyspace,
            queryOptions: { consistency: models.consistencies.one }
        },
        ormOptions: {
            // If your keyspace doesn't exist it will be created automatically
            // using the default replication strategy provided here.
            defaultReplicationStrategy: {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            //migration: 'safe',
            migration: 'alter',
            createKeyspace: false
        }
    },
        function (err) {
            if (err)
                console.log(err.message);
            else
                console.log(models.timeuuid());
        }
    );
}

myinvestor.prototype.getExchanges = function (callback) {
    models.instance.Exchange.find({}, function (err, exchanges) {
        callback(err, exchanges);
    });
}

myinvestor.prototype.getStocks = function (exchangeName, callback) {
    models.instance.Stock.find({ exchange_name: exchangeName, $orderby: { '$asc': 'stock_symbol' }, }, function (err, stocks) {
        callback(err, stocks);
    });
}

myinvestor.prototype.getStockHistories = function (exchangeName, stockSymbol, callback) {
    models.instance.StockHistory.find({
        exchange_name: exchangeName,
        stock_symbol: stockSymbol,
        $orderby: { '$desc': ['stock_symbol', 'history_date'] }
    }, function (err, histories) {
        callback(err, histories);
    });
}

myinvestor.prototype.getDividendSummaries = function (exchangeName, callback) {
    models.instance.DividendSummary.find({
        g_exchange_name: exchangeName
    }, function (err, dividendSummaries) {
        callback(err, dividendSummaries);
    });
}

myinvestor.prototype.getChosenStocks = function (callback) {
    models.instance.ChosenStock.find({}, function (err, chosenStocks) {
        callback(err, chosenStocks);
    });
}


myinvestor.prototype.saveChosenStocks = function (stocks, callback) {
    // http://express-cassandra.readthedocs.io/en/latest/batch/
    var queries = [];
    for (var i = 0; i < stocks.length; i++) {
        var stock = stocks[i];
        var chosenStock = new models.instance.ChosenStock({
            category: stock.category,
            exchange_name: stock.exchange_name,
            stock_symbol: stock.stock_symbol
        }); 
        var saveQuery = chosenStock.save({ return_query: true });      
        queries.push(saveQuery);
    }

    models.doBatch(queries, function (err) {
        callback(err, stocks.length);
    });
}

module.exports = new myinvestor();