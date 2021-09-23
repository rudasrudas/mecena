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