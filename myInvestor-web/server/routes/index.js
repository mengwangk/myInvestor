var express = require('express');
var path = require('path');
var myinvestor = require('../myinvestor');


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  /*
  var stocks = myinvestor.getStocks('KLSE', function (err, stocks) {
    if (err) {
      res.status(404).send({ msg: err });
    } else {
      res.json(stocks);
    }
  });
  */
  res.render('index', { title: 'myInvestor' });
});

module.exports = router;