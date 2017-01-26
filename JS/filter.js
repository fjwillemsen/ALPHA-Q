function showFilters() {
    toggleAndSetSubbar('filterbar', 'filter', function() {
        $('#selectmodel').hide();
        setFilter('make');
        setFilter('year');
        addListeners('make');
        addListeners('model');
        addListeners('year');
    });
}

function setFilters() {
    $('#filter').hide();
    $.get('http://' + ip + ':' + port + '/filter/Car/model/nn', function(data){
        var brandarray = [];
        var modelarray = [];
        var yeararray = [];

        brandarray.push('<option value="" disabled="disabled" selected="selected">Brand</option>');
        modelarray.push('<option value="" disabled="disabled" selected="selected">Model</option>');
        yeararray.push('<option value="" disabled="disabled" selected="selected">Year</option>');

        for (var i = data.length - 1; i >= 0; i--) {
            brandarray.push('<option value="">' + data[i].properties.make + '</option>');
            modelarray.push('<option value="">' + data[i].properties.model + '</option>');
            yeararray.push('<option value="">' + data[i].properties.year + '</option>');
        }

        brandarray = uArray(brandarray);
        modelarray = uArray(modelarray);
        yeararray = uArray(yeararray);

        $('#selectbrand').html(brandarray.join(''));
        $('#selectmodel').html(modelarray.join(''));
        $('#selectyear').html(yeararray.join(''));

        $('#filter').show();
    });
}                         // Sets all filters (Warning: Deprecated. Use the "setFilter" instead)

function setFilter(property, extra) {
    var string = property;
    if(extra != undefined) {
        string = string + extra;
    }

    $.get('http://' + ip + ':' + port + '/filter/Car?property1=' + string, function(data){
        var array = [];
        array.push('<option value="" disabled="disabled" selected="selected">' + toUpperCaseFirst(property) + '</option>');

        for (var i = data.length - 1; i >= 0; i--) {
            array.push('<option value="">' + data[i] + '</option>');
        }

        array = uArray(array);
        $('#select' + property).html(array.join(''));
    });
}           // Sets a filter to the values obtained trough the database