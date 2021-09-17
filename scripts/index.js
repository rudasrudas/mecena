window.onload = function(){
    if(document.location.pathname === '/'){
        updateArrowPosition();
        window.onscroll = updateVinyl;
    }
}

;(function(){
    customizePage();
})();

window.onresize = function(){
    updateArrowPosition();
}

function customizePage() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let res = JSON.parse(xhr.response);
            updateNavBar(res.country, res.currency);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function updateNavBar(country, currency){
    let symbol;
    switch(currency){
        case 'GBP':
            symbol = 'fa-pound-sign';
            break;
        case 'EUR':
            symbol = 'fa-euro-sign';
            break;
        default:
            symbol = 'fa-dollar-sign';
            break;
    }

    document.querySelector('#nav-currency').innerHTML = currency;
}