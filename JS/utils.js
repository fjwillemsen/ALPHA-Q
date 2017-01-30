function uArray(array) {
    return array.filter(function(itm,i,array) {
        return i==array.indexOf(itm);
    });
}                        // Returns an array with only unique values

function toUpperCaseFirst(string) {
    string = string.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    return string;
}             // Makes the first letter of the string upper-cased

function jString(value) {
    return '\'' + value + '\'';
}                       // Puts single quotes around a given string

function showKey(string) {
    string = string.split('_');
    var result = '';
    for (i = 0; i < string.length; i++) {
        if(i != 0) {
            result = result + toUpperCaseFirst(string[i]) + ' ';
        }
    }
    return result;
}                      // Edits the String data so it gets prettier to look at (for example, from "model_key" to "Key")

function getFormObjects(formId) {
    var formObj = {};
    var inputs = $(formId).serializeArray();
    $.each(inputs, function (i, input) {
        formObj[input.name] = input.value;
    });
    return formObj;
}               // Seperates individual parts of forms into key-value pairs

function empty(value) {
    if(value != '' && value != undefined && value != null && value && value.trim()) {
        return false;
    } else {
        return true;
    }
}                         // Checks if a String is empty

function setIfNotEmpty(value, fallback) {
    if(!empty(value)) {
        return value;
    } else {
        return fallback;
    }
}       // Returns a value if it is not empty, otherwise it returns the fallback
