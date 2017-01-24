const chai = require('chai');
const fs = require('fs');
const vm = require('vm');
const should = require("should");
const supertest = require('supertest');

var ip = '132';
if(process.env.KEY1 && process.env.KEY1 != '') {
    ip = process.env.KEY1
}

var port = '8081';
if(process.env.KEY2 && process.env.KEY2 != '') {
    port = process.env.KEY2
}

var url = '145.24.222.' + ip + ':' + port;
var api = supertest(url);

var expect = chai.expect;
var assert = chai.assert;


// Tests

describe('index', function() {
   it('should return a page', function(done) {
      api.get('/')
          .expect("Content-type",/html/)
          .expect(200)
          .end(function(err, res) {
              if (err) throw err;
              done();
          });
   });

   it('should have content of type HTML', function(done) {
      api.get('/')
          .expect("Content-type",/html/)
          .end(function(err,res){
              if (err) throw err;
              res.status.should.equal(200);
              res.body.should.not.equal(undefined);
              res.body.should.not.equal('');
              expect(res.body).to.not.equal(undefined);
              expect(res.body).to.not.equal('');
              done();
          });
   });
});

describe('search', function () {
    it('should return JSON content', function (done) {
        api.get('/search/Volvo')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                res.status.should.equal(200);
                done();
            });
    });

    it('should return JSON content of type Car, brand Volvo', function (done) {
        api.get('/search/Volvo')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                res.status.should.equal(200);
                res.body.should.not.equal(undefined);
                res.body.should.not.equal('');
                expect(res.body).to.not.equal(undefined);
                expect(res.body).to.not.equal('');

                res.body[0].should.not.equal(undefined);
                res.body[0].should.not.equal('');
                expect(res.body[0]).to.not.equal(undefined);
                expect(res.body[0]).to.not.equal('');

                expect(res.body[0].labels[0], 'Car')

                res.body[0].properties.should.not.equal(undefined);
                res.body[0].properties.should.not.equal('');
                expect(res.body[0].properties).to.not.equal(undefined);
                expect(res.body[0].properties).to.not.equal('');

                res.body[0].properties.make_display.should.not.equal(undefined);
                res.body[0].properties.make_display.should.not.equal('');
                expect(res.body[0].properties.make_display).to.not.equal(undefined);
                expect(res.body[0].properties.make_display).to.not.equal('');

                expect(res.body[0].properties.make_display, 'Volvo')
                done();
            });
    });
});

describe('filter', function () {
   it('should return JSON content', function (done) {
       api.get('/filter/Car')
           .set('Accept', 'application/json')
           .expect('Content-Type', /json/)
           .expect(200)
           .end(function(err, res) {
               if (err) throw err;
               res.status.should.equal(200);
               done();
           });
   });

    it('should return JSON content of type Car', function (done) {
        api.get('/filter/Car')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                res.status.should.equal(200);
                res.body.should.not.equal(undefined);
                res.body.should.not.equal('');
                expect(res.body).to.not.equal(undefined);
                expect(res.body).to.not.equal('');

                res.body[0].should.not.equal(undefined);
                res.body[0].should.not.equal('');
                expect(res.body[0]).to.not.equal(undefined);
                expect(res.body[0]).to.not.equal('');

                expect(res.body[0].labels[0], 'Car')
                done();
            });
    });

    it('should return JSON content of type User', function (done) {
        api.get('/filter/User')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                res.status.should.equal(200);
                res.body.should.not.equal(undefined);
                res.body.should.not.equal('');
                expect(res.body).to.not.equal(undefined);
                expect(res.body).to.not.equal('');

                res.body[0].should.not.equal(undefined);
                res.body[0].should.not.equal('');
                expect(res.body[0]).to.not.equal(undefined);
                expect(res.body[0]).to.not.equal('');

                expect(res.body[0].labels[0], 'User')
                done();
            });
    });
});