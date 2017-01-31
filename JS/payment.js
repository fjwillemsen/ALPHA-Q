new Card({
    form: document.querySelector('form'),
    container: '.card-wrapper',
    width: 350 // optional — default 350px

});
function cardValidation() {
    setContentTo('afterPayment.html');
    $.get('http://' + ip + ':' + port + '/stats/carBought'); // Adds one to the number of cars bought today in the database
}

//        var kaart = getFormObjects('#kreka')
//        if(kaart['number'] == "" || kaart['number'] ==  null){
//            var al = document.getElementById("kaartnummer")
//            al.innerHTML = "Please fill in your creditcard number"
//
//        }
//        if(kaart['name'] == ""){
//            var al = document.getElementById("voornaam")
//            al.innerHTML = "Please fill in your first name"
//        }
//        if(kaart['expiry'] == ""){
//            var al = document.getElementById("verloop")
//            al.innerHTML = "Please fill in your expiry date"
//        }
//        if(kaart['cvc'] == ""){
//            var al = document.getElementById("codecode")
//            al.innerHTML = "Please fill in your CVC number"
////        }
////        else{
//              setContentTo('afterPayment.html');
////        }
//
//    }