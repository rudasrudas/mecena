window.onload = () =>{
    window.onscroll = () => {
        updateNavScroll();
    }
    
}

function updateNavScroll(){
    let scrollTop = document.documentElement.scrollTop;

    const navbar = document.querySelector('.navbar');
    console.log(navbar)

    $("div[data-navstyle]").each(function(){
        var topDistance = $(this).offset().top;
        if ( (topDistance) < scrollTop ) {
            let style = $(this).attr('data-navstyle');
            if(style == "white")
                navbar.classList.add(style);
            else
                navbar.classList.remove("white");
        }
    });



    if(document.location.pathname === '/'){
        if((window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0) == 0){
            navbar.classList.remove('white');
            navbar.classList.add('on-hero');
        }
        else {
            navbar.classList.remove('on-hero');
        }
    }
}
