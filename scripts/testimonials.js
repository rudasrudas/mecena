function setupTestimonials(){
    $(document).ready(function(){
        const carousel =  $('.testimonials-carousel');
        carousel.slick({
            slidesToShow: 3,
            slidesToScroll: 2,
            accessibility: false,
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 500,
            draggable: false,
            swipe: false,
            touchMove: false,
            arrows: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
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
    `<div class="testimonial">
        <div class="testimonial-content">
            <div class="testimonial-body resp-box no-touch">
                <img src="../static/icons/quotes.svg" class="testimonial-quotes">
                <div class="testimonial-text-wrapper">
                    <p class="testimonial-text">${testimonial.content}</p>
                    <h4 class="testimonial-author">– ${testimonial.author}</h4>
                </div>
            </div>
            <div class="testimonial-footer">
                <p class="testimonial-footer-headline">Purchased package</p>
                <p class="testimonial-footer-content">Music Gamma 03</p>
            </div>
        </div>
    </div>`
            
    );
}