var neo4j = require('neo4j');
var restify = require('restify');
fs = require('fs')

var db = new neo4j.GraphDatabase('http://neo4j:gZb-AFF-82n-CVo@145.24.222.132:80');

function filter(query, res, getter, callback) {
    if(getter == undefined) {
        getter = 'o';
    }

    db.cypher({
        query: query,
    }, function (err, results) {

        var response = {
            length: results.length.toString()
        };

        if (err) throw err;
        var result = results[0];
        if (!result) {
            console.log('No object found.');
        } else {
            for (var i = results.length - 1; i >= 0; i--) {
                response[i] = results[i][getter];
            }
        }
        console.log(response);
        res.send(response);
        callback(response);
    });
}

function fquery2(type, property, value, property2, value2) {
    var result = 'MATCH (o:' + type + '{' + property + ': \'' + value + '\', ' + property2 + ': \'' + value2 + '\'}) RETURN o';
    return result;
}

function fquery1(type, property, value) {
    return 'MATCH (o:' + type + '{' + property + ': \'' + value + '\'}) RETURN o';
}

function fquery0(type, property) {
    return 'MATCH (o:' + type + ') RETURN o.' + property + ' ORDER BY o.' + property;
}

function fquery(type) {
    var result = 'MATCH (o:' + type + ') WITH o, rand() AS random RETURN o ORDER BY random LIMIT 100';
    return result;
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


function filterRespond(req, res, next) {
    console.log("Log: " + req.params.type, req.query.property1, req.query.value1, req.query.property2, req.query.value2);
    if(req.query.property2 != undefined) {
        filter(fquery2(req.params.type, req.query.property1, req.query.value1, req.query.property2, req.query.value2), res);
    } else if(req.query.value1 != undefined) {
        filter(fquery1(req.params.type, req.query.property1, req.query.value1), res);
    } else if(req.query.property1 != undefined) {
        filter(fquery0(req.params.type, req.query.property1), res, 'o.' + req.query.property1);
    } else {
        filter(fquery(req.params.type), res);
    }
    next();
}


var server = restify.createServer({
    name: 'CarShop'
});
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.get('/', getIndexhtml);

server.get('/filter/:type', filterRespond);
server.head('/filter/:type', filterRespond);


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});