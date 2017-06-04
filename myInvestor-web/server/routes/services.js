var express = require('express');
var router = express.Router();
var myinvestor = require('../myinvestor');
var constants = require('./constants');
const debug = require('debug')('myinvestor:services');
const winston = require('winston');

/**
 * myInvestor services.
 */
router.get('/', function (req, res, next) {
    res.send('myInvestor services');
});
router.get('/stocks', function (req, res, next) {
    res.status(404).send({ msg: constants.ExchangeNameNotProvided });

});

router.get('/exchanges', function (req, res, next) {
    myinvestor.getExchanges(function (err, exchanges) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json(exchanges);
        }
    });

});

router.get('/stocks/:exchange_name', function (req, res, next) {
    winston.info('Getting stocks for [%s]', req.params.exchange_name);

    myinvestor.getStocks(req.params.exchange_name, function (err, stocks) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json(stocks);
        }
    });
});

router.post('/stocks/chosen/', function (req, res, next) {
    winston.info('Saving stocks [%s]', JSON.stringify(req.body.stocks));

    myinvestor.saveChosenStocks(req.body.stocks, function (err, count) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json({ count: count });
        }
    });
});

router.get('/history/:exchange_name/:stock_symbol', function (req, res, next) {
    winston.info('Getting stock [%s] from [%s]', req.params.stock_symbol, req.params.exchange_name);

    myinvestor.getStockHistories(req.params.exchange_name, req.params.stock_symbol, function (err, histories) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json(histories);
        }
    });
});

router.get('/analysis/dividend/:exchange_name', function (req, res, next) {
    winston.info('Getting dividends for [%s]', req.params.exchange_name);

    myinvestor.getDividendSummaries(req.params.exchange_name, function (err, dividendSummaries) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json(dividendSummaries);
        }
    });
});


module.exports = router;