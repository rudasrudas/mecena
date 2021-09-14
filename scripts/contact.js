function renderCorrections(status, res){
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    //Reset all field looks
    for(let item of document.getElementById('contact-form').children)
        item.classList.remove('faulty', 'successful');

    //Update incorrect field
    let responseText;
    if([430, 431, 432].includes(status)){
        name.classList.add('faulty');
        responseText = name.nextElementSibling;
    }
    else if ([433, 434, 435, 436].includes(status)){
        email.classList.add('faulty');
        responseText = email.nextElementSibling;
    }
    else if ([437, 438, 439].includes(status)){
        message.classList.add('faulty');
        responseText = message.nextElementSibling;
    }

    if(responseText !== undefined){
        responseText.innerHTML = res;
        responseText.classList.add('faulty');
    }

    if(status == 200){
        let success = document.getElementById('contact-success');
        success.innerHTML = res;
        success.classList.add('successful');
    }
}

function sendMessage() {
    let name = document.getElementById('contact-name').value;
    let email = document.getElementById('contact-email').value;
    let message = document.getElementById('contact-message').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.mecena.net/send-message`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status < 500) { //Success
            console.log(xhr.response);
            renderCorrections(xhr.status, xhr.response);
        }
        else { //Server error
            console.log('Request failed. Returned status of ' + xhr.status);
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
