var express = require('express');
var router = express.Router();
var openingroutines = require("../todo.json");
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'new' });
  res.json(openingroutines);
});

module.exports = router;
