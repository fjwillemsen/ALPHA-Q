var neo4j = require('neo4j');
var restify = require('restify');
fs = require('fs');

// Set the port number that's included in the launch arguments, if it is
var port = 8081;
if(process.argv[2] && process.argv[2] != '') {
    port = process.argv[2]
}


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

function checkUsername(req, res) {
    var query = 'MATCH (o:User { username: \'' + req.params.username + '\' }) RETURN o.username';

    db.cypher({ query: query}, function (err, results) {
        if(results[0] == undefined) {
            res.send(200, false)
        } else {
            res.send(200, true)
        }
    })
}

function denyAccesRespond(req,res){
    var query = 'MATCH (o:User { username: \'' + req.params.username + '\' }) RETURN o.status';

    db.cypher({ query: query}, function (err, results) {
            if (results[0]['o.status'] == 'blocked') {
                res.send(200, true)
            } else {
                res.send(200, false)
            }
        }
    )
}

function editQuery(query, res, callback) {
    db.cypher({ query: query }, function (err, results) {
            var response = {ok: 'ok'};
            // console.log('response: ' + response);
            // console.log(res);
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
        if(!data['role'] || data['role'] == '') {
            data['role'] = 'customer'
        }
        var d = new Date();
        query = 'CREATE (o:User { firstname: \'' + data['firstname'] + '\', lastname: \'' + data['lastname'] + '\', address: \'' + data['address'] + '\', postalcode: \'' + data['postalcode']
                + '\', createDay: \'' + d.getDate() + '\', createMonth: \'' + (d.getMonth() + 1) + '\', createYear: \'' + (d.getYear() + 1900)
                + '\', country: \'' + data['country'] + '\', shipaddress: \'' + data['shipaddress'] + '\', shippostalcode: \'' + data['shippostalcode'] + '\', shipcountry: \'' + data['shipcountry'] + '\', username: \'' + data['username'] + '\', password: \'' + data['password'] + '\', role: \'' + data['role'] + '\', status: \'' + data['status']+'\'});';
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
    var query = 'MATCH (o:User { username: \'' + data['deletename'] + '\'}) detach delete o';
    editQuery(query, res);
    next();
}

function blockUserRespond(req,res,next){
    var data = JSON.parse(req.body.toString());
    var query = 'MATCH (o:User { username: \'' + data['blockname'] + '\'}) set o.status = \'blocked\'';
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

function getUserWishlistRespond(req, res, next) {
    var query = 'MATCH (u:User { username: \'' + req.params.user + '\', wishlist: \'public\'})-[:WISHES]-(c:Car) return c';
    console.log(query);
    db.cypher({ query: query }, function(err, results) {
        var response = { length: results.length.toString() };
        for (var i = results.length - 1; i >= 0; i--) {
            response[i] = results[i]['c'];
        }
        console.log(results);
        console.log(response);
        res.send(200, response);
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


// Statistics
function resultsPerDate(query, req, res, next) {
    db.cypher({ query: query }, function(err, results) {
        var response = { length: results.length.toString() };
        for (var i = results.length - 1; i >= 0; i--) {
            response[i] = results[i];
        }
        res.send(200, response);
    });
    next();
}

function newUsersPerDate(req, res, next) {
    var query = 'MATCH (n:User) RETURN count(n.username), n.createDay, n.createMonth, n.createYear ORDER BY toInt(n.createDay), toInt(n.createMonth), toInt(n.createYear);';
    resultsPerDate(query, req, res, next);
}

function numberOfCarsViewed(req, res, next) {
    var query = "MATCH (n:Statistic) RETURN n.carsviewed, n.day, n.month, n.year ORDER BY toInt(n.day), toInt(n.month), toInt(n.year);";
    resultsPerDate(query, req, res, next);
}

function numberOfCarsBought(req, res, next) {
    var query = "MATCH (n:Statistic) RETURN n.carsbought, n.day, n.month, n.year ORDER BY toInt(n.day), toInt(n.month), toInt(n.year);";
    resultsPerDate(query, req, res, next);
}

function carViewed() {
    var d = new Date();
    var query = "MERGE (n:Statistic { day: " + d.getDate() + ", month: " + (d.getMonth() + 1) + ", year: " + (d.getYear() + 1900) + "}) ON CREATE SET n.carsviewed = 1, n.carsbought = 0 ON MATCH SET n.carsviewed = n.carsviewed + 1;";
    console.log(query);
    db.cypher({ query: query });
}

function carBought() {
    var d = new Date();
    var query = "MERGE (n:Statistic { day: " + d.getDate() + ", month: " + (d.getMonth() + 1) + ", year: " + (d.getYear() + 1900) + "}) ON CREATE SET n.carsviewed = 0, n.carsbought = 1 ON MATCH SET n.carsbought = n.carsbought + 1;";
    db.cypher({ query: query});
}


// Start the server
var server = restify.createServer({
    name: 'CarShop'
});

server.use(restify.bodyParser());                               // Used for parsing the Request body
server.use(restify.queryParser());                              // Used for allowing "?variable=value" in the URL
server.use(restify.CORS({ credentials: true }));                // Used for allowing Access-Control-Allow-Origin

server.get('/search/:value', searchRespond);                    // Allows users to search by make, model and year
server.get('/filter/:type', filterRespond);                     // Someone who goes to this link will get the result of filterRespond
server.get('/detail/:id', detailRespond);
server.get('/users/usernametaken/:username', checkUsername);
server.get('/users/usernameblocked/:username', denyAccesRespond);
server.get('/wishlists', publicWishListsRespond);               // Gives all of the public wishlists usernames
server.get('/user/:user/wishlist', getUserWishlistRespond);     // Gives the public wishlist of a specific user

// Statistics
server.get('/stats/newUsersPerDate', newUsersPerDate);          // Gives the number of new users created per date
server.get('/stats/numberOfCarsViewed', numberOfCarsViewed);    // Gives the number of cars viewed per date
server.get('/stats/numberOfCarsBought', numberOfCarsBought);    // Gives the number of cars bought per date

server.get('/stats/carViewed', carViewed);                      // Adds one to the number of cars viewed per date
server.get('/stats/carBought', carBought);                      // Adds one to the number of cars bought per date


// Page responses (POST)
server.post('/login', loginRespond);
server.post('/edituser', editProfileRespond);
server.post('/register', registerRespond);
server.post('/delete', deleteUserRespond);
server.post('/block', blockUserRespond);

// Wishlist responses (POST)
server.post('/wladd', addWishListRespond);                      // Add to wishlist
server.post('/wldel', deleteWishListRespond);                   // Delete from wishlist
server.post('/wlvis', visibilityWishListRespond);               // Set wishlist visibility ('public' or 'private')
server.post('/wl', viewWishListRespond);                        // View the wishlist

// Files are made accessible to the user, HTML index page is made default
server.get(/.*/, restify.serveStatic({
    'directory': '..',
    'default': 'index.html'
}));

// Listens for a connection
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});