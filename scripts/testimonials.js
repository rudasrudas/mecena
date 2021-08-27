function setupTestimonials(){
    $(document).ready(function(){
        const carousel =  $('.testimonials-carousel');
        carousel.slick({
            accessibility: false,
            autoplay: true,
            autoplaySpeed: 15000,
            pauseOnHover: true,
            draggable: false,
            swipe: false,
            touchMove: false,
            prevArrow: $("#testimonials-prev"),
            nextArrow: $("#testimonials-next"),
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