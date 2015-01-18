var https = require('https');
var fs = require('fs');
var url = require('url');
var Router = require('routes');
var router = new Router();
var Api = require('./api.js');
var MongoClient = require('mongodb').MongoClient;

var clean_mongo = function(cb) {
	MongoClient.connect('mongodb://localhost:27017/project-dashboard', function(err, db) {
		if (err) {
			cb(err, null);
		} else { 
			cb(null, db);
		}
	});
};

var notFound = function(req, res, match) {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.end(JSON.stringify({title: 'Not Found', data: '404 Not Found'}));
};

/* Starts by initilizing the connection with the Database */
clean_mongo(function(err, db) {

	if (err) {
		console.log("Could not connect to MongoDB.");
		return false;
	} else {
		var api = new Api(db);
		var options = {
			key: fs.readFileSync('/etc/nginx/certificates/dashboard.key'),
			cert: fs.readFileSync('/etc/nginx/certificates/dashboard.crt')
		};

		var allowed_origins = ["https://project-dashboard.dev", "http://project-dashboard.dev", "http://localhost", "https://localhost", "https://lefrantguillaume.dev", "https://project-dashboard.lefrantguillaume.com"];

		router.addRoute('/', notFound);
		router.addRoute('/login', api.login);
		router.addRoute('/logout', api.logout);
		router.addRoute('/register', api.register);
		router.addRoute('/user_info', api.user_info);
		router.addRoute('/*', notFound);

		var server = https.createServer(options, function (req, res) {
			var path = url.parse(req.url).pathname;
			var match = router.match(path);

			if (allowed_origins.indexOf(req.headers.origin) >= 0) {
				res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
				res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
				res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
				res.setHeader('Access-Control-Allow-Credentials', true);
			}

			match.fn(req, res, match);
		}).listen(3000, function onListening() {
			console.log('\033[32mhttp server listening on port \033[0m' + this.address().port);
		});
	}

});
