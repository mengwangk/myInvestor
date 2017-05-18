var express = require('express');
var router = express.Router();
var debug = require('debug')('express')

/* GET users listing. */
router.get('/', function(req, res, next) {
  debug('users');
  
  res.send('respond with a resource');
});

module.exports = router;
