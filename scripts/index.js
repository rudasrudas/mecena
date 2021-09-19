window.onload = async function(){
    if(document.location.pathname === '/'){
        updateArrowPosition();
        window.onscroll = updateVinyl;
    }
}

;(async function(){
    customizePage();
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onresize = function(){
    if(document.location.pathname === '/'){
        updateArrowPosition();
    }
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

async function setupLoadingScreen() {
    if(sessionStorage.getItem('firstTime') === null){
        document.querySelector('.loading-screen').classList.remove('hidden');
        sessionStorage.setItem('firstTime', false);
        await sleep(3000);
        document.querySelector('.loading-screen').classList.add('hidden');
    }
}