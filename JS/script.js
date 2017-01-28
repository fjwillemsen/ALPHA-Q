var ip = window.location.hostname;
var port = window.location.port;
var username = '';
var password = '';
var cartList = [];
var orderList = [];
var cartTotalPrice = 0;
var user;
var wishlist;


function setSubbarTo(file, callback) {
    var url = 'http://' + ip + ':' + port + '/views/' + file;
    $.get(url, function(data) {
        $('#subbar').html(data);
        if(callback != undefined) {
            callback(); //This function is ran when the async .get is done
        }
    });
}

function setContentTo(file, callback) {
    $('subbar').hide();
    var url = 'http://' + ip + ':' + port + '/views/' + file;
    $('#content').css('background-color', '');
    $.get(url, function(data) {
        $('#content').html(data);
        $('#subbar').hide();
        if(callback != undefined) {
            callback(); //This function is ran when the async .get is done
        }
    });
}

function setDetailView(value) {
    setContentTo('details.html', function() {
        var url = 'http://' + ip + ':' + port + '/detail/' + value;
        $.get(url, function(data) {
//                $('#detailimage').html('<img id="image" src="http://www.pngpix.com/wp-content/uploads/2016/02/BMW-Car-PNG-image-1.png">');
            $('#detailimage').html('<img src="/images/' + data[0].properties.make.toString() + '/' + data[0].properties.model.toString() + '.png">');
            $('#details .title').append(data[0].properties.make + " " + data[0].properties.model);
            $('#subtitle').append(data[0].properties.year);
            $('#price').append('&euro;' + data[0].properties.price);
            $('#optionsbar').html('<div class="imagebutton" id="addtocartbutton" onclick="addCarToCart(\'' + data[0]._id.toString() + '\', \'' + data[0].properties.make.toString() + '\', \'' + data[0].properties.model.toString() + '\', \'' + data[0].properties.year.toString() + '\', \'' + data[0].properties.price.toString() +'\')"></div>' +
                '<div class="imagebutton" id="addtowishlistbutton" onclick="addToWishList(\'' + data[0]._id.toString() + '\', \'' + data[0].properties.make.toString() + '\', \'' + data[0].properties.model.toString() + '\')"></div>');

            var blacklist = ['model_sold_in_us', 'model', 'make', 'year', 'make_display', 'price', 'model_year', 'model_make_display', 'model_make_id', 'model_trim', 'model_name'];

            var list = $('<ul></ul>');
            for (var key in data[0].properties) {
                if (data[0].properties.hasOwnProperty(key)) {
                    if(data[0].properties[key] != 'null' && data[0].properties[key] != '' && $.inArray(key, blacklist) == -1) {
                        list.append('<li>' + showKey(key) + ': ' + data[0].properties[key] + '</li>');
                    }
                }
            }

            $('#speclist').html(list);

            var img = document.createElement('img');
            img.setAttribute('src', '/images/' + data[0].properties.make.toString() + '/' + data[0].properties.model.toString() + '.png')

            img.addEventListener('load', function() {
                var vibrant = new Vibrant(img);
                var swatches = vibrant.swatches();
                $('#detailpage')
                    .css('background', '')
                    .css('background', swatches['Vibrant'].getHex())
                    .css('background', '-webkit-linear-gradient(white, ' + swatches['Vibrant'].getHex() + ')')
                    .css('background', 'linear-gradient(white, ' + swatches['Vibrant'].getHex() + ')');
            });
        });
    });
    $.get('http://' + ip + ':' + port + '/stats/carViewed'); // Adds one to the number of cars viewed today in the database
}

function setJSONTable(value, first) {
    var url = 'http://' + ip + ':' + port + value;
    $.get(url, function(data) {
        var table = $('<table>');

        var row = $('<tr>');
        if (first!= undefined){
            var i = 7;
        }
        else{
            var i = data.length - 1;
        }
        for (i; i >= 0; i--) {
            if (data[i]) {
                if(data[i].properties) {
                    if (data[i].properties.image) {
                        var itemcontainer = $('<a id="cell"' + i + ' onclick="setDetailView(' + data[i]._id + ')"></a>');
                        var item = $('<td></td>');
                        item.append('<img src="/images/' + data[i].properties.make.toString() + '/' + data[i].properties.model.toString() + '.png" alt="Strange, no picture?" onerror="onMissingImage(' + data[i]._id + ')">');
                        item.append(data[i].properties.make);
                        item.append(" " + data[i].properties.model);
                        item.append(" " + data[i].properties.year);
                        item.append("<br>&euro;" + data[i].properties.price);

                        itemcontainer.append(item);
                        row.append(itemcontainer);
                    }
                }
            }
        }

        row.append('</tr>');
        table.append(row);
        table.append('</table>');
        $('#content').html('');
        $('#content').append(table);
    });
}

function onMissingImage(id) {
    var url = 'http://' + ip + ':' + port + '/cars/reportMissingImage/' + id;
    $.get(url);
    console.log("Reported Missing Image ID: " + id);
    this.onerror = null;
}

function setContactView() {
    setContentTo('contact.html');
}

function setChartsView() {
    setContentTo('charts.html');
}

function setPay(){
    setContentTo('payment.html')
}

function setAfterpayment(){
    setContentTo('afterPayment.html')
}

function setHistoryView() {
    setContentTo('history.html');
    $.get('http://' + ip + ':' + port + '/order/'+ user.username, function (data) {
        var list = $('<div></div>');
        for (var i = data.length - 1; i >= 0; i--) {
            var line = $('<p class="invoiceButton" onclick="nodePDF(' + "'" + data[i]._id + "'" + ')">' + '#' + data[i]._id + '</p>');
            list.append(line);
        }
        $('#orders').html(list);
    });
}

function toggleAndSetSubbar(id, page, fn) {
    if($('#subbar').css('display') == 'none' || !$('#' + id).length) {
        $('#subbar').show();
        setSubbarTo(page + '.html', fn);
    } else {
        $('#subbar').hide();
    }
}

function addListeners(value) {
    var property = false;
    $("#select" + value).hover(function () {
        if(!property) {
            setFilter(value);
            property = true;
        }
    });

    $("#select" + value).change(function () {
        if(value == 'make') {
            setFilter('model', '&extraprop=make&extraval=' + $('#selectmake option:selected').text());
            $('#selectmodel').show();
            $('#selectmodel').prop('selectedIndex',0);
            setJSONTable('/filter/Car?property1=' + value + '&value1=' + $('#selectmake option:selected').text());
        } else if(value == 'model') {
            setJSONTable('/filter/Car?property1=make&value1=' + $('#selectmake option:selected').text() + '&property2=' + value + '&value2=' + $('#selectmodel option:selected').text());
        } else {
            $('#selectmodel').prop('selectedIndex',0);
            $('#selectmodel').hide();
            $('#selectmake').prop('selectedIndex',0);
            setJSONTable('/filter/Car?property1=' + value + '&value1=' + $('#select' + value + ' option:selected').text());
        }
    });
}

function getCars() {
    //Initial Setup
    setJSONTable('/filter/Car');

}

function initial() {
    setJSONTable('/filter/Car', 1);

    jQuery(document).bind("keyup", function(e) {
        if(e.which == 13 || e.keycode == 13) {
            e.preventDefault();
            if($('#login').length) {
                submitLogin()
            } else if($('#searchform').length) {
                submitSearch();
            }
        }
    }); //Checks if the enter key is pressed on the login page to submit the form
}

initial();