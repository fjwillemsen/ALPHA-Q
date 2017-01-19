var neo4j = require('neo4j');
var restify = require('restify');
fs = require('fs');

// Set the port number that's included in the launch arguments, if it is
var port = 8081
if(process.argv[2] && process.argv[2] != '') {
    port = process.argv[2]
}
console.log(process.argv[2])

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

function checkUsername(req, res, getter, callback) {
    var query = 'MATCH (o:User { username: \'' + req.params.username + '\' }) RETURN COUNT(o)';
    db.cypher({ query: query}, function (err, results) {
        console.log(results[0]['COUNT(o)'])
        if(results[0]['COUNT(o)'] < 1) {
            res.send(200, false)
        } else {
            res.send(200, true)
        }
    })
}

function editQuery(query, res, callback) {
    db.cypher({ query: query }, function (err, results) {
            var response = {ok: 'ok'};
            //console.log('response: ' + response);
            //console.log(res);
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


function search(value) {
    return 'MATCH (o:Car) WHERE o.make =~ \'(?i)' + value + '\' OR o.model =~ \'(?i)' + value + '\' OR o.year =~ \'(?i)' + value + '\' return o ORDER BY o.year;';
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

function searchRespond(req, res, next) {
    filter(search(req.params.value), res);
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

//Profile
function registerRespond(req, res, next) {
    var data = JSON.parse(req.body.toString())
    var query = '';

    if(data != undefined) {
        query = 'CREATE (o:User { firstname: \'' + data['firstname'] + '\', lastname: \'' + data['lastname'] + '\', address: \'' + data['address'] + '\', postalcode: \''
            + data['postalcode'] + '\', country: \'' + data['country'] + '\', shipaddress: \'' + data['shipaddress'] + '\', shippostalcode: \'' + data['shippostalcode'] + '\', shipcountry: \'' + data['shipcountry'] + '\', username: \'' + data['username'] + '\', password: \'' + data['password'] + '\', password2: \'' + data['password2'] + '\', role: \'' + data['role'] + '\', status: \'' + data['status']+'});';
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

function deleteUserRespond(req,res,next) {
    var data = JSON.parse(req.body.toString());
    console.log('lala');
    //if(data != undefined) {
        var query = 'MATCH (o:User { username: \'' + data['deletename'] + '\'}) detach delete o';
    //}
    console.log('Query: ' + query);
    editQuery(query, res);
    next();
}

//Wishlist
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
//use this as an example (for what?)
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

function visibilityWishListRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    var query = 'MATCH (u:User {username:\'' + data['username'] + '\', password: \'' + data['password'] + '\'}) SET u.wishlist=\'' + data['wlvisibility'] + '\'';
    console.log('Q: ' + query);
    editQuery(query, res);
    next();
}

function publicWishListsRespond(req, res, next) {
    var query = 'MATCH (o:User { wishlist: \'public\' })-[:WISHES]-(c:Car) RETURN DISTINCT o.username ORDER BY o.username';
    filter(query, res, 'o.username');
    next();
}

function portF(req, res, next) {
    console.log(process.argv[2])
    return process.argv[2]
}


//Start the server
var server = restify.createServer({
    name: 'CarShop'
});

server.use(restify.bodyParser()); //Used for parsing the Request body
server.use(restify.queryParser()); //Used for allowing "?variable=value" in the URL


server.get('/search/:value', searchRespond); //Allows users to search by make, model and year
server.get('/filter/:type', filterRespond); //Someone who goes to this link will get the result of filterRespond
server.get('/detail/:id', detailRespond);
server.get('/wishlists', publicWishListsRespond); //Gives all of the public wishlists usernames
server.get('/port', portF)
server.get('/users/usernametaken/:username', checkUsername)

server.post('/login', loginRespond);
server.post('/edituser', editProfileRespond);
server.post('/register', registerRespond);
server.post('/delete', deleteUserRespond);

server.post('/wladd', addWishListRespond) //Add to wishlist
server.post('/wldel', deleteWishListRespond); //Delete from wishlist
server.post('/wlvis', visibilityWishListRespond); //Set wishlist visibility ('public' or 'private'
server.post('/wl', viewWishListRespond) //View the wishlist

//Files are made accessible to the user, HTML index page is made default
server.get(/.*/, restify.serveStatic({
    'directory': '..',
    'default': 'index.html'
}));

//Listens for a connection
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});