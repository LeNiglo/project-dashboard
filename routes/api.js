var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.json({ name: require('../package.json').name, version: require('../package.json').version });
});

module.exports = router;
