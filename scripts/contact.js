window.onload = function() {
    const form = document.getElementById('contact-form');
    // form.onsubmit = sendMessage();
}

function sendMessage() {
    let name = document.getElementById('contact-name').value;
    let email = document.getElementById('contact-email').value;
    let message = document.getElementById('contact-message').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.mecena.net/send-message`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert(xhr.response);
        }
        else {
            alert('Request failed. Returned status of ' + xhr.status);
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