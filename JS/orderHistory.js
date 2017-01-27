function setHistoryView() {
    setContentTo('history.html', function () {
        $.get('http://' + ip + ':' + port + '/order/' + user.username, function (data) {
            var list = $('<div></div>');
            for (var i = data.length - 1; i >= 0; i--) {
                var line = $('<p onclick="showOrderHistory(' + "'" + data[i]._id + "'" + ')">' + data[i]._id + '</p>');
                list.append(line);
            }
            $('#orders').html(list);
        });
    });
}

function showOrderHistory(id) {
    $.get('http://' + ip + ':' + port + '/orderinfo/' + id, function (data) {
        var list = $('<div></div>');
        for (var i = data.length - 1; i >= 0; i--) {
            console.log(data.length);
            console.log(data[i].properties);
            var line = $('<p style="display: inline-block">' + data[i].properties + ' -split-' + data[i] + ' - </p>');
            list.append(line);
        }
        $('#ordersinfo').html(list);
    });
}
