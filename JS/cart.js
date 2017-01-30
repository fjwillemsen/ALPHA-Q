function addCarToCart(id, make, model, year, price) {
    var item = $('<option value="">'+ make + " " + model+ " " + year + " " + price +  '</option>');
    var item2 = make + " " + model + " " + year + " " + "&#8364;" + price;

    cartList.push(item);
    orderList.push(item2);
    cartPriceList.push(parseInt(price));
    idList.push(id);
    calculatePrice();

    //item.append(JSON.stringify(cartList));
    $('#subbar').hide();
    swal({
        title: "Wonderful!",
        text: make + ' ' + model + ' added to your shopping cart!',
        timer: 1700
    })
}  // Add items to the cart

function showCart() {
    toggleAndSetSubbar('cart', 'cart', function() {
        var deleteButton = $('<input type= "button"id="btDel" value="Remove" onclick= onRemoveCartItem() />');
        var paymentButton = $('<input type= "button"id="btPay" value="Set order" onclick= setPaymentContentResult() />');

        var box = $('<select id="cList"></select>' );
        cartList.join('');
        box.append(cartList);
        $('#cart').append(box);
        $('#cart').append(deleteButton);
        $('#cart').append(paymentButton);
    });
}

function onRemoveCartItem() {
    cartList.remove($('#cList').prop('selectedIndex'));
    orderList.remove($('#cList').prop('selectedIndex'));
    cartPriceList.remove($('#cList').prop('selectedIndex'));
    idList.remove($('#cList').prop('selectedIndex'));
    calculatePrice();
    showCart();
    //swal("Shame on you!","Such a nice car is deleted from your list :(", "success");
    swal({
        title: ":(",
        text: "The car was removed succesfully",
        timer: 1700
    })
}                   // Removes an item from the cart

// Order view
function setPaymentContentResult() {
    var list = $('<div></div>');
    for (var i = orderList.length - 1; i >= 0; i--) {

        var line = $('<p> ' + orderList[i] + '</p><br>');
        list.append(line);
    }
    setContentTo('order.html', function call() {
        $('#orderOrder').html(list);
        document.getElementById("orderTotal").innerHTML= ("&#8364;" + cartTotalPrice);
    });
}

function calculatePrice() {
    cartTotalPrice = 0;
    for (var i = 0; i < cartPriceList.length; i++) {
        cartTotalPrice = cartTotalPrice + cartPriceList[i];
    }

    return cartTotalPrice;
}