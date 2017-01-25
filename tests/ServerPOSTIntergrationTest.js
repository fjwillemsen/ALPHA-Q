const chai = require('chai');
const should = require("should");
const request = require('superagent');

var ip = '132';
if(process.env.KEY1 && process.env.KEY1 != '') {
    ip = process.env.KEY1
}

var port = '8081';
if(process.env.KEY2 && process.env.KEY2 != '') {
    port = process.env.KEY2
}

var url = '145.24.222.' + ip + ':' + port;

var expect = chai.expect;
var assert = chai.assert;


// Tests

describe("POST Requests", function () {
    describe("login", function() {
        it("should return body in JSON", function(done) {
            request.post(url + '/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"admin", "password":"admin"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');
                    assert.typeOf(res.body, 'object', 'we have a object');

                    res.body[0].should.not.equal(undefined);
                    res.body[0].should.not.equal('');
                    expect(res.body[0]).to.not.equal(undefined);
                    expect(res.body[0]).to.not.equal('');

                    done();
                })
        });

        it("should return user account details in JSON", function(done) {
            request.post(url + '/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"admin", "password":"admin"}')
                .end(function(err,res){
                    if (err) throw err;

                    res.body[0].labels.should.not.equal(undefined);
                    res.body[0].labels.should.not.equal('');
                    assert.typeOf(res.body[0].labels, 'array', 'we have an array');

                    res.body[0].properties.should.not.equal(undefined);
                    res.body[0].properties.should.not.equal('');

                    assert.typeOf(res.body[0].properties['shippostalcode'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['country'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['firstname'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['role'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['address'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['shipcountry'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['wishlist'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['createYear'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['shipaddress'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['createDay'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['lastname'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['createMonth'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['password'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['postalcode'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['username'], 'string', 'we have a string');

                    done();
                })
        });
    });

    describe("edituser", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/edituser')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"admin", "password":"admin"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');

                    assert.typeOf(res.body, 'object', 'we have a object');
                    res.body.ok.should.equal('ok');
                    expect(res.body.ok).to.equal('ok');

                    done();
                })
        });
    });

    describe("register", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/register')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"admin", "password":"admin"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');

                    assert.typeOf(res.body, 'object', 'we have a object');
                    res.body.ok.should.equal('ok');
                    expect(res.body.ok).to.equal('ok');

                    done();
                })
        });
    });

    describe("delete", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/delete')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"admin", "password":"admin"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');

                    assert.typeOf(res.body, 'object', 'we have a object');
                    res.body.ok.should.equal('ok');
                    expect(res.body.ok).to.equal('ok');

                    done();
                })
        });
    });

    describe("block", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/block')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"admin", "password":"admin"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');

                    assert.typeOf(res.body, 'object', 'we have a object');
                    res.body.ok.should.equal('ok');
                    expect(res.body.ok).to.equal('ok');

                    done();
                })
        });
    });
});