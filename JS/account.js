function deleteUser() {
    var formobjects = getFormObjects('#deleteform');
    var id = document.getElementById("error-deleteuser");
    id.innerHTML = "Delete succesful";
    var url = 'http://' + ip + ':' + port + '/delete';
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({'deletename':formobjects['deletename']}),
        datatype: 'json',
        contentType: "application/x-www-form-urlencoded"
    });console.log("ajaxed");

}

function blockUser(){
    var formobjects = getFormObjects('#blockform');
    var bid = document.getElementById("error-blockuser");
    bid.innerHTML = "Block succesful";
    var url = 'http://' + ip + ':' + port + '/block';
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({'blockname':formobjects['blockname']}),
        datatype: 'json',
        contentType: "application/x-www-form-urlencoded"
    });console.log("ajaxed");
}

function submitLogin() {
    var fo = getFormObjects('#loginform');
    console.log(fo);
    username = fo["username"];
    password = CryptoJS.MD5(fo["password"]);

    console.log(username);
    console.log(password);
    console.log(JSON.stringify(password));

    $.get('http://' + ip+":"+port+"/users/usernameblocked/" + fo['username'], function (data) {
        if(data == true){
            setBlockedProfileView();
        }
        else{
            var url = 'http://' + ip + ':' + port + '/login';

            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify({'username':username, 'password':password}),
                datatype: 'json',
                contentType: "application/x-www-form-urlencoded",
                success: function(data) {
                    console.log(data);
                    if(data.length != '0' && data[0] && data[0].properties) {
                        user = data[0].properties;
                        console.log("Password from server: " + data[0].properties.password);
                        user.password = {
                            words: data[0].properties.password,
                            sigBytes: 16
                        };
                        console.log("Object: " + user.password);
                        if(user && user != undefined) {
                            setProfileView(user);
                            submitViewWishList();
                            $('#accountButton').text('ACCOUNT -');

                            if (user.role == "admin") {
                                adminLoggedIn();
                            }
                            if (user.role == "user"){
                                userLoggedIn();
                            }

                            $('#registerButton').css('display', 'none');
                        }
                    } else {
                        swal({
                            title: "Ooops!",
                            text: "Wrong identification. Please try again.",
                            timer: 1700
                        })
                    }
                },
                error: function() { swal({
                    title: "Ooops!",
                    text: "Something went terribly wrong. Please try again.",
                    timer: 1700
                }) }
            }); //Requests the account data from the server in a safe way
        }
    })
}

function submitDelete(){
    validateUsernameExist('#deleteform','deletename', 'delete');
}

function submitBlock(){
    validateUsernameExist('#blockform','blockname','block');
}

function setLoginView() {
    if(!user || user == undefined) {
        setContentTo('login.html');
    } else {
        setProfileView(user);
    }
}

function setProfileView(user) {
    setContentTo('profile.html', function() {

        $('#name').append(user.firstname);
        $('#lastname').append(user.lastname);
        $('#username').append(user.username);
        $('#address').append(user.address);
        $('#postalcode').append(user.postalcode);
        $('#country').append(user.country);
        $('#shipaddress').append(user.shipaddress);
        $('#shippostalcode').append(user.shippostalcode);
        $('#shipcountry').append(user.shipcountry);
        $('#role').append(user.role);
        if(user.status && user.status != undefined && user.status != "undefined") {
            $('#status').append(user.status);
            $('#status').css('display', 'inline');
        } else {
            $('#status').css('display', 'none');
        }
        if (user.role == 'admin') {
            $('#profileButtons').append('<button onclick="setDeleteAccountView()">Delete an account</button>')
            $('#profileButtons').append('<button onclick="setBlockAccountView()">Block an account</button>')
        }
    });
}

function setBlockedProfileView(){
    setContentTo('profile.html', function(){
        var id = document.getElementById('profile');
        id.innerHTML = "Sorry, but you have been blocked"
    })
}

function setDeleteAccountView(){
    setContentTo('delete.html')
}

function setBlockAccountView(){
    setContentTo('block.html')
}

function adminLoggedIn() {
    document.getElementById('chartsButton').style.visibility = 'visible';
}                      // Triggered when an admin has logged in

function userLoggedIn(){
    document.getElementById('chartsButton').style.visibility = 'hidden';
}                       // Triggered when an user has logged in

function logOut() {
    var empty;
    user = empty;
    $('#accountButton').text('LOG IN -');
    $('#registerButton').css('display', 'inline');
    document.getElementById('chartsButton').style.visibility = 'hidden';
    setJSONTable('/filter/Car');
}                             // Log out the user, go back to initial state
