function setupTestimonials(){
    $(document).ready(function(){
        const carousel =  $('.testimonials-carousel');
        carousel.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            accessibility: false,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 600,
            pauseOnHover: true,
            draggable: false,
            swipe: false,
            touchMove: false,
            arrows: false
        });
        //renderTestimonials();
    })
}

function renderTestimonials(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/testimonials`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const testimonials = JSON.parse(xhr.response);

            var carousel = $(".testimonials-carousel");

            for(let i = 0; i < Object.keys(testimonials).length; i++){
                generateTestimonialElement(testimonials[i], carousel);
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function generateTestimonialElement(testimonial, carousel){
    console.log(testimonial);
}