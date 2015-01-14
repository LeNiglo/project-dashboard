var http = require('http');
var url = require('url');
var Router = require('routes');
var router = new Router();
var Api = require('./api.js');
var api = new Api();

var test = function (req, res, match) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.end(JSON.stringify({name: 'Hello World!', data: api.title}));
};

var notFound = function(req, res, match) {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.end(JSON.stringify({title: 'Not Found', data: '404 Not Found'}));
};

router.addRoute('/', test);
router.addRoute('/login', api.login);
router.addRoute('/logout', api.logout);
router.addRoute('/register', api.register);
router.addRoute('/user_info', api.user_info);
router.addRoute('/*', notFound);

var server = http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname;
	var match = router.match(path);

	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    match.fn(req, res, match);
}).listen(3000, function onListening() {
	console.log('http server listening on port ' + this.address().port);
});