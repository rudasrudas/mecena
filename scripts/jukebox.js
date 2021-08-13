var activeAudio;
var vinyl;
var vinylImage;
$(document).ready(function(){
    vinyl = document.getElementsByClassName("vinyl-player")[0];
})

function setupCarousel(){
    $(document).ready(function(){
        const carousel =  $('.carousel');
        carousel.slick({
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 3,
            arrows: true,
            prevArrow: $("#jukebox-prev"),
            nextArrow: $("#jukebox-next"),
            infinite: true
        });
        carousel.on('beforeChange', function(event, slick, currentSlideIndex, nextSlideIndex){
            if(activeAudio){
                //if song is currently playing, pause
                if(isPlaying()){
                    const button = activeAudio.parentNode.querySelector(".control-btn");
                    pauseSong(button);
                }
                //set timestamp to start
                activeAudio.currentTime = 0;
            }
            vinyl.classList.add("hidden");

            //if first song has been played and vinyl img was added
            if(vinylImage){
                const nextSlide = $(slick.$slides.get(nextSlideIndex))[0];
                const nextSlideCover = nextSlide.querySelector("img");
                vinylImage.src = nextSlideCover.src;
            }
        });
    })
}

function render(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tracks = JSON.parse(xhr.response);
            console.log(tracks);

            var jukebox = $(".carousel");

            for(let i = 0; i < Object.keys(tracks).length; i++){
                generateSongElement(tracks[i], jukebox);
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function generateSongElement(track, jukebox){
    console.log(track);
    //create HTML elements
    const song = document.createElement("div");
    const audio = document.createElement("audio")
    const coverWrapper = document.createElement("div");
    const cover = document.createElement("img");
    const actionButton = document.createElement("i");
    const title = document.createElement("h3");
    const artist = document.createElement("h4");
    const mediaWrapper = document.createElement("div");

    generateMediaElement(mediaWrapper, "fa-spotify", track.media_spotify);
    generateMediaElement(mediaWrapper, "fa-apple", track.media_apple_music);
    generateMediaElement(mediaWrapper, "fa-youtube", track.media_youtube);
    generateMediaElement(mediaWrapper, "fa-soundcloud", track.media_soundcloud);
    generateMediaElement(mediaWrapper, "fa-itunes", track.media_itunes);

    //append elements
    coverWrapper.appendChild(cover);
    coverWrapper.appendChild(actionButton);
    song.appendChild(audio)
    song.appendChild(coverWrapper);
    song.appendChild(title);
    song.appendChild(artist);
    song.appendChild(mediaWrapper);

    //element styling

    audio.src = `https://api.mecena.net/track/${track.track}`;
    cover.src = `https://api.mecena.net/artwork/${track.cover}`;
    title.innerHTML = track.title;
    artist.innerHTML = track.artist;

    song.classList.add("jukebox-song");
    coverWrapper.classList.add("jukebox-song-img-wrapper")
    cover.classList.add("jukebox-song-img");
    actionButton.classList.add("fas", "fa-play", "control-btn");
    title.classList.add("jukebox-song-title");
    artist.classList.add("jukebox-song-artist");

    actionButton.addEventListener("click", ()=>{    
        //if activeAudio exists and is playing   
        if(activeAudio && isPlaying()){
            pauseSong(actionButton);
        }
        //if isn't playing
        else{
            //first time playing jukebox
            if(!activeAudio){
                vinylImage = document.createElement("img");
                vinylImage.src = cover.src;
                vinyl.appendChild(vinylImage);
            }

            vinyl.classList.remove("hidden");
            activeAudio = audio;
            //listener for audio ended event
            activeAudio.addEventListener("ended", function(){
                vinyl.classList.add("hidden");
                pauseSong(actionButton);
            }, {once: true});

            playSong(actionButton);
        }
    })

    jukebox.slick('slickAdd', song);
}

function generateMediaElement(wrapper, iconClass, link){
    if(link.length > 0){
        const icon = document.createElement("a");
        icon.classList.add(iconClass);
        icon.classList.add("fab");
        icon.classList.add("jukebox-song-media");
        icon.href = link;

        wrapper.appendChild(icon);
    }
}

function isPlaying(){
    return !activeAudio.paused && activeAudio.currentTime > 0 && !activeAudio.ended;
}

function playSong(button){
    vinyl.classList.add("play");
    button.classList.remove("fa-play");
    button.classList.add("fa-pause");
    activeAudio.play();
}

function pauseSong(button){
    vinyl.classList.remove("play");
    button.classList.remove("fa-pause");
    button.classList.add("fa-play");
    activeAudio.pause();
}