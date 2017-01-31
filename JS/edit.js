function setEditProfileView() {
    setContentTo('editprofile.html', function() {
        if(user.role === 'admin') {
            $('#currentpasswordinput').hide();
        } else {
            $('#currentpasswordinput').show();
        }
        var username = document.getElementById('currentusername');
        username.value = user.username;
        username.placeholders = '';
    });
}

function submitEdit(){
    validateUsernameExist('#editform','currentusername', 'edit');
}

function editUser() {
    var url = 'http://' + ip + ':' + port + '/edituser';
    if(processEditForm()) {
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(tempuser),
            datatype: 'json',
            contentType: "application/x-www-form-urlencoded",
            success: function(data) {
                if(!data.ok || data.ok != 'no') {
                    user = data[0].properties;
                    swal({
                        title: "Wonderful!",
                        text: "Your edit was succesful.",
                        timer: 1700
                    });
                    // setProfileView(user);
                } else {
                    swal({
                        title: "Ooops..!",
                        text: "Edit went wrong. Please try again!",
                        timer: 1700
                    });
                }

                initial()
            },
            error: function(err) {
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
            tempuser = user;
            if((fo['password'] != '' ||
                fo['firstname'] != '' ||
                fo['lastname'] != '' ||
                fo['address'] != '' ||
                fo['postalcode'] != '' ||
                fo['country'] != '' ||
                fo['shipaddress'] != '' ||
                fo['shippostalcode'] != '' ||
                fo['shipcountry'] != '' ) &&
                fo['currentusername'] != '' ) {

                tempuser.password = fo['password'];
                tempuser.firstname = fo['firstname'];
                tempuser.lastname = fo['lastname'];
                tempuser.address = fo['address'];
                tempuser.postalcode = fo['postalcode'];
                tempuser.country = fo['country'];
                tempuser.shipaddress = fo['shipaddress'];
                tempuser.shippostalcode = fo['shippostalcode'];
                tempuser.shipcountry = fo['shipcountry'];
                tempuser.currentusername = fo['currentusername'];
                tempuser.currentpassword = fo['currentpassword'];
            } else {
                swal({
                    title: "Ooops!",
                    text: "You forgot to edit at least one field.",
                    timer: 1700
                });
            }

            return true;
        } else {
            swal({
                title: "Ooops!",
                text: "You forgot to enter your password! Please fill in your password",
                timer: 1700
            });
        }
    } else {
        swal({
            title: "Ooops!",
            text: "You forgot to enter your username! Please fill in your username",
            timer: 1700
        });
    }
}                    // Validity check for the Edit-form.
