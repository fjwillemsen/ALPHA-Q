function submitSearch() {
    var formobjects = getFormObjects('#searchform');
    var url = '/search/' + formobjects['search'];
    console.log(formobjects['search']);
    setJSONTable(url);
}

function showSearch() {
    toggleAndSetSubbar('searchbar', 'search');
    $("#searchform").bind('keyup', function(event){
        if(event.keyCode == 13 || event.which == 13){
            event.preventDefault();
            submitSearch();
        }
    });
}