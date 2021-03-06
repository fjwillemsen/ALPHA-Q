var neo4j = require('neo4j');
var restify = require('restify');
var md5 = require('md5');
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

        if (err) throw err;
        var response = {
            length: results.length.toString()
        };

        var result = results[0];
        if (!result) {
            console.log('No object found.');
            response = {ok: 'no'};
            res.send(200, response);
        } else {
            for (var i = results.length - 1; i >= 0; i--) {
                response[i] = results[i][getter];
            }

            res.send(200, response);
            callback(response);
        }
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
        if (results[0]) {
            if(results[0]['o.status']) {
                if (results[0]['o.status'] == 'blocked') {
                    res.send(200, true)
                } else {
                    res.send(200, false)
                }
            }
            res.send(200, false)
        }
        res.send(200, false)
    });
}

function editQuery(query, res, callback) {
    db.cypher({ query: query }, function (err, results) {
            var response = {ok: 'ok'};
            if(query == undefined || query == '') {
                response = {ok: 'no'};
            }
            res.send(200, response);
            callback(response);
        }
    );
}

function noUndefined(data) {

    if(data) {
        var correct = true;

        if(data["firstname"] == undefined ||
            data["lastname"] == undefined ||
            data["address"] == undefined ||
            data["postalcode"] == undefined ||
            data["country"] == undefined ||
            data["shipaddress"] == undefined ||
            data["shipcountry"] == undefined ||
            data["shippostalcode"] == undefined ||
            data["username"] == undefined ||
            data["password"] == undefined) {
            correct = false;
        }

        return correct;
    }

    return false;
}

function missingImageRespond(req, res) {
    var query = 'MATCH (o:Car) WHERE id(o) = ' + req.params.id + '  SET o.image=false;';
    editQuery(query, res);
}

function notEmpty(variable) {
    if( variable &&
        variable != undefined &&
        variable != '') {
        return true;
    } else {
        return false;
    }
}

function atLeastOneNotEmpty(data, idArray) {
    for (i = 0; i < idArray.length; i++) {
        if (notEmpty(data[idArray[i]])) {
            return true;
        }
    }

    return false;
}

function arrayWithoutEmpty(data, idArray) {
    console.log(idArray);
    var array = [];
    for (i = 0; i < idArray.length; i++) {

        if (notEmpty(data[idArray[i]])) {
            console.log(data[idArray[i]]);
            array.push(idArray[i]);
        }
    }

    return array;
}

function addDataIfNotEmpty(query, data, idArray) {
    for (i = 0; i < idArray.length; i++) {

        if(data[idArray[i]]['words'] != undefined) {
            data[idArray[i]] = data[idArray[i]]['words'];
        }

        if(i == idArray.length -1) {
            query = query + 'o.' + idArray[i] + '=\'' + data[idArray[i]] + '\' RETURN o;';
        } else {
            query = query + 'o.' + idArray[i] + '=\'' + data[idArray[i]] + '\', ';
        }

        console.log('d:' + query);
    }

    return query;
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
    var password = JSON.parse(req.body.toString())["password"]['words'];

    var query = 'MATCH (o:User { username: \'' + username + '\', password: \'' + password + '\' }) RETURN o';
    console.log(query);
    filter(query, res, 'o', returnData);
    next();
}


//Profile
function registerRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    var query = '';

    if(data != undefined) {
        if(!data['role'] || data['role'] == '') {
            data['role'] = 'customer'
        }

        if(noUndefined(data)) {
            var d = new Date();
            query = 'CREATE (o:User { firstname: \'' + data['firstname'] + '\', lastname: \'' + data['lastname'] + '\', address: \'' + data['address'] + '\', postalcode: \'' + data['postalcode']
                + '\', createDay: \'' + d.getDate() + '\', createMonth: \'' + (d.getMonth() + 1) + '\', createYear: \'' + (d.getYear() + 1900)
                + '\', country: \'' + data['country'] + '\', shipaddress: \'' + data['shipaddress'] + '\', shippostalcode: \'' + data['shippostalcode'] + '\', shipcountry: \'' + data['shipcountry'] + '\', username: \'' + data['username'] + '\', password: \'' + data['password']['words'] + '\', role: \'' + data['role'] + '\', wishlist: \'public\', status: \'' + data['status'] + '\'});';
            editQuery(query, res);
        } else {
            var response = { ok: 'no'};
            res.send(200, response);
        }
    }
    next();
}

function editProfileRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    var idArray = ['firstname', 'lastname', 'role', 'address', 'postalcode', 'country', 'shippingaddress', 'shippingpostalcode', 'shippingcountry', 'password'];
    idArray = arrayWithoutEmpty(data, idArray);

    console.log('\n\n EDIT \n\n');

    console.log(data);
    console.log(idArray);
    console.log(idArray.length);
    console.log(data['currentpassword']);

    if(idArray.length > 0) {
        var query = '';
        if (data['role'] == 'admin') {
            query = 'MATCH (o:User { username: \'' + data['currentusername'] + '\'}) SET ';
            query = addDataIfNotEmpty(query, data, idArray);
            console.log(query);
            filter(query, res);
        } else {
            if(data['currentpassword'] && data['currentpassword']['words']) {
                query = 'MATCH (o:User { username: \'' + data['currentusername'] + '\', password: \'' + data['currentpassword']['words'] + '\'}) SET ';
                query = addDataIfNotEmpty(query, data, idArray);
                console.log(query);
                filter(query, res);
            } else {
                var response = { ok: 'no'};
                res.send(200, response);
            }
        }

    } else {
        var response = { ok: 'no'};
        res.send(200, response);
    }
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
    var query = 'MATCH (u:User { username: \'' + data['wishlistusername'] + '\'})-[:WISHES]-(c:Car) return c';
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
    db.cypher({ query: query }, function(err, results) {
        var response = { length: results.length.toString() };
        for (var i = results.length - 1; i >= 0; i--) {
            response[i] = results[i]['c'];
        }
        res.send(200, response);
    });
    next();
}

function addWishListRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    console.log(data);
    var query = 'MATCH (u:User {username:\'' + data['username'] + '\', password: \'' + data['password']['words'] + '\'}), (c:Car) where ID(c)=' + data['addwishlistid'] + ' CREATE (u)-[:WISHES]->(c)';
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
    var query = 'MATCH (u:User {username:\'' + data['username'] + '\', password: \'' + data['password']['words'] + '\'})-[relation:WISHES]-(c:Car) where ID(c)=' + data['removewishlistid'] + ' DELETE relation';
    editQuery(query, res);
    next();
}

function visibilityWishListRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    var query = 'MATCH (u:User {username:\'' + data['username'] + '\', password: \'' + data['password']['words'] + '\'}) SET u.wishlist=\'' + data['wlvisibility'] + '\'';
    editQuery(query, res);
    next();
}

function publicWishListsRespond(req, res, next) {
    var query = 'MATCH (o:User { wishlist: \'public\' })-[:WISHES]-(c:Car) RETURN DISTINCT o.username ORDER BY o.username';
    filter(query, res, 'o.username');
    next();
}

//Order
function getUserOrderRespond(req, res, next) {
    var query = 'Match (o:User{username: \''+ req.params.username +'\'})-[:bought]->(f: Order) return f';
    db.cypher({ query: query }, function(err, results) {
        var response = { length: results.length.toString() };
        for (var i = results.length - 1; i >= 0; i--) {
            response[i] = results[i]['f'];
        }
        res.send(200, response);
    });
    next()
}

function getOrderInfoRespond(req, res, next) {
    //var query = 'MATCH (f:Order { id: \'' + req.params.id + '\'}) return f';
    var query = matchDataByID(req.params.id);
    db.cypher({ query: query }, function(err, results) {
        var response = { length: results.length.toString() };
        for (var i = results.length - 1; i >= 0; i--) {
            response[i] = results[i]['o'];
        }
        //console.log(Object.keys(response[0]['properties']).length);
        res.send(200, response);
    });
    next();
}

function addOrderRespond(req, res, next) {
    var data = JSON.parse(req.body.toString());
    console.log(data);
    var query = 'match (u:User { username: \'' + data['user']['username'] + '\', password: \'' + data['user']['password']['words'] + '\'}) create (o:Order { cars: \'' + data['cars'] + '\', carIDs: \'' + data['carIDs'] + '\', price: \'' + data['price']  + '\'}) create (u)-[b:bought]->(o);'
    console.log(query);
    db.cypher({ query: query}, function (err, results) {
        var response = { ok: 'ok'};
        res.send(200, response);
    });
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
    db.cypher({ query: query }, function (err, results) {
        var response = { ok: 'ok'};
        res.send(200, response);
    });
}

function carBought() {
    var d = new Date();
    var query = "MERGE (n:Statistic { day: " + d.getDate() + ", month: " + (d.getMonth() + 1) + ", year: " + (d.getYear() + 1900) + "}) ON CREATE SET n.carsviewed = 0, n.carsbought = 1 ON MATCH SET n.carsbought = n.carsbought + 1;";
    db.cypher({ query: query}, function (err, results) {
        var response = { ok: 'ok'};
        res.send(200, response);
    });
}


// Start the server
var server = restify.createServer({
    name: 'CarShop'
});

server.use(restify.bodyParser());                                   // Used for parsing the Request body
server.use(restify.queryParser());                                  // Used for allowing "?variable=value" in the URL
server.use(restify.CORS({ credentials: true }));                    // Used for allowing Access-Control-Allow-Origin

server.get('/search/:value', searchRespond);                        // Allows users to search by make, model and year
server.get('/filter/:type', filterRespond);                         // Someone who goes to this link will get the result of filterRespond
server.get('/detail/:id', detailRespond);                           // Gives back the properties of the NodeJS ID
server.get('/users/usernametaken/:username', checkUsername);        // Returns a bool; Whether a username is taken or not
server.get('/users/usernameblocked/:username', denyAccesRespond);   // Checks if a user is blocked
server.get('/wishlists', publicWishListsRespond);                   // Gives all of the public wishlists usernames
server.get('/user/:user/wishlist', getUserWishlistRespond);         // Gives the public wishlist of a specific user
server.get('/order/:username', getUserOrderRespond);                // Respond get users orders //idea
server.get('/orderinfo/:id', getOrderInfoRespond);                  // Order info/factuur //idea
server.get('/cars/reportMissingImage/:id', missingImageRespond);    // Set the 'missing image' attribute of the car to true

// Statistics
server.get('/stats/newUsersPerDate', newUsersPerDate);              // Gives the number of new users created per date
server.get('/stats/numberOfCarsViewed', numberOfCarsViewed);        // Gives the number of cars viewed per date
server.get('/stats/numberOfCarsBought', numberOfCarsBought);        // Gives the number of cars bought per date

server.get('/stats/carViewed', carViewed);                          // Adds one to the number of cars viewed per date
server.get('/stats/carBought', carBought);                          // Adds one to the number of cars bought per date


// Page responses (POST)
server.post('/login', loginRespond);
server.post('/edituser', editProfileRespond);
server.post('/register', registerRespond);
server.post('/delete', deleteUserRespond);
server.post('/block', blockUserRespond);
server.post('/order/addOrder', addOrderRespond);

// Wishlist responses (POST)
server.post('/wladd', addWishListRespond);                          // Add to wishlist
server.post('/wldel', deleteWishListRespond);                       // Delete from wishlist
server.post('/wlvis', visibilityWishListRespond);                   // Set wishlist visibility ('public' or 'private')
server.post('/wl', viewWishListRespond);                            // View the wishlist

// Files are made accessible to the user, HTML index page is made default
server.get(/.*/, restify.serveStatic({
    'directory': __dirname,
    'default': 'index.html'
}));

// Listens for a connection
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});