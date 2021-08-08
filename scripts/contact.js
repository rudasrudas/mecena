window.onload = function() {
    const form = document.getElementById('contact-form');
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    form.onsubmit = sendMessage(name, email, message);
    console.log('ln8');
}

function sendMessage(name, email, message) {

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://45.80.152.150:3000/send-message`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert(xhr.response);
            console.log(this.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(
        JSON.stringify({
            name: name,
            email: email,
            message: message
        }
    ));
}