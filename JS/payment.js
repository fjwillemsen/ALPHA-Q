function cardValidation() {
    setContentTo('afterPayment.html');
    $.get('http://' + ip + ':' + port + '/stats/carBought'); // Adds one to the number of cars bought today in the database
}

