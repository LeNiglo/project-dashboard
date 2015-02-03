var http = require('http');
var url = require('url');
var md5 = require('MD5');
var cc = require('coupon-code');
var feedparser = require('ortoo-feedparser');


Api = function(db) {
	
	this.title = "project-dashboard";
	this.db = db;

	this.get_feeds = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		db.collection('users').findOne({token: query.token}, function(error, result) {

			if (result && !error) {

				var rss = [];
				var count = 0;

				result.news.forEach(function(uri) {
					feedparser.parseUrl(uri, function(error, meta, articles) {
						if (!error) {
							articles.forEach(function (article) {
								var obj = {
									title: article.title,
									description: article.description,
									link: article.link,
									date: article.date,
									image: article.image
								};
								rss.push(obj);
							});
						}
						++count;
					});
				});

				var check_news_parser = function() {
					if (count >= result.news.length) {
						res.end(JSON.stringify({name: 'get_feeds', data: rss.sort(function(a,b){ return new Date(b.date) - new Date(a.date); }).slice(0, 5)}));
					} else {
						setTimeout(check_news_parser, 10);
					}
				}
				setTimeout(check_news_parser, 10);
			} else {
				res.end(JSON.stringify({name: 'get_feeds', data: null}));
			}
		});

	}

	this.change_news = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		var news = query.news.split(/[\s\n;,]+/);
		while (news[news.length - 1] === "")
			news.pop();

		console.log("change_news", query.news, news);
		db.collection('users').update({token: query.token}, {$set: {news: news} }, function(err, result) {
			if (err)
				res.end(JSON.stringify({name: 'change_news', data: false}));
			else
				res.end(JSON.stringify({name: 'change_news', data: true}));
		});
	}

	this.change_location = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		db.collection('users').update({token: query.token}, {$set: {timezone: query.timezone, locale: query.locale, weather: {location: query.location, unit: query.unit} }}, function(err, result) {
			if (err)
				res.end(JSON.stringify({name: 'change_location', data: false}));
			else
				res.end(JSON.stringify({name: 'change_location', data: true}));
		});
	}

	this.change_password = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		db.collection('users').findOne({token: query.token}, function(err, result) {

			if (result) {
				if (result.password === md5(query.old_pass)) {
					db.collection('users').update({token: query.token}, {$set: {password: md5(query.new_pass)}}, function(err, result) {
						if (err)
							res.end(JSON.stringify({name: 'change_password', data: null}));
						else
							res.end(JSON.stringify({name: 'change_password', data: true}));
					});
				} else {
					res.end(JSON.stringify({name: 'change_password', data: false}));
				}
			} else {
				res.end(JSON.stringify({name: 'change_password', data: null}));
			}

		});
	}

	this.user_info = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		db.collection('users').findOne({token: query.token}, function(err, result) {
			res.end(JSON.stringify({name: 'user_info', data: result}));
		});
	};

	this.register = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		db.collection('users').findOne({$or: [{email: query.email}, {username: query.username}]}, function(err, result) {
			if (result) {
				res.end(JSON.stringify({name: 'register', data: null}));
				return false;
			} else {

				var obj = {
					username: query.username,
					email: query.email,
					password: md5(query.password),
					token: cc.generate({parts:6, partLen:4}),
					last_login: new Date(),
					color: "#ffffff",
					timezone: 1,
					locale: 'en',
					weather: {
						location: 'Paris, FR',
						unit: 'c'
					},
					news: [],
					todos: [],
					links: []
				};

				db.collection('users').insert(obj, function(err, result) {
					if (err) res.end(JSON.stringify({name: 'register', data: false}));
					else res.end(JSON.stringify({name: 'register', data: obj.token}));
				});

			}

		});
	}

	this.logout = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		db.collection('users').update({token: query.token}, {$set: {token: null} }, function(err, result) {
			res.end(JSON.stringify({name: 'logout', data: (result > 0 ? true : false)}));
		});

	};

	this.login = function(req, res, match) {
		var query = url.parse(req.url, true).query;

		if (query.token) {
			db.collection('users').findOne({token: query.token}, function(err, result) {
				if (result) {
					var d = new Date();
					db.collection('users').update({token: query.token}, {$set: {last_login: d}}, function(err, result) {
						res.end(JSON.stringify({name: 'login', data: true}));
					});
				} else {
					res.end(JSON.stringify({name: 'login', data: false}));
				}
			});
		} else {
			db.collection('users').findOne({$or: [{email: query.email}, {username: query.username}]}, function(err, result) {

				if (result) {
					if (result.password === md5(query.password)) {
						var token = cc.generate({parts:6, partLen:4});
						var d = new Date();
						db.collection('users').update({email: query.email}, {$set: {
							token: token, last_login: d
						} }, function(err, result) {
							res.end(JSON.stringify({name: 'login', data: token}));
						});
					} else {
						res.end(JSON.stringify({name: 'login', data: false}));
					}
				} else {
					res.end(JSON.stringify({name: 'login', data: null}));
				}

			});
		}
	};

};

module.exports = Api;