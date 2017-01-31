function submitValidatedRegister(){
    validateUsernameExist('#register','username','registreren');
}

function submitRegister() {
    console.log("im submitted");
    if (validateRequiredFields() && validatePasswordCorrect) {
        var fo = getFormObjects('#register') // form object
        var url = 'http://' + ip + ':' + port + '/register';
        var data = JSON.stringify({
            'firstname': fo['firstname'],
            'lastname': fo['lastname'],
            'address': fo['address'],
            'postalcode': fo['postalcode'],
            'country': fo['country'],
            'shipaddress': fo['shipaddress'],
            'shipcountry': fo['shipcountry'],
            'shippostalcode': fo['shippostalcode'],
            'username': fo['username'],
            'password': CryptoJS.MD5(fo['password'])
        });
        swal({
            title: "Wonderful",
            text: "You are now registred at CarShop!",
            timer: 1700
        });
        console.log(data);

        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            datatype: 'json',
            contentType: "application/x-www-form-urlencoded",
            succes: function () {
                console.log('Succes!');
                   swal({
                       title: "Wonderful!",
                       text: "Registration succesful",
                       timer: 1700
                   })
                setJSONTable('/filter/Car');
            },
            error: function () {
                console.log('Failure!');
                swal({
                    title: "Ooops!",
                    text: "Something went terribly wrong. Please try again.",
                    timer: 1700
                });
            }
        });
    }
}

function validatePasswordCorrect() {
    var password = document.getElementById("password")
    var password2 = document.getElementById("password2")
    if(password.value == password2.value){
        return true
    }
    else{
        return false
    }
}

function validateUsernameExist(id, fieldname, action){
    var fo = getFormObjects(id);

    console.log(fo[fieldname]);
    $.get('http://' + ip+":"+port+"/users/usernametaken/" + fo[fieldname], function (data) {
        if (data == true){
            if (action == 'delete'){
                deleteUser();
            }
            else if (action == 'block'){
                blockUser();
            }
            else if (action == 'registreren'){
                var id = document.getElementById("error-Username");
                id.innerHTML = "Username already exist";
            }
            else if(action == 'edit'){
                var id = document.getElementById("error-edituser");
                id.innerHTML = "";
                editUser();
            }

        }
        else{
            if (action == 'delete'){
                var id = document.getElementById("error-deleteuser");
                id.innerHTML = "Username doesn't exist";
            }
            else if (action == 'block'){
                var id = document.getElementById("error-blockuser");
                id.innerHTML = "Username doesn't exist";
            }
            else if (action == 'registreren'){
                var id = document.getElementById("error-Username");
                id.innerHTML = "";
                submitRegister();
            }
            else if (action == 'edit'){
                var id = document.getElementById("error-edituser");
                id.innerHTML = "Username doesn't exist";
            }

        }
    })
}

function setRegisterView() {
    setContentTo('register.html');
}

function validateRequiredFields() {
    var done = true;
    var fo = getFormObjects('#register');
    var query = 'MATCH (o:User { username: \'' + username + '\' }) RETURN o';

    if (!fo['firstname'] || fo['firstname'] == '') {
        var el = document.getElementById("error-Firstname");
        el.innerHTML = "Fill in your first name"
        done = false;
    } else {
        var el = document.getElementById("error-Firstname");
        el.innerHTML = "";
    }

    if (!fo['lastname'] || fo['lastname'] == '') {
        var el = document.getElementById("error-Lastname");
        el.innerHTML = "Fill in your last name";
        done = false;
    } else {
        var el = document.getElementById("error-Lastname");
        el.innerHTML = "";

    }

    if (!fo['address'] || fo['address'] == '') {
        var el = document.getElementById("error-Address");
        el.innerHTML = "Fill in your address";
        done = false;
    } else {
        var el = document.getElementById("error-Address");

    }

    if (!fo['postalcode'] || fo['postalcode'] == '') {
        var el = document.getElementById("error-Postalcode");
        el.innerHTML = "Fill in your postal code";
        done = false;
    } else {
        var el = document.getElementById("error-Postalcode");
        el.innerHTML = "";

    }

    if (!fo['country'] || fo['country'] == '') {
        var el = document.getElementById("error-Country");
        el.innerHTML = "Fill in your country";
        done = false
    } else {
        var el = document.getElementById("error-Country");
        el.innerHTML = "";

    }

    if (!fo['shipaddress'] || fo['shipaddress'] == '') {
        var el = document.getElementById("error-Shipaddress");
        el.innerHTML = "Fill in your shipaddress";
        done = false;
    } else {
        var el = document.getElementById("error-Shipaddress");
        el.innerHTML = "";

    }

    if (!fo['shippostalcode'] || fo['shippostalcode'] == '') {
        var el = document.getElementById("error-Shippostalcode");
        el.innerHTML = "Fill in your shippostalcode";
        done = false;
    } else {
        var el = document.getElementById("error-Shippostalcode");
        el.innerHTML = "";

    }

    if (!fo['shipcountry'] || fo['shipcountry'] == '') {
        var el = document.getElementById("error-Shipcountry");
        el.innerHTML = "Fill in your shipcountry";
        done = false;
    } else {
        var el = document.getElementById("error-Shipcountry");
        el.innerHTML = "";

    }

    if (!fo['username'] || fo['username'] == '') {
        var el = document.getElementById("error-Username");
        el.innerHTML = "Fill in your username";
        done = false;
    } else {
        el.innerHTML = "";
    }

    if (!fo['password'] || fo['password'] == '') {
        var el = document.getElementById("error-Password");
        el.innerHTML = "Fill in your password";
        done = false;
    } else {
        var el = document.getElementById("error-Password");
        el.innerHTML = "";
    }

    if (!fo['password2'] || fo['password2'] == '') {
        var el = document.getElementById("error-Password2");
        el.innerHTML = "Fill in your password";
        done = false;
    }
    else{
        var el = document.getElementById("error-Password2");
        el.innerHTML = "";
    }

    if (done == false) {
        return false;
    } else {
        return true;
    }
}