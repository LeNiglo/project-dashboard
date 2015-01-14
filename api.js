var http = require('http');
var url = require('url');
var md5 = require('MD5');
var cc = require('coupon-code');
var MongoClient = require('mongodb').MongoClient;

var clean_mongo = function(req, res, match, cb) {
	MongoClient.connect('mongodb://localhost:27017/project-dashboard', function(err, db) {
		if (err) {
			res.statusCode = 418;
			res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			res.end(JSON.stringify({name: 'Connection to MongoDB Failed.', data: err}));
			cb(err, null);
		} else { 
			cb(null, db);
		}
	});
};

Api = function() {
	
	this.title = "project-dashboard";

	this.user_info = function(req, res, match) {
		clean_mongo(req, res, match, function(err, db) {
			if (err) return false;

			var query = url.parse(req.url, true).query;

			db.collection('users').findOne({token: query.token}, function(err, result) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/plain; charset=utf-8');
				res.end(JSON.stringify({name: 'user_info', data: result}));
			});
		});
	};

	this.register = function(req, res, match) {
		clean_mongo(req, res, match, function(err, db) {
			if (err) return false;

			var query = url.parse(req.url, true).query;

			db.collection('users').findOne({$or: [{email: query.email}, {username: query.username}]}, function(err, result) {
				if (result) {
					res.statusCode = 401;
					res.setHeader('Content-Type', 'text/plain; charset=utf-8');
					res.end(JSON.stringify({name: 'register', data: null}));
					return false;
				} else {
					
					var obj = {
						username: query.username,
						email: query.email,
						password: md5(query.password),
						token: cc.generate({parts:6, partLen:4}),
						last_login: new Date(),
						news: [],
						timezone: 1,
						weather: null,
						todos: [],
						links: []
					};

					db.collection('users').insert(obj, function(err, result) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/plain; charset=utf-8');
						if (err) res.end(JSON.stringify({name: 'register', data: false}));					
						else res.end(JSON.stringify({name: 'register', data: obj.token}));
					});

				}
			});

		});
}

this.logout = function(req, res, match) {
	clean_mongo(req, res, match, function(err, db) {
		if (err) return false;

		var query = url.parse(req.url, true).query;

		db.collection('users').update({token: query.token}, {$set: {token: null} }, function(err, result) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			res.end(JSON.stringify({name: 'logout', data: (result > 0 ? true : false)}));
		});

	});
};

this.login = function(req, res, match) {
	clean_mongo(req, res, match, function(err, db) {
		if (err) return false;

		var query = url.parse(req.url, true).query;

		if (query.token) {
			db.collection('users').findOne({token: query.token}, function(err, result) {
				if (result) {
					var d = new Date();
					db.collection('users').update({token: query.token}, {$set: {last_login: d}}, function(err, result) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/plain; charset=utf-8');
						res.end(JSON.stringify({name: 'login', data: true}));							
					});
				} else {
					res.statusCode = 401;
					res.setHeader('Content-Type', 'text/plain; charset=utf-8');
					res.end(JSON.stringify({name: 'login', data: false}));
				}
			});
		} else {
			db.collection('users').findOne({email: query.email}, function(err, result) {

				if (result) {
					if (result.password === md5(query.password)) {
						var token = cc.generate({parts:6, partLen:4});
						var d = new Date();
						db.collection('users').update({email: query.email}, {$set: {
							token: token, last_login: d
						} }, function(err, result) {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'text/plain; charset=utf-8');
							res.end(JSON.stringify({name: 'login', data: token}));
						});
					} else {
						res.statusCode = 401;
						res.setHeader('Content-Type', 'text/plain; charset=utf-8');
						res.end(JSON.stringify({name: 'login', data: false}));
					}
				} else {
					res.statusCode = 401;
					res.setHeader('Content-Type', 'text/plain; charset=utf-8');
					res.end(JSON.stringify({name: 'login', data: false}));
				}

			});
		}
	});
};

};

module.exports = Api;