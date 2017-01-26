function setEditProfileView() {
    setContentTo('editprofile.html', function() {
        if(user.role === 'admin') {
            $('#currentpasswordinput').hide();
        } else {
            $('#currentpasswordinput').show();
        }
    });
}

function submitEdit() {
    var url = 'http://' + ip + ':' + port + '/edituser';
    if(processEditForm()) {
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(user),
            datatype: 'json',
            contentType: "application/x-www-form-urlencoded",
            success: function() {
                swal({
                    title: "Wonderful!",
                    text: "Edit succesful",
                    timer: 1700
                })
                //logOut();
                setContentTo('profile.html');
            },
            error: function() {
                swal({
                    title: "Ooops..!",
                    text: "Edit went wrong. Please try again!",
                    timer: 1700

                });
            }
        }); //Sends the account data to the server in a safe way
    }
}

function processEditForm() {
    var fo = getFormObjects('#editform');
    if(!empty(fo['currentusername'])) {
        if(!empty(fo['currentpassword']) || user.role == 'admin') {
            user.username = setIfNotEmpty(fo['username'], user.username);
            user.password = setIfNotEmpty(fo['password'], user.password);
            user.firstname = setIfNotEmpty(fo['firstname'], user.firstname);
            user.lastname = setIfNotEmpty(fo['lastname'], user.lastname);
            user.address = setIfNotEmpty(fo['address'], user.address);
            user.postalcode = setIfNotEmpty(fo['postalcode'], user.postalcode);
            user.country = setIfNotEmpty(fo['country'], user.country);
            user.shipaddress = setIfNotEmpty(fo['shipaddress'], user.shipaddress);
            user.shippostalcode = setIfNotEmpty(fo['shippostalcode'], user.shippostalcode);
            user.shipcountry = setIfNotEmpty(fo['shipcountry'], user.shipcountry);
            user.role = setIfNotEmpty(fo['role'], user.role);
            user.currentusername = setIfNotEmpty(fo['currentusername']);
            user.currentpassword = setIfNotEmpty(fo['currentpassword']);
            return true;
        } else {
            swal({
                title: "Ooops!",
                text: "You forgot to enter your password! Please fill in your password",
                timer: 1700
            });
            //alert("lol");
        }
    } else {
        //console.log("No user");
        swal({
            title: "Ooops!",
            text: "You forgot to enter your username! Please fill in your username",
            timer: 1700
        });
    }
}                    // Validity check for the Edit-form.
