function sendMessage() {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://45.80.152.150:5000/', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert(xhr.response);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}