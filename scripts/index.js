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

async function customizePage() {
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
                sessionStorage.setItem('clientDataInitialized', true);
            }
            else {
                alert('Failed to connect to the server. Status code: ' + xhr.status);
                connected = false;
            }
        };
        await xhr.send();
    }

    if(connected)
        sessionStorage.setItem('clientConnected', true);
}

function updateNavBar(currency){
    document.querySelector('#nav-currency').innerHTML = currency;
}

function updateNavBar2(){
    console.log("Updating nav bar!");
    if(sessionStorage.getItem('clientConnected') === true)
        updateNavBar(sessionStorage.getItem('clientCurrency'));
    else
        console.log("Client was not connected in time to update nav bar");
}

async function setupLoadingScreen() {
    if(sessionStorage.getItem('firstTime') === null){
        document.querySelector('.loading-screen').classList.remove('hidden');
        sessionStorage.setItem('firstTime', false);
        await customizePage();
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

function updateShoppingCartLocation(){
    const shoppingCartButton = document.querySelector('#checkout-btn');
    const shoppingCartWindow = document.querySelector('#shopping-window');
    shoppingCartWindow.style.top = (shoppingCartButton.offsetTop + shoppingCartButton.offsetHeight).toString() + 'px';
    shoppingCartWindow.style.right = (window.screen.width - shoppingCartButton.offsetLeft - shoppingCartButton.offsetWidth).toString() + 'px';
}

function updateShoppingCart(){
    const shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));
    const shoppingCartElm = document.querySelector('#shopping-cart');
    const symbol = getSymbol(sessionStorage.getItem('clientCurrency'));

    shoppingCartElm.innerHTML = '';

    for(let i = 0; i < shoppingCart.length; i++){
        let div = document.createElement('div');
        div.innerHTML = `
        <div class="shopping-cart-item">
            <h4 class="item-title">${shoppingCart[i].productName}</h4>
            <h4 class="item-price">${shoppingCart[i].price * shoppingCart[i].quantity}${symbol}</h4>
            <div class="item-quantity-selector">
                <button class="item-quantity-less resp-box" onclick="decreaseQuantity('${shoppingCart[i].product}')">
                    <span class="material-icons">remove</span>
                </button>
                <p class="item-quantity resp-box no-touch">${shoppingCart[i].quantity}</p>
                <button class="item-quantity-more resp-box" onclick="increaseQuantity('${shoppingCart[i].product}')">
                    <span class="material-icons">add</span>
                </button>
            </div>
        </div>
        `;

        shoppingCartElm.append(div);
    }

    updateShoppingCartLocation();

    if(shoppingCart.length == 0){
        let p = document.createElement('p');
        p.innerHTML = "You don't have any items in your shopping cart.";
        document.querySelector('.purchase-btn').classList.add('shopping-hidden');
        shoppingCartElm.append(p);
    }
    else {
        document.querySelector('.purchase-btn').classList.remove('shopping-hidden');
    }
}

function removeEmptyItems(){
    const shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));
    
    for(let i = shoppingCart.length - 1; i >= 0 ; i--){
        if(shoppingCart[i].quantity == 0){
            shoppingCart.splice(i, 1);
        }
    }

    sessionStorage.setItem('clientShoppingCart', JSON.stringify(shoppingCart));
    updateShoppingCart();
}

function decreaseQuantity(product){
    const shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));

    for(let i = 0; i < shoppingCart.length; i++){
        if(shoppingCart[i].product === product){
            if(shoppingCart[i].quantity > 0){
                shoppingCart[i].quantity--;
                sessionStorage.setItem('clientShoppingCart', JSON.stringify(shoppingCart));
                updateShoppingCart()
            }
            return;
        }
    }
}

function increaseQuantity(product){
    const shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));

    for(let i = 0; i < shoppingCart.length; i++){
        if(shoppingCart[i].product === product){
            if(shoppingCart[i].quantity < 10){
                shoppingCart[i].quantity++;
                sessionStorage.setItem('clientShoppingCart', JSON.stringify(shoppingCart));
                updateShoppingCart()
            }
            return;
        }
    }
}

function toggleShoppingCart(){
    removeEmptyItems();

    const element = document.querySelector('#shopping-window');
    if(element.classList.contains('shopping-hidden')){
        element.classList.remove('shopping-hidden');
    }
    else {
        element.classList.add('shopping-hidden');
    }
}