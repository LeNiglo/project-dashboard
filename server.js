var finalhandler = require('finalhandler')
var http = require('http')
var Router = require('router')

var router = new Router()

router.get('/', function (req, res) {
	res.setHeader('Content-Type', 'text/plain; charset=utf-8')
	res.end(JSON.stringify({title: 'Hello World!'}));
})

var server = http.createServer(app)

server.listen(3000, function onListening() {
	console.log('http server listening on port ' + this.address().port)
})

function app(req, res) {
	router(req, res, finalhandler(req, res))
}