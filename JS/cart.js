function addCarToCart(id, make, model, year, price) {
    var item = $('<option value="">'+ make + " " + model+ " " + year + '</option>');
    cartTotalPrice = cartTotalPrice + parseInt(price);
    console.log(cartTotalPrice);

    cartList.push(item);
    //item.append(JSON.stringify(cartList));
    $('#subbar').hide();
    swal({
        title: "Wonderful!",
        text: make + '' + model + ' added to your shopping cart!',
        timer: 1700
    })
    $.get('http://' + ip + ':' + port + '/stats/carBought'); // Adds one to the number of cars bought today in the database
}  // Add items to the cart

function showCart() {
    toggleAndSetSubbar('cart', 'cart', function() {
        //var item = $('<p></p>');
        var deleteButton = $('<input type= "button"id="btDel" value="Remove" onclick= onRemoveCartItem() />');

        var box = $('<select id = "cList"></select>' )
        cartList.join('');
        box.append(cartList);
        $('#cart').append(box);
        $('#cart').append(deleteButton);

    });
}

function onRemoveCartItem() {
    $('#cList').find("option:selected").remove();
    //swal("Shame on you!","Such a nice car is deleted from your list :(", "success");
    swal({
        title: ":(",
        text: "The car was removed succesfully",
        timer: 1700
    })
}                   // Removes an item from the cart
