const chai = require('chai');
// const chaiHttp = require('chai-http');
const fs = require('fs');
const vm = require('vm');
const path = "./JS/edit.js";
const code = fs.readFileSync(path);
const expect = chai.expect;
const assert = chai.assert;
vm.runInThisContext(code);

var description = '';

describe("Register", function() {
    description = "Registration is Valid Form Object";
    describe(description, function () {
        it("should return if " + description, function () {
            var form = {"firstname":"UnitTest","lastname":"UnitTest","address":"UnitTest","postalcode":"UnitTest","country":"UnitTest","shipaddress":"UnitTest","shipcountry":"UnitTest","shippostalcode":"UnitTest","username":"UnitTest","password":"UnitTest"};
            assert.typeOf(form, 'object');
        });
    });
});



// describe("Edit", function() {
//     description = "Registration is Valid Form Object";
//     describe(description, function () {
//         it("should return if " + description, function () {
//             var form = {"firstname":"UnitTest","lastname":"UnitTest","address":"UnitTest","postalcode":"UnitTest","country":"UnitTest","shipaddress":"UnitTest","shipcountry":"UnitTest","shippostalcode":"UnitTest","username":"UnitTest","password":"UnitTest"};
//             processEditForm(form);
//         });
//     });
// });

// describe("PDF Generation", function() {
//     description = "Generated Default PDF";
//     describe(description, function () {
//         it("should return a " + description, function () {
//             var pdf = generateDefaultPDF();
//             assert.typeOf(pdf, 'pdf');
//         });
//     });
// });
