const navbar = document.querySelector('.navbar');

window.onscroll = () => {
    updateNavScroll();
}


function updateNavScroll(){
    if(document.location.pathname === '/'){
        if((window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0) == 0){
            navbar.classList.add('on-hero');
        }
        else {
            navbar.classList.remove('on-hero');
        }
    }
}

updateNavScroll();
