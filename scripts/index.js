;(async () => {
    let contentLoaded = await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve));
    Promise.all([await customizePage(), contentLoaded]).then(() => {
        if(document.location.pathname === '/')  initializeFromPrices();
        if(document.location.pathname === '/shop/')  initializePrices();

        document.querySelector('.loading-screen').classList.add('hidden');
    });
})();

window.onload = function(){
    if(document.location.pathname === '/'){
        updateArrowPosition();
        window.onscroll = updateVinyl;
    }
}

window.onresize = function(){
    if(document.location.pathname === '/'){
        updateArrowPosition();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function customizePage() {
    return new Promise(function (resolve, reject){
        if(sessionStorage.getItem('clientDataInitialized') === null){
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
                    resolve();
                }
                else {
                    console.log('Failed to connect to the server. Status code: ' + xhr.status);
                    reject();
                }
            };
            xhr.send();
        }
        else {
            resolve();
        }
    });
}

function updateNavBar(currency){
    document.querySelector('#nav-currency').innerHTML = currency;
}

// function updateNavBar2(){
//     if(sessionStorage.getItem('clientConnected') === true)
//         updateNavBar(sessionStorage.getItem('clientCurrency'));
//     else
//         console.log("Client was not connected in time to update nav bar");
// }

async function setupLoadingScreen() {
    if(sessionStorage.getItem('firstTime') === null){
        document.querySelector('.loading-screen').classList.remove('hidden');
        sessionStorage.setItem('firstTime', false);
    }
}

function getSymbol(currency){
    switch(currency){
        case 'EUR': return '€';
        case 'USD': return '$';
        case 'GBP': return '£';
    }
}

async function initializeFromPrices(){

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

/////////////////////////////////////////////////////////////
///                 SHOPPING CART FUNCTIONS                //
/////////////////////////////////////////////////////////////

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

function addToShoppingCart(id, title){
    let shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));
    if (shoppingCart === null){
        shoppingCart = JSON.parse('[]');
    }

    let product = null;
    for(let i = 0; i < shoppingCart.length; i++){
        if(shoppingCart[i].product == id){
            product = shoppingCart[i];
            break;
        }
    }

    if(product != null){
        product.quantity += 1;
    }
    else {
        const products = JSON.parse(sessionStorage.getItem('clientProducts'));
        let price, productId;
        for(let i = 0; i < products.length; i++){
            if(products[i].id == id){
                price = products[i].price;
                productId = products[i].productId;
                break;
            }
        }

        if(price != null){
            shoppingCart.push({"productName": title, "product": id, "priceId": productId, "price": price, "quantity": 1});
        }
        else{ 
            console.log("Failed to add item to shopping cart. Price could not be found.");
        }
    }
    
    sessionStorage.setItem('clientShoppingCart', JSON.stringify(shoppingCart));
    updateShoppingCart();

    document.querySelector('#shopping-window').classList.remove('shopping-hidden');
}

function checkout(){
    const shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));
    if(shoppingCart.length == 0) return;

    const formattedCart = shoppingCart.map(item => ({price: item.priceId, quantity: item.quantity}));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.mecena.net/checkout/create-checkout-session`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(){
        if (xhr.status >= 200 && xhr.status < 300) {
            let url = JSON.parse(xhr.response).url;
            window.location = url;
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    }
    xhr.send(JSON.stringify(formattedCart))
}

function getCustomer(){
    const appreciation = document.getElementById("appreciation-message");
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    if(id === null){
        location.href = "/";
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/checkout/success?id=` + id, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const customer = JSON.parse(xhr.response);
            appreciation.innerHTML = `Thank you, ${customer.name}`;
        }
        else {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function clearCart(){
    sessionStorage.setItem('clientShoppingCart', '[]');
}