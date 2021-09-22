function initializePackageEvents() {
    const packages = document.getElementsByClassName('package-block-full');
    const packageDetails = document.getElementsByClassName('package-detail-block');
    for(let i = 0; i < packages.length; i++){
        packages[i].addEventListener("mouseover", showPackageDetails(i), false);
        packages[i].addEventListener("mouseout", hidePackageDetails(i), false);
        packageDetails[i].addEventListener("mouseover", showPackageDetails(i), false);
        packageDetails[i].addEventListener("mouseout", hidePackageDetails(i), false);
    }
}

function showPackageDetails(id) {
    return function() {
        document.getElementsByClassName('package-detail-block')[`${id}`].classList.remove('hidden');
        document.getElementsByClassName('package-engagement')[`${id}`].classList.add('hidden');
        document.getElementsByClassName('package-img')[`${Math.floor(id/3)}`].classList.add('faded');
    }
}

function hidePackageDetails(id) {
    return function() {
        document.getElementsByClassName('package-detail-block')[`${id}`].classList.add('hidden');
        document.getElementsByClassName('package-engagement')[`${id}`].classList.remove('hidden');
        document.getElementsByClassName('package-img')[`${Math.floor(id/3)}`].classList.remove('faded');
    }
}

function initializePrices(){
    const priceElements = document.querySelectorAll(".package-price[price]");
    const currency = sessionStorage.getItem('clientCurrency');
    const products = JSON.parse(sessionStorage.getItem('clientProducts'));
    
    for(let i = 0; i < priceElements.length; i++){
        let product = null;
        for(let j = 0; j < products.length; j++){
            if(products[j].id == priceElements[i].getAttribute('productid')){
                product = products[j];
            }
        }
        if(product != null)
            priceElements[i].innerHTML = '' + product.price + getSymbol(currency); 
        else 
            console.log("Failed to update price. Product could not be found.");
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

    document.querySelector('#shopping-window').classList.remove('hidden');
}

function checkout(){
    const shoppingCart = JSON.parse(sessionStorage.getItem('clientShoppingCart'));
    if(shoppingCart.length == 0) return;

    const formattedCart = shoppingCart.map(item => ({price: item.priceId, quantity: item.quantity}));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.mecena.net/checkout/create-checkout-session`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(){
        console.log(xhr.response);
    }
    
    xhr.send(JSON.stringify(formattedCart))
}