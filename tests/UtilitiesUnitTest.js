const chai = require('chai');
// const chaiHttp = require('chai-http');
const fs = require('fs');
const vm = require('vm');
const path = "./JS/utils.js";
const code = fs.readFileSync(path);
const expect = chai.expect;
const assert = chai.assert;
vm.runInThisContext(code);

var description = '';

describe("Utilities", function() {
    description = "Unique Array";
    describe(description, function () {
        it("should return a " + description, function () {
            var array = ['hello', 'world', 'hello'];
            array = uArray(array);
            expect(array.length).to.equal(2);
            assert.typeOf(array, 'array');
        });
    });

    description = "Uppercase First Letter";
    describe(description, function () {
        it("should return a string with an " + description, function () {
            var string = "hello world";
            string = toUpperCaseFirst(string);
            expect(string).to.equal('Hello World');
        });
    });

    description = "Single-Quoted Escape String";
    describe(description, function () {
        it("should return a " + description, function () {
            var string = "hello world";
            string = jString(string);
            expect(string).to.equal('\'hello world\'');
            assert.typeOf(string, 'string');
        });
    });

    description = "Beautified String";
    describe(description, function () {
        it("should return a " + description, function () {
            var string = "model_key";
            string = showKey(string);
            expect(string).to.equal('Key ');
            assert.typeOf(string, 'string');
        });
    });

    description = "Empty String";
    describe(description, function () {
        it("should return an " + description, function () {
            var string = "";
            string = empty(string);
            expect(string).to.equal(true);
            assert.typeOf(string, 'boolean');
        });
    });

    description = "Fallback-String if Initial is Empty";
    describe(description, function () {
        it("should return a " + description, function () {
            var string = "";
            string = setIfNotEmpty(string, 'hello world');
            expect(string).to.equal('hello world');
            assert.typeOf(string, 'string');
        });
    });

    description = "Fallback-String if Initial is Empty";
    describe(description, function () {
        it("should return a " + description, function () {
            var string = "";
            string = setIfNotEmpty(string, 'hello world');
            expect(string).to.equal('hello world');
            assert.typeOf(string, 'string');
        });
    });
});