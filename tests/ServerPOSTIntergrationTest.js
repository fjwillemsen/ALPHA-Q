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
var user = '';


// Tests

describe("POST Requests", function () {

    describe("Register", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/register')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{    "username":"integrationTest", ' +
                    '"password":{"words":"integrationTest"}, ' +
                    '"firstname":"integrationTest", ' +
                    '"lastname":"integrationTest", ' +
                    '"address":"integrationTest", ' +
                    '"country":"integrationTest", ' +
                    '"postalcode":"integrationTest", ' +
                    '"role":"admin", ' +
                    '"shipaddress":"integrationTest", ' +
                    '"shipcountry":"integrationTest", ' +
                    '"shippostalcode":"integrationTest" }')
            .end(function(err,res){
                if (err) throw err;
                expect('Content-Type', /x-www-form-urlencoded/);

                res.status.should.equal(200);
                res.body.should.not.equal(undefined);
                res.body.should.not.equal('');
                expect(res.body).to.not.equal(undefined);
                expect(res.body).to.not.equal('');

                assert.typeOf(res.body, 'object', 'we have an object');
                res.body.ok.should.equal('ok');
                expect(res.body.ok).to.equal('ok');

                done();
            })
        });
    });

    describe("Login", function() {
        it("should return body in JSON", function(done) {
            request.post(url + '/login')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"integrationTest", "password":{"words":"integrationTest"}}')
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
                .send('{"username":"integrationTest", "password":{"words":"integrationTest"}}')
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
                    assert.typeOf(res.body[0].properties['createYear'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['shipaddress'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['createDay'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['lastname'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['createMonth'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['password'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['postalcode'], 'string', 'we have a string');
                    assert.typeOf(res.body[0].properties['username'], 'string', 'we have a string');

                    user = res.body[0].properties;
                    done();
                })
        });
    });

    describe("Add Order", function() {
        var order = {
            cars: ["Kia Amanti 2009 &#8364;88121"],
            carIDs: ["1461"],
            user: {"username":"integrationTest", "password":{"words":"integrationTest"}},
            price: 88121
        };

        order = JSON.stringify(order);

        it("should return body in JSON", function(done) {
            request.post(url + '/order/addOrder')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(order)
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');
                    assert.typeOf(res.body, 'object', 'we have an object');

                    done();
                })
        });

        it("should return OK in JSON", function(done) {

            request.post(url + '/order/addOrder')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(order)
                .end(function(err,res){
                    if (err) throw err;

                    res.body.ok.should.not.equal(undefined);
                    assert.typeOf(res.body.ok, 'string');
                    res.body.ok.should.not.equal('');
                    res.body.ok.should.not.equal('no');
                    res.body.ok.should.equal('ok');

                    done();
                })
        });
    });

    describe("Edit User", function () {

        describe("Edit User (incorrect)", function () {
            it("should return NO in JSON", function (done) {
                request.post(url + '/edituser')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send('{"currentusername":"integrationTest", "firstname":"new firstname test"}')
                    .end(function (err, res) {
                        if (err) throw err;
                        expect('Content-Type', /x-www-form-urlencoded/);

                        res.status.should.equal(200);
                        res.body.should.not.equal(undefined);
                        res.body.should.not.equal('');
                        expect(res.body).to.not.equal(undefined);
                        expect(res.body).to.not.equal('');

                        assert.typeOf(res.body, 'object', 'we have an object');
                        res.body.ok.should.equal('no');
                        expect(res.body.ok).to.equal('no');

                        done();
                    })
            });
        });

        describe("Edit User (correct)", function () {
            it("should return user account details in JSON", function (done) {
                request.post(url + '/edituser')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send('{"currentusername":"integrationTest", "currentpassword":{"words":"integrationTest"}, "firstname":"new firstname test"}')
                    .end(function (err, res) {
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

    });

    describe("Block", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/block')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"username":"integrationTest", "password":"integrationTest"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');

                    assert.typeOf(res.body, 'object', 'we have an object');
                    res.body.ok.should.equal('ok');
                    expect(res.body.ok).to.equal('ok');

                    done();
                })
        });
    });

    describe("Delete", function() {
        it("should return OK in JSON", function(done) {
            request.post(url + '/delete')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('{"deletename":"integrationTest"}')
                .end(function(err,res){
                    if (err) throw err;
                    expect('Content-Type', /x-www-form-urlencoded/);

                    res.status.should.equal(200);
                    res.body.should.not.equal(undefined);
                    res.body.should.not.equal('');
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.not.equal('');

                    assert.typeOf(res.body, 'object', 'we have an object');
                    res.body.ok.should.equal('ok');
                    expect(res.body.ok).to.equal('ok');

                    done();
                })
        });
    });
});
