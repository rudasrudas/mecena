window.onload = async function(){
    if(document.location.pathname === '/'){
        updateArrowPosition();
        window.onscroll = updateVinyl;
    }
}

;(async function(){
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
    let connected = true;
    if(sessionStorage.getItem('clientDataInitialized') === null || true){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.mecena.net/`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.response);
                sessionStorage.setItem('clientCountry', res.country)
                sessionStorage.setItem('clientCurrency', res.currency);
                sessionStorage.setItem('clientProducts', JSON.stringify(res.products));
                sessionStorage.setItem('clientShoppingCart', '[]');
                console.log(sessionStorage.getItem('clientShoppingCart'));
                sessionStorage.setItem('clientDataInitialized', true);
            }
            else {
                alert('Failed to connect to the server. Status code: ' + xhr.status);
                connected = false;
            }
        };
        xhr.send();
    }

    if(connected)
        updateNavBar(sessionStorage.getItem('clientCurrency'));
}

function updateNavBar(currency){
    document.querySelector('#nav-currency').innerHTML = currency;
}

async function setupLoadingScreen() {
    if(sessionStorage.getItem('firstTime') === null){
        document.querySelector('.loading-screen').classList.remove('hidden');
        sessionStorage.setItem('firstTime', false);
        customizePage();
        await sleep(3000);
        document.querySelector('.loading-screen').classList.add('hidden');
    }
}

function getSymbol(currency){
    switch(currency){
        case 'EUR': return '€';
        case 'USD': return '$';
        case 'GBP': return '£';
    }
}

function initializeFromPrices(){
    const priceElements = document.querySelectorAll(".package-desc[fromprice]");
    // console.log(priceElements);
    const currency = sessionStorage.getItem('clientCurrency');
    const products = JSON.parse(sessionStorage.getItem('clientProducts'));
    
    for(let i = 0; i < priceElements.length; i++){
        let productArr = [];
        for(let j = 0; j < products.length; j++){
            if(priceElements[i].getAttribute('productids').includes(products[j].id)){
                productArr.push(products[j].price);
            }
        }
        if(productArr != [])
            priceElements[i].innerHTML = 'from ' + Math.min(...productArr) + getSymbol(currency); 
    }
}