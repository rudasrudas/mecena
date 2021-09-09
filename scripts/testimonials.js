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
        renderTestimonials();
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
                addTestimonial(carousel, testimonials[i]);
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function addTestimonial(carousel, testimonial){
    carousel.slick('slickAdd',
    `
    <div class="testimonial">
        <div class="testimonial-text-wrapper">
            <h3 class="testimonial-content">
                ${testimonial.content}
            </h3>
            <h4 class="testimonial-author">– ${testimonial.author}</h4>
        </div>
    </div>
    `)
}