var owl = $(".owl-carousel");
var prevBtn = $("#jukebox-prev");
var nextBtn = $("#jukebox-next");

owl.owlCarousel({
    center: true,
    items: 3,
    loop: true,
    margin: 30,
    dots: false
});

prevBtn.click(() => {
    owl.trigger("prev.owl.carousel")
})

nextBtn.click(() => {
    owl.trigger("next.owl.carousel")
})