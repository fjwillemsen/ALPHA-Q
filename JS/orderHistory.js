function setHistoryView() {
    setContentTo('history.html', function () {
        $.get('http://' + ip + ':' + port + '/order/' + user.username, function (data) {
            var list = $('<div></div>');
            for (var i = data.length - 1; i >= 0; i--) {
                var line = $('<p class="invoiceButton" onclick="nodePDF(' + "'" + data[i]._id + "'" + ')">' + '#' + data[i]._id + '</p>');
                list.append(line);
            }
            $('#orders').html(list);
        });
    });
}