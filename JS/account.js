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
    password = fo["password"];
    console.log(username);
    console.log(password);

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
                    if(data.length != '0') {
                        user = data[0].properties;
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
                            $('#cardbutton').css('display', 'default !important');
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
            $('#status').css('display', 'default');
        } else {
            $('#status').css('display', 'none');
        }

        $('#profileButtons').append('<button onclick="setEditProfileView()">Edit Profile</button>');
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
    $('#chartsButton').css('display', 'default !important');

}                      // Triggered when an admin has logged in

function userLoggedIn(){

}                       // Triggered when an user has logged in

function logOut() {
    var empty;
    user = empty;
    $('#accountButton').text('LOG IN -');
    $('#registerButton').css('display', 'default');
    $('#chartsButton').css('display', 'none !important');
    $('#cardbutton').css('display', 'none !important');
    setJSONTable('/filter/Car');
}                             // Log out the user, go back to initial state
