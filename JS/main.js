var neo4j = require('neo4j');
var restify = require('restify');
fs = require('fs');

//Connects to the database
var db = new neo4j.GraphDatabase('http://neo4j:gZb-AFF-82n-CVo@145.24.222.132:80');

//Executes a query on the database and returns the data to the original caller
function filter(query, res, getter, callback) {
    if(getter == undefined) {
        getter = 'o';
    }

    db.cypher({
        query: query
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

        res.send(200, response);
        callback(response);
    });
}

function editQuery(query, res, callback) {
    db.cypher({ query: query }, function (err, results) {
            console.log('result: ' + results);
            var response = {ok: 'ok'};
            res.send(200, response);
            callback(response);
        }
    );
}


//Query Creators
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


//Respond Functions
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

function returnData(results) {
    return results;
}

function loginRespond(req, res, next) {
    var username = JSON.parse(req.body.toString())["username"];
    var password = JSON.parse(req.body.toString())["password"];

    var query = 'MATCH (o:User { username: \'' + username + '\', password: \'' + password + '\' }) RETURN o';
    filter(query, res, 'o', returnData)
    next();
}


function registerRespond(req, res, next) {
    var data = JSON.parse(req.body.toString())
    console.log(data['firstname']);
    console.log(data['lastname']);
    console.log(data['address']);
    console.log(data['postalcode']);
    console.log(data['country']);
    console.log(data['shipaddress']);
    console.log(data['shippostalcode']);
    console.log(data['shipcountry']);
    console.log(data['username']);
    console.log(data['password']);
    
    console.log(data)
    
    if (!data || data != undefined) {
        var query = 'CREATE (o:User { firstname: \'' + data['firstname'] + '\', lastname: \'' + data['lastname'] + '\', address: \'' + data['address'] + '\', postalcode: \'' + data['postalcode'] + '\', country: \'' + data['country'] + '\', shipaddress: \'' + data['shipaddress'] + '\', shippostalcode: \'' + data['shippostalcode'] + '\', shipcountry: \'' + data['shipcountry'] + '\', username: \'' + data['username'] + '\', password: \'' + data['password'] + '\'});';
    }
    console.log('Query: ' + query);
    editQuery(query, res);
    next();
}

function editProfileRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    if(data['currentpassword'] == '' || !data['currentpassword']) {
        var query = 'MATCH (o:User { username: \'' + data['currentusername'] + '\'}) SET o.username=\'' + data['username'] + '\', o.password=\'' + data['password'] + '\', o.firstname=\'' + data['firstname'] + '\', o.lastname=\'' + data['lastname'] + '\', o.role=\'' + data['role'] + '\';';
    } else {
        var query = 'MATCH (o:User { username: \'' + data['currentusername'] + '\', password: \'' + data['currentpassword'] + '\'}) SET o.username=\'' + data['username'] + '\', o.password=\'' + data['password'] + '\', o.firstname=\'' + data['firstname'] + '\', o.lastname=\'' + data['lastname'] + '\', o.role=\'' + data['role'] + '\';';
    }

    console.log('Query: ' + query);
    editQuery(query, res);
    next();
}

function viewWishListRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    var query = 'MATCH (u:User { username: \'' + data['wishlistusername'] + '\', wishlist: \'public\'})-[:WISHES]-(c:Car) return c';
    db.cypher({ query: query }, function(err, results) {
        if(!results[0]) { //If the requested user's wishlist is not public, check if it is the logged in users' wishlist
            query = 'MATCH (u:User { username: \'' + data['wishlistusername'] + '\', password: \'' + data['password'] + '\'})-[:WISHES]-(c:Car) return c';
            db.cypher({ query: query}, function(err, results) {
                if(results[0]) {
                    var response = { length: results.length.toString() };
                    for (var i = results.length - 1; i >= 0; i--) {
                        response[i] = results[i]['c'];
                    }
                    res.send(200, response);
                }
            });
        } else {
            var response = { length: results.length.toString() };
            for (var i = results.length - 1; i >= 0; i--) {
                response[i] = results[i]['c'];
            }
            res.send(200, response);
        }
    });
    next();
}

function addWishListRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    var query = 'MATCH (u:User {username:\'' + data['username'] + '\', password: \'' + data['password'] + '\'}), (c:Car) where ID(c)=' + data['addwishlistid'] + ' CREATE (u)-[:WISHES]->(c)';
    db.cypher({ query: query }, function(err, results) {
        query = 'MATCH (u:User { username: \'' + data['wishlistusername'] + '\', password: \'' + data['password'] + '\'})-[:WISHES]-(c:Car) return c';
        db.cypher({ query: query }, function(err, results) {
            if(results[0]) {
                var response = { length: results.length.toString() };
                for (var i = results.length - 1; i >= 0; i--) {
                    response[i] = results[i]['c'];
                }
                res.send(200, response);
            }
        });
    });
    next();
}

function deleteWishListRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());

    var query = 'MATCH (u:User {username:\'' + data['username'] + '\', password: \'' + data['password'] + '\'})-[relation:WISHES]-(c:Car) where ID(c)=' + data['removewishlistid'] + ' DELETE relation';
    console.log('Q: ' + query);
    editQuery(query, res);
    next();
}


//Start the server
var server = restify.createServer({
    name: 'CarShop'
});

server.use(restify.bodyParser()); //Used for parsing the Request body
server.use(restify.queryParser()); //Used for allowing "?variable=value" in the URL

server.get('/filter/:type', filterRespond); //Someone who goes to this link will get the result of filterRespond
server.get('/detail/:id', detailRespond);

server.post('/login', loginRespond);
server.post('/edituser', editProfileRespond);

server.post('/register', registerRespond);

server.post('/wladd', addWishListRespond) //Add to wishlist
server.post('/wldel', deleteWishListRespond); //Delete from wishlist
server.post('/wl', viewWishListRespond) //View the wishlist

//Files are made accessible to the user, HTML index page is made default
server.get(/.*/, restify.serveStatic({
    'directory': '/var/www/html',
    'default': 'index.html'
}));

//Listens for a connection
server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});