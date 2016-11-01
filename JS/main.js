var neo4j = require('neo4j');
var restify = require('restify');
fs = require('fs');

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

        res.send(response);
        callback(response);
    });
}

function matchDataBy2(type, property, value, property2, value2) {
    var result = 'MATCH (o:' + type + '{' + property + ': \'' + value + '\', ' + property2 + ': \'' + value2 + '\'}) RETURN o';
    return result;
}

function matchDataBy1(type, property, value) {
    return 'MATCH (o:' + type + '{' + property + ': \'' + value + '\'}) RETURN o';
}

function matchDataByID(value) {
    var result = 'MATCH (o) WHERE id(o) = ' + value + ' return o;';
    return result;
}

function matchListFilter(type, property, extraprop, extraval) {
    return 'MATCH (o:' + type + '{ ' + extraprop + ': \'' + extraval + '\'}) RETURN o.' + property + ' ORDER BY o.' + property;
}

function matchList(type, property) {
    return 'MATCH (o:' + type + ') RETURN o.' + property + ' ORDER BY o.' + property;
}

function matchRandom(type) {
    var result = 'MATCH (o:' + type + ') WITH o, rand() AS random RETURN o ORDER BY random LIMIT 100';
    return result;
}


function filterRespond(req, res, next) {
    if(req.query.property2 != undefined) {
        filter(matchDataBy2(req.params.type, req.query.property1, req.query.value1, req.query.property2, req.query.value2), res);
    } else if(req.query.value1 != undefined) {
        filter(matchDataBy1(req.params.type, req.query.property1, req.query.value1), res);
    } else if(req.query.property1 != undefined) {
        if(req.query.extraval != undefined) {
            filter(matchListFilter(req.params.type, req.query.property1, req.query.extraprop, req.query.extraval), res, 'o.' + req.query.property1);
        } else {
            filter(matchList(req.params.type, req.query.property1), res, 'o.' + req.query.property1);
        }
    } else {
        filter(matchRandom(req.params.type), res);
    }
    next();
}

function detailRespond(req, res, next) {
    filter(matchDataByID(req.params.id), res);
    next();
}


var server = restify.createServer({
    name: 'CarShop'
});
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.get('/filter/:type', filterRespond);
server.get('/detail/:id', detailRespond);

server.get(/.*/, restify.serveStatic({
    'directory': '/var/www/html',
    'default': 'index.html'
}));

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});