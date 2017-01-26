// var ip = window.location.hostname;
// var port = window.location.port;
// var username = '';
// var password = '';
// var cartList = [];
// var user;
// var wishlist;
//
//
// // Modifiying functions
//
// function uArray(array) {
//     return array.filter(function(itm,i,array) {
//         return i==array.indexOf(itm);
//     });
// }                        // Returns an array with only unique values
//
// function toUpperCaseFirst(string) {
//     string = string.toLowerCase().replace(/\b[a-z]/g, function(letter) {
//         return letter.toUpperCase();
//     });
//     return string;
// }             // Makes the first letter of the string upper-cased
//
// function jString(value) {
//     return '\'' + value + '\'';
// }                       // Puts single quotes around a given string
//
// function showKey(string) {
//     string = string.split('_');
//     var result = '';
//     for (i = 0; i < string.length; i++) {
//         if(i != 0) {
//             result = result + toUpperCaseFirst(string[i]) + ' ';
//         }
//     }
//     return result;
// }                      // Edits the String data so it gets prettier to look at (for example, from "model_key" to "Key")
//
// function getFormObjects(formId) {
//     var formObj = {};
//     var inputs = $(formId).serializeArray();
//     $.each(inputs, function (i, input) {
//         formObj[input.name] = input.value;
//     });
//     return formObj;
// }               // Seperates individual parts of forms into key-value pairs
//
// function empty(value) {
//     if(value != '' && value != undefined && value != null && value && value.trim()) {
//         return false;
//     } else {
//         return true;
//     }
// }                         // Checks if a String is empty
//
// function setIfNotEmpty(value, fallback) {
//     if(!empty(value)) {
//         return value;
//     } else {
//         return fallback;
//     }
// }       // Returns a value if it is not empty, otherwise it returns the fallback
//
// function processEditForm() {
//     var fo = getFormObjects('#editform');
//     if(!empty(fo['currentusername'])) {
//         if(!empty(fo['currentpassword']) || user.role == 'admin') {
//             user.username = setIfNotEmpty(fo['username'], user.username);
//             user.password = setIfNotEmpty(fo['password'], user.password);
//             user.firstname = setIfNotEmpty(fo['firstname'], user.firstname);
//             user.lastname = setIfNotEmpty(fo['lastname'], user.lastname);
//             user.address = setIfNotEmpty(fo['address'], user.address);
//             user.postalcode = setIfNotEmpty(fo['postalcode'], user.postalcode);
//             user.country = setIfNotEmpty(fo['country'], user.country);
//             user.shipaddress = setIfNotEmpty(fo['shipaddress'], user.shipaddress);
//             user.shippostalcode = setIfNotEmpty(fo['shippostalcode'], user.shippostalcode);
//             user.shipcountry = setIfNotEmpty(fo['shipcountry'], user.shipcountry);
//             user.role = setIfNotEmpty(fo['role'], user.role);
//             user.currentusername = setIfNotEmpty(fo['currentusername']);
//             user.currentpassword = setIfNotEmpty(fo['currentpassword']);
//             return true;
//         } else {
//             swal({
//                 title: "Ooops!",
//                 text: "You forgot to enter your password! Please fill in your password",
//                 timer: 1700
//             });
//             //alert("lol");
//         }
//     } else {
//         //console.log("No user");
//         swal({
//             title: "Ooops!",
//             text: "You forgot to enter your username! Please fill in your username",
//             timer: 1700
//         });
//     }
// }                    // Validity check for the Edit-form.
//
// function addCarToCart(id, make, model, year) {
//     var item = $('<option value="">'+ make + " " + model+ " " + year + '</option>');
//     cartList.push(item);
//     //item.append(JSON.stringify(cartList));
//     $('#subbar').hide();
//     swal({
//         title: "Wonderful!",
//         text: make + '' + model + ' added to your shopping cart!',
//         timer: 1700
//     })
//     $.get('http://' + ip + ':' + port + '/stats/carBought'); // Adds one to the number of cars bought today in the database
// }  // Add items to the cart
//
// function onRemoveCartItem() {
//     $('#cList').find("option:selected").remove();
//     //swal("Shame on you!","Such a nice car is deleted from your list :(", "success");
//     swal({
//         title: ":(",
//         text: "The car was removed succesfully",
//         timer: 1700
//     })
// }                   // Removes an item from the cart
//
// function addToWishList(id) {
//     if(user) {
//         swal({
//             title: "Wonderful!",
//             text: "You've added it to wishlist!",
//             timer: 1700
//         });
//         var url = 'http://' + ip + ':' + port + '/wladd';
//         user.addwishlistid = id;
//         submitWishlistAjax(url, user, function() {
//             var list = $('<div></div>');
//             for (var i = wishlist.length - 1; i >= 0; i--) {
//                 var line = $('<p style="display: inline-block">' + wishlist[i].properties.make + ' ' + wishlist[i].properties.model + ' ' + wishlist[i].properties.year + ' - </p><button style="display: inline-block">Add To Cart</button><button onclick="removeFromWishList(' + wishlist[i]._id + ')" style="display: inline-block">Remove</button><br>');
//                 list.append(line);
//             }
//             $('#wishlistlist').html(list);
//         });
//     } else {
//         swal({
//             title: "Ooops!",
//             text: "You have to login in order to add items in your wishlist!",
//             timer: 1700
//         })
//     }
// }                    // Add items to wishlist
//
// function removeFromWishList(id) {
//     if(user) {
//         user.removewishlistid = id;
//         var url = 'http://' + ip + ':' + port + '/wldel';
//         submitWishlistAjax(url, user, function() {
//             setWishListView();
//         });
//     } else {
//         swal({
//             title: "Oops!",
//             text: "You have to log in, in order to remove items from your wishlist",
//             timer: 1700
//         });
//     }
// }               // Remove items from wishlist
//
// function adminLoggedIn() {
//     $('#chartsButton').css('visibility', 'visible');
//     $('#cardbutton').css('visibility', 'visible');
// }                      // Triggered when an admin has logged in
//
// function userLoggedIn(){
//     $('#cardbutton').css('visibility', 'visible');
// }
// function logOut() {
//     var empty;
//     user = empty;
//     $('#accountButton').text('LOG IN -');
//     $('#chartsButton').css('visibility', 'hidden');
//     $('#cardbutton').css('visibility', 'hidden');
//     setJSONTable('/filter/Car');
// }                             // Log out the user, go back to initial state
//
//
// // View-making functions
//
// function setSubbarTo(file, callback) {
//     var url = 'http://' + ip + ':' + port + '/views/' + file;
//     $.get(url, function(data) {
//         $('#subbar').html(data);
//         if(callback != undefined) {
//             callback(); //This function is ran when the async .get is done
//         }
//     });
// }
//
// function setContentTo(file, callback) {
//     $('subbar').hide();
//     var url = 'http://' + ip + ':' + port + '/views/' + file;
//     $('#content').css('background-color', '');
//     $.get(url, function(data) {
//         $('#content').html(data);
//         $('#subbar').hide();
//         if(callback != undefined) {
//             callback(); //This function is ran when the async .get is done
//         }
//     });
// }
//
//
// // View-setting functions
//
// function setLoginView() {
//     if(!user || user == undefined) {
//         setContentTo('login.html');
//     } else {
//         setProfileView(user);
//     }
// }
//
// function setPublicWishlistView(){
//     setContentTo('allWishLists.html');
//     $.get('http://' + ip + ':' + port + '/wishlists', function(data){
//         var list = $('<div></div>');
//         for (var i = data.length - 1; i >= 0; i--) {
//             var line = $('<p onclick="showPublicWishList(' + "'" + data[i] + "'" + ')">' + data[i] + '</p>');
//             list.append(line);
//         }
//
//         $('#publicWishlistUsers').html(list);
//     });
// }
//
// function showPublicWishList(username) {
//     console.log(username);
//     $.get('http://' + ip + ':' + port + '/user/' + username + '/wishlist', function (data) {
//         var list = $('<div></div>');
//         for (var i = data.length - 1; i >= 0; i--) {
//             var line = $('<p onclick="setDetailView(' + data[i]._id+')" style="display: inline-block">' + data[i].properties.make + ' ' + data[i].properties.model + ' ' + data[i].properties.year + ' - </p>');
//             list.append(line);
//         }
//
//         console.log(list);
//         $('#publicWishListCurrent').html(list);
//     });
// }
//
// function setRegisterView() {
//     setContentTo('register.html');
// }
//
// function setProfileView(user) {
//     setContentTo('profile.html', function() {
//
//         $('#name').append(user.firstname);
//         $('#lastname').append(user.lastname);
//         $('#username').append(user.username);
//         $('#address').append(user.address);
//         $('#postalcode').append(user.postalcode);
//         $('#country').append(user.country);
//         $('#shipaddress').append(user.shipaddress);
//         $('#shippostalcode').append(user.shippostalcode);
//         $('#shipcountry').append(user.shipcountry);
//         $('#role').append(user.role);
//         $('#profile').append('<button onclick="setEditProfileView()">Edit Profile</button>');
//         if (user.role == 'admin'){
//             $('#profile').append('<button onclick="setDeleteAccountView()">Delete an account</button>')
//             $('#profile').append('<button onclick="setBlockAccountView()">Block an account</button>')
//         }
//     });
// }
//
// function setBlockedProfileView(){
//     setContentTo('profile.html', function(){
//         var id = document.getElementById('profile');
//         id.innerHTML = "Sorry, but you have been blocked"
//     })
// }
//
// function setDeleteAccountView(){
//     setContentTo('delete.html')
// }
//
// function setBlockAccountView(){
//     setContentTo('block.html')
// }
//
// function setEditProfileView() {
//     setContentTo('editprofile.html', function() {
//         if(user.role === 'admin') {
//             $('#currentpasswordinput').hide();
//         } else {
//             $('#currentpasswordinput').show();
//         }
//     });
// }
//
// function setDetailView(value) {
//     setContentTo('details.html', function() {
//         var url = 'http://' + ip + ':' + port + '/detail/' + value;
//         $.get(url, function(data) {
// //                $('#detailimage').html('<img id="image" src="http://www.pngpix.com/wp-content/uploads/2016/02/BMW-Car-PNG-image-1.png">');
//             $('#detailimage').html('<img src="/images/' + data[0].properties.make.toString() + '/' + data[0].properties.model.toString() + '.png">');
//             $('#details .title').append(data[0].properties.make + " " + data[0].properties.model);
//             $('#subtitle').append(data[0].properties.year);
//             $('#price').append('&euro;' + data[0].properties.price);
//             $('#optionsbar').html('<div class="imagebutton" id="addtocartbutton" onclick="addCarToCart(\'' + data[0]._id.toString() + '\', \'' + data[0].properties.make.toString() + '\', \'' + data[0].properties.model.toString() + '\', \'' + data[0].properties.year.toString() + '\')"></div>' +
//                 '<div class="imagebutton" id="addtowishlistbutton" onclick="addToWishList(\'' + data[0]._id.toString() + '\', \'' + data[0].properties.make.toString() + '\', \'' + data[0].properties.model.toString() + '\')"></div>');
//
//             var blacklist = ['model_sold_in_us', 'model', 'make', 'year', 'make_display', 'price', 'model_year', 'model_make_display', 'model_make_id', 'model_trim', 'model_name'];
//
//             var list = $('<ul></ul>');
//             for (var key in data[0].properties) {
//                 if (data[0].properties.hasOwnProperty(key)) {
//                     if(data[0].properties[key] != 'null' && data[0].properties[key] != '' && $.inArray(key, blacklist) == -1) {
//                         list.append('<li>' + showKey(key) + ': ' + data[0].properties[key] + '</li>');
//                     }
//                 }
//             }
//
//             $('#speclist').html(list);
//
//             var img = document.createElement('img');
//             img.setAttribute('src', '/images/' + data[0].properties.make.toString() + '/' + data[0].properties.model.toString() + '.png')
//
//             img.addEventListener('load', function() {
//                 var vibrant = new Vibrant(img);
//                 var swatches = vibrant.swatches();
//                 $('#detailpage')
//                     .css('background', '')
//                     .css('background', swatches['Vibrant'].getHex())
//                     .css('background', '-webkit-linear-gradient(white, ' + swatches['Vibrant'].getHex() + ')')
//                     .css('background', 'linear-gradient(white, ' + swatches['Vibrant'].getHex() + ')');
//             });
//         });
//     });
//     $.get('http://' + ip + ':' + port + '/stats/carViewed'); // Adds one to the number of cars viewed today in the database
// }
//
// function setJSONTable(value, first) {
//     var url = 'http://' + ip + ':' + port + value;
//     $.get(url, function(data) {
//         var table = $('<table>');
//
//         var row = $('<tr>');
//         if (first!= undefined){
//             var i = 7;
//         }
//         else{
//             var i = data.length - 1;
//         }
//         for (i; i >= 0; i--) {
//             var itemcontainer = $('<a id="cell"' + i + ' onclick="setDetailView(' + data[i]._id + ')"></a>');
//             var item = $('<td></td>');
//             item.append('<img src= "/images/' + data[i].properties.make.toString() + '/' + data[i].properties.model.toString() + '.png">');
//             item.append(data[i].properties.make);
//             item.append(" " + data[i].properties.model);
//             item.append(" " + data[i].properties.year);
//             item.append("<br>&euro;" + data[i].properties.price);
//
//             itemcontainer.append(item);
//             row.append(itemcontainer);
//         }
//
//         row.append('</tr>');
//         table.append(row);
//         table.append('</table>');
//         $('#content').html('');
//         $('#content').append(table);
//     });
// }
//
// function setFilters() {
//     $('#filter').hide();
//     $.get('http://' + ip + ':' + port + '/filter/Car/model/nn', function(data){
//         var brandarray = [];
//         var modelarray = [];
//         var yeararray = [];
//
//         brandarray.push('<option value="" disabled="disabled" selected="selected">Brand</option>');
//         modelarray.push('<option value="" disabled="disabled" selected="selected">Model</option>');
//         yeararray.push('<option value="" disabled="disabled" selected="selected">Year</option>');
//
//         for (var i = data.length - 1; i >= 0; i--) {
//             brandarray.push('<option value="">' + data[i].properties.make + '</option>');
//             modelarray.push('<option value="">' + data[i].properties.model + '</option>');
//             yeararray.push('<option value="">' + data[i].properties.year + '</option>');
//         }
//
//         brandarray = uArray(brandarray);
//         modelarray = uArray(modelarray);
//         yeararray = uArray(yeararray);
//
//         $('#selectbrand').html(brandarray.join(''));
//         $('#selectmodel').html(modelarray.join(''));
//         $('#selectyear').html(yeararray.join(''));
//
//         $('#filter').show();
//     });
// }                         // Sets all filters (Warning: Deprecated. Use the "setFilter" instead)
//
// function setFilter(property, extra) {
//     var string = property;
//     if(extra != undefined) {
//         string = string + extra;
//     }
//
//     $.get('http://' + ip + ':' + port + '/filter/Car?property1=' + string, function(data){
//         var array = [];
//         array.push('<option value="" disabled="disabled" selected="selected">' + toUpperCaseFirst(property) + '</option>');
//
//         for (var i = data.length - 1; i >= 0; i--) {
//             array.push('<option value="">' + data[i] + '</option>');
//         }
//
//         array = uArray(array);
//         $('#select' + property).html(array.join(''));
//     });
// }           // Sets a filter to the values obtained trough the database
//
// function setContactView() {
//     setContentTo('contact.html');
// }
//
// function setWishListView(uname) {
//     if(user) {
//         $("#wlsetvisibility").val(user.wishlist);
//         var username = user.username;
//         if(uname || uname != undefined) {
//             username = uname;
//         }
//
//         submitViewWishList(username, function() {
//             var list = $('<div></div>');
//             for (var i = wishlist.length - 1; i >= 0; i--) {
//                 var line = $('<p onclick="setDetailView(' + wishlist[i]._id + ')" style="display: inline-block">' + wishlist[i].properties.make + ' ' + wishlist[i].properties.model + ' ' + wishlist[i].properties.year + ' - </p><button onclick="addCarToCart(\'' + wishlist[i]._id + '\', \'' + wishlist[i].properties.make + '\', \'' + wishlist[i].properties.model + '\', \'' + wishlist[i].properties.year + '\')" style="display: inline-block">Add To Cart</button><button onclick="removeFromWishList(' + wishlist[i]._id + ')" style="display: inline-block">Remove</button><br>');
//                 list.append(line);
//             }
//             $('#wishlistlist').html(list);
//             $('#wishlist #visibility').show();
//         });
//
//     } else {
//         $('#wishlistlist').html('<a onclick="setLoginView()"><b style="color: white">Log in</b></a> before you can use the wishlist.');
//     }
// }
//
// function setChartsView() {
//     setContentTo('charts.html');
// }
//
// function setHistoryView() {
//     setContentTo('history.html');
//     $.get('http://' + ip + ':' + port + '/order/'+ user.username, function (data) {
//         var list = $('<div></div>');
//         for (var i = data.length - 1; i >= 0; i--) {
//             var line = $('<p onclick="showOrderHistory(' + "'" + data[i]._id + "'" + ')">' + data[i]._id + '</p>');
//             list.append(line);
//         }
//         $('#orders').html(list);
//     });
// }
// function showOrderHistory(id) {
//     $.get('http://' + ip + ':' + port + '/orderinfo/' + id, function (data) {
//         var list = $('<div></div>');
//         for (var i = data.length - 1; i >= 0; i--) {
//             console.log(data.length);
//             console.log(data[i].properties);
//             var line = $('<p style="display: inline-block">' + data[i].properties + ' -split-' + data[i] + ' - </p>');
//             list.append(line);
//         }
//         $('#ordersinfo').html(list);
//     });
// }
// // View-changing functions
//
// function toggleAndSetSubbar(id, page, fn) {
//     if($('#subbar').css('display') == 'none' || !$('#' + id).length) {
//         $('#subbar').show();
//         setSubbarTo(page + '.html', fn);
//     } else {
//         $('#subbar').hide();
//     }
// }
//
// function showFilters() {
//     toggleAndSetSubbar('filterbar', 'filter', function() {
//         $('#selectmodel').hide();
//         setFilter('make');
//         setFilter('year');
//         addListeners('make');
//         addListeners('model');
//         addListeners('year');
//     });
// }
//
// function showSearch() {
//     toggleAndSetSubbar('searchbar', 'search');
//     $("#searchform").bind('keyup', function(event){
//         if(event.keyCode == 13 || event.which == 13){
//             event.preventDefault();
//             submitSearch();
//         }
//     });
// }
//
// function showCart() {
//     toggleAndSetSubbar('cart', 'cart', function() {
//         //var item = $('<p></p>');
//         var deleteButton = $('<input type= "button"id="btDel" value="Remove" onclick= onRemoveCartItem() />');
//
//         var box = $('<select id = "cList"></select>' )
//         cartList.join('');
//         box.append(cartList);
//         $('#cart').append(box);
//         $('#cart').append(deleteButton);
//
//     });
// }
//
// function showWishList() {
//     toggleAndSetSubbar('wishlist', 'wishlist', function() {
//         setWishListView();
//     });
// }
//
//
// // Data-requesting/changing functions
//
// function deleteUser() {
//     var formobjects = getFormObjects('#deleteform');
//     var id = document.getElementById("error-deleteuser");
//     id.innerHTML = "Delete succesful";
//     var url = 'http://' + ip + ':' + port + '/delete';
//     $.ajax({
//         url: url,
//         type: 'POST',
//         data: JSON.stringify({'deletename':formobjects['deletename']}),
//         datatype: 'json',
//         contentType: "application/x-www-form-urlencoded"
//     });console.log("ajaxed");
//
// }
//
// function blockUser(){
//     var formobjects = getFormObjects('#blockform');
//     var bid = document.getElementById("error-blockuser");
//     bid.innerHTML = "Block succesful";
//     var url = 'http://' + ip + ':' + port + '/block';
//     $.ajax({
//         url: url,
//         type: 'POST',
//         data: JSON.stringify({'blockname':formobjects['blockname']}),
//         datatype: 'json',
//         contentType: "application/x-www-form-urlencoded"
//     });console.log("ajaxed");
// }
//
// function submitLogin() {
//     var formobjects = getFormObjects('#loginform');
//     username = formobjects['username'];
//     password = formobjects['password'];
//     var fo = getFormObjects('#loginform');
//     $.get('http://' + ip+":"+port+"/users/usernameblocked/" + fo['username'], function (data) {
//         if(data == true){
//             setBlockedProfileView();
//         }
//         else{
//             var url = 'http://' + ip + ':' + port + '/login';
//
//             $.ajax({
//                 url: url,
//                 type: 'POST',
//                 data: JSON.stringify({'username':username, 'password':password}),
//                 datatype: 'json',
//                 contentType: "application/x-www-form-urlencoded",
//                 success: function(data) {
//                     if(data.length != '0') {
//                         user = data[0].properties;
//                         if(user && user != undefined) {
//                             setProfileView(user);
//                             submitViewWishList();
//                             $('#accountButton').text('ACCOUNT -');
//
//                             if (user.role = "admin") {
//                                 adminLoggedIn();
//                             }if (user.role = "user"){
//                                 userLoggedIn();
//                             }
//                         }
//                     } else {
//                         swal({
//                             title: "Ooops!",
//                             text: "Wrong identification. Please try again.",
//                             timer: 1700
//                         })
//                     }
//                 },
//                 error: function() { swal({
//                     title: "Ooops!",
//                     text: "Something went terribly wrong. Please try again.",
//                     timer: 1700
//                 }) }
//             }); //Requests the account data from the server in a safe way
//         }
//     })
// }
//
// function validatePasswordCorrect() {
//     var password = document.getElementById("password")
//     var password2 = document.getElementById("password2")
//     if(password.value == password2.value){
//         return true
//     }
//     else{
//         return false
//     }
// }
//
// function validateUsernameExist(id, fieldname, action){
//     var fo = getFormObjects(id);
//     console.log(fo[fieldname]);
//     $.get('http://' + ip+":"+port+"/users/usernametaken/" + fo[fieldname], function (data) {
//         if (data == true){
//             if (action == 'delete'){
//                 deleteUser();
//             }
//             else if (action == 'block'){
//                 blockUser();
//             }
//             else if (action == 'registreren'){
//                 var id = document.getElementById("error-Username");
//                 id.innerHTML = "Username already exist"
//             }
//
//         }
//         else{
//             if (action == 'delete'){
//                 var id = document.getElementById("error-deleteuser");
//                 id.innerHTML = "Username doesn't exist"
//             }
//             else if (action == 'block'){
//                 var id = document.getElementById("error-blockuser");
//                 id.innerHTML = "Username doesn't exist"
//             }
//             else if (action == 'registreren'){
//                 var id = document.getElementById("error-Username");
//                 id.innerHTML = ""
//                 submitRegister();
//
//             }
//
//         }
//     })
// }
//
// function submitDelete(){
//     validateUsernameExist('#deleteform','deletename', 'delete');
// }
//
// function submitBlock(){
//     validateUsernameExist('#blockform','blockname','block');
// }
//
// function submitValidatedRegister(){
//     validateUsernameExist('#register','username','registreren');
// }
//
// function submitRegister() {
//     console.log("im submitted");
//     if (validateRequiredFields() && validatePasswordCorrect) {
//         var fo = getFormObjects('#register') // form object
//         var url = 'http://' + ip + ':' + port + '/register';
//         var data = JSON.stringify({
//             'firstname': fo['firstname'],
//             'lastname': fo['lastname'],
//             'address': fo['address'],
//             'postalcode': fo['postalcode'],
//             'country': fo['country'],
//             'shipaddress': fo['shipaddress'],
//             'shipcountry': fo['shipcountry'],
//             'shippostalcode': fo['shippostalcode'],
//             'username': fo['username'],
//             'password': fo['password']
//         });
//         swal({
//             title: "Wonderful",
//             text: "You are now registred at CarShop!",
//             timer: 1700
//         })
//         console.log(data);
//
//         $.ajax({
//             url: url,
//             type: 'POST',
//             data: data,
//             datatype: 'json',
//             contentType: "application/x-www-form-urlencoded",
//             succes: function () {
//                 console.log('Succes!');
//                    swal({
//                        title: "Wonderful!",
//                        text: "Edit succesful",
//                        timer: 1700
//                    })
//                 setJSONTable('/filter/Car');
//             },
//             error: function () {
//                 console.log('Failure!');
//                 swal({
//                     title: "Ooops!",
//                     text: "Something went terribly wrong. Please try again.",
//                     timer: 1700
//                 });
//             }
//         });
//     }
// }
//
// function validateRequiredFields() {
//     var done = true;
//     var fo = getFormObjects('#register');
//     var query = 'MATCH (o:User { username: \'' + username + '\' }) RETURN o';
//
//     if (!fo['firstname'] || fo['firstname'] == '') {
//         var el = document.getElementById("error-Firstname");
//         el.innerHTML = "Fill in your first name"
//         done = false;
//     } else {
//         var el = document.getElementById("error-Firstname");
//         el.innerHTML = "";
//     }
//
//     if (!fo['lastname'] || fo['lastname'] == '') {
//         var el = document.getElementById("error-Lastname");
//         el.innerHTML = "Fill in your last name";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Lastname");
//         el.innerHTML = "";
//
//     }
//
//     if (!fo['address'] || fo['address'] == '') {
//         var el = document.getElementById("error-Address");
//         el.innerHTML = "Fill in your address";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Address");
//
//     }
//
//     if (!fo['postalcode'] || fo['postalcode'] == '') {
//         var el = document.getElementById("error-Postalcode");
//         el.innerHTML = "Fill in your postal code";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Postalcode");
//         el.innerHTML = "";
//
//     }
//
//     if (!fo['country'] || fo['country'] == '') {
//         var el = document.getElementById("error-Country");
//         el.innerHTML = "Fill in your country";
//         done = false
//     } else {
//         var el = document.getElementById("error-Country");
//         el.innerHTML = "";
//
//     }
//
//     if (!fo['shipaddress'] || fo['shipaddress'] == '') {
//         var el = document.getElementById("error-Shipaddress");
//         el.innerHTML = "Fill in your shipaddress";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Shipaddress");
//         el.innerHTML = "";
//
//     }
//
//     if (!fo['shippostalcode'] || fo['shippostalcode'] == '') {
//         var el = document.getElementById("error-Shippostalcode");
//         el.innerHTML = "Fill in your shippostalcode";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Shippostalcode");
//         el.innerHTML = "";
//
//     }
//
//     if (!fo['shipcountry'] || fo['shipcountry'] == '') {
//         var el = document.getElementById("error-Shipcountry");
//         el.innerHTML = "Fill in your shipcountry";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Shipcountry");
//         el.innerHTML = "";
//
//     }
//
//     if (!fo['username'] || fo['username'] == '') {
//         var el = document.getElementById("error-Username");
//         el.innerHTML = "Fill in your username";
//         done = false;
//     } else {
//         el.innerHTML = "";
//     }
//
//     if (!fo['password'] || fo['password'] == '') {
//         var el = document.getElementById("error-Password");
//         el.innerHTML = "Fill in your password";
//         done = false;
//     } else {
//         var el = document.getElementById("error-Password");
//         el.innerHTML = "";
//     }
//
//     if (!fo['password2'] || fo['password2'] == '') {
//         var el = document.getElementById("error-Password2");
//         el.innerHTML = "Fill in your password";
//         done = false;
//     }
//     else{
//         var el = document.getElementById("error-Password2");
//         el.innerHTML = "";
//     }
//
//     if (done == false) {
//         return false;
//     } else {
//         return true;
//     }
// }
//
// function submitEdit() {
//     var url = 'http://' + ip + ':' + port + '/edituser';
//     if(processEditForm()) {
//         $.ajax({
//             url: url,
//             type: 'POST',
//             data: JSON.stringify(user),
//             datatype: 'json',
//             contentType: "application/x-www-form-urlencoded",
//             success: function() {
//                 swal({
//                     title: "Wonderful!",
//                     text: "Edit succesful",
//                     timer: 1700
//                 })
//                 //logOut();
//                 setContentTo('profile.html');
//             },
//             error: function() {
//                 swal({
//                     title: "Ooops..!",
//                     text: "Edit went wrong. Please try again!",
//                     timer: 1700
//
//                 });
//             }
//         }); //Sends the account data to the server in a safe way
//     }
// }
//
// function submitSearch() {
//     var formobjects = getFormObjects('#searchform');
//     var url = '/search/' + formobjects['search'];
//     console.log(formobjects['search']);
//     setJSONTable(url);
// }
//
// function submitVisibilityChange() {
//     user.wlvisibility = $("#wlsetvisibility").val();
//     console.log('u: ' + user.wlvisibility + ' $ ' + $("#wlsetvisibility").val());
//     submitWishlistAjax('http://' + ip + ':' + port + '/wlvis', user);
// }
//
// function submitWishlistAjax(url, data, fn) {
//     $.ajax({
//         url: url,
//         type: 'POST',
//         data: JSON.stringify(data),
//         datatype: 'json',
//         contentType: "application/x-www-form-urlencoded",
//         success: function(data) {
//             wishlist = data;
//             if(fn) {
//                 fn();
//             }
//         },
//         error: function() { }
//     }); //Sends the account data to the server in a safe way
// }
//
// function submitViewWishList(wluser, fn) {
//     var url = 'http://' + ip + ':' + port + '/wl';
//     user.wishlistusername = wluser;
//     submitWishlistAjax(url, user, fn);
// }
//
//
// // General Functions
//
// function addListeners(value) {
//     var property = false;
//     $("#select" + value).hover(function () {
//         if(!property) {
//             setFilter(value);
//             property = true;
//         }
//     });
//
//     $("#select" + value).change(function () {
//         if(value == 'make') {
//             setFilter('model', '&extraprop=make&extraval=' + $('#selectmake option:selected').text());
//             $('#selectmodel').show();
//             $('#selectmodel').prop('selectedIndex',0);
//             setJSONTable('/filter/Car?property1=' + value + '&value1=' + $('#selectmake option:selected').text());
//         } else if(value == 'model') {
//             setJSONTable('/filter/Car?property1=make&value1=' + $('#selectmake option:selected').text() + '&property2=' + value + '&value2=' + $('#selectmodel option:selected').text());
//         } else {
//             $('#selectmodel').prop('selectedIndex',0);
//             $('#selectmodel').hide();
//             $('#selectmake').prop('selectedIndex',0);
//             setJSONTable('/filter/Car?property1=' + value + '&value1=' + $('#select' + value + ' option:selected').text());
//         }
//     });
// }
//
// function getCars() {
//     //Initial Setup
//     setJSONTable('/filter/Car');
//
// }
//
// function initial() {
//     setJSONTable('/filter/Car', 1);
//
//     jQuery(document).bind("keyup", function(e) {
//         if(e.which == 13 || e.keycode == 13) {
//             e.preventDefault();
//             if($('#login').length) {
//                 submitLogin()
//             } else if($('#searchform').length) {
//                 submitSearch();
//             }
//         }
//     }); //Checks if the enter key is pressed on the login page to submit the form
// }
//
//
// function initial() {
//     setJSONTable('/filter/Car', 1);
// }
// initial();