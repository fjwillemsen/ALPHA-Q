var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:gZb-AFF-82n-CVo@145.24.222.132:7474');
 
db.cypher({
    query: 'MATCH (c:Car {make: \'Ford\'}) RETURN c',
}, function (err, results) {
    if (err) throw err;
    var result = results[0];
    if (!result) {
        console.log('No car found.');
    } else {
        for (var i = results.length - 1; i >= 0; i--) {
            var car = results[i]['c'];
            console.log(JSON.stringify(car, null, 4));
        }       
    }
});