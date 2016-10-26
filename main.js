var neo4j = require('neo4j');
var restify = require('restify');
fs = require('fs')

var db = new neo4j.GraphDatabase('http://neo4j:gZb-AFF-82n-CVo@145.24.222.132:80');
var response = '';

function filter(type, value) {
    var data = db.cypher({
        query: 'MATCH (c:Car {' + type + ': \'' + value + '\'}) RETURN c',
    }, function (err, results) {
        if (err) throw err;
        var result = results[0];
        if (!result) {
            console.log('No car found.');
        } else {
            for (var i = results.length - 1; i >= 0; i--) {
                var car = results[i]['c'];
                response = JSON.stringify(car, null, 4);
            }       
        }
    });
    response = 'world!';
    return response.toString();
}

var getIndexhtml = function indexHTML(req, res, next) {
    fs.readFile('/var/www/html/index.html', function (err, data) {
        if (err) {
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
}

function respond(req, res, next) {
    res.send('hello ' + filter(req.params.type, req.params.value));
    console.log('log: ' + filter(req.params.type, req.params.value));
    // res.write(filter(req.params.type, req.params.value));
    // res.setHeader('Content-Type', 'JSON');
    // res.end(data);
    next();
}

var server = restify.createServer({
    name: 'CarShop'
});

server.use(restify.bodyParser());
server.get('/', getIndexhtml);
server.get('/filter/:type/:value', respond);
server.head('/filter/:type/:value', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});