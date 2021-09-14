var activeAudio = {
    // tag: undefined,
    // vinyl: undefined,
    // vinylImage: undefined,
    // vinylButton: undefined,
    // innerVinyl: undefined,
    // startTime: undefined,
    // endTime: undefined,
    exists: function(){
        return this.tag !== undefined;
    },
    isPlaying: function(){
        let audio = this.tag;
        return audio && !audio.paused && audio.currentTime > 0 && !audio.ended;
    },
    hasChanged: function(otherAudio){
        return this.tag != otherAudio;
    },
    getButton: function(){
        return this.tag.parentNode.querySelector(".control-btn");
    },
    playSong: function(button){
        if(!button){
            button = this.getButton();
        }
        this.vinyl.classList.add("play");
        button.classList.remove("fa-play");
        button.classList.add("fa-pause");
        this.vinylButton.classList.remove("fa-play");
        this.vinylButton.classList.add("fa-pause");
        this.tag.play();
        this.tag.addEventListener("timeupdate", function(){
            if (activeAudio.shouldEnd(this.currentTime)){
                //remove this event listener
                this.removeEventListener("timeupdate", arguments.callee, false);
                activeAudio.pauseSong(button);
                activeAudio.resetTime();
            }
        });
    },
    pauseSong: function(button){
        if(!button){
            button = this.getButton();
        }
        this.vinyl.classList.remove("play");
        button.classList.remove("fa-pause");
        button.classList.add("fa-play");
        this.vinylButton.classList.remove("fa-pause");
        this.vinylButton.classList.add("fa-play");
        this.tag.pause();
    },
    resetTime: function(){
        this.tag.currentTime = this.startTime;
    },
    displayVinyl: function(){
        this.vinyl.classList.add("active");
    },
    hideVinyl: function(){
        this.vinyl.classList.remove("active");
    },
    setSong: function(audio, startTime, endTime){
        this.tag = audio;
        this.startTime = startTime;
        this.endTime = endTime;
    },
    shouldEnd: function(seconds){
        return seconds >= activeAudio.endTime;
    },
    setupVinyl: function(coverImg){
        this.vinylImage = document.createElement("img");
        this.vinylImage.classList.add("cover");
        this.vinylImage.src = coverImg;
        this.innerVinyl.appendChild(this.vinylImage);
    }
};

$(document).ready(function(){
    activeAudio.vinyl = document.getElementById("vinyl-player");
    activeAudio.innerVinyl = activeAudio.vinyl.getElementsByClassName("spinning-vinyl")[0];
    activeAudio.vinylButton = document.getElementById("vinyl-control-btn");
})

window.onload = function(){
    updateArrowPosition();
    window.onscroll = updateVinyl;
}

window.onresize = function(){
    updateArrowPosition();
}

function updateArrowPosition(){
    let offset = (document.querySelector(".slick-list").offsetWidth - 30)/6 + 'px';
    $("#jukebox-prev")[0].style.top = offset;
    $("#jukebox-next")[0].style.top = offset;
}

function updateVinyl(){
    const jukebox = document.getElementById("jukebox");

    const top = jukebox.offsetTop;
    const height = jukebox.offsetHeight;

    if((top + (height/2)) > (window.pageYOffset + window.innerHeight) || (top + height) < (window.pageYOffset + window.innerHeight/2)){
        if(activeAudio.exists()){
            activeAudio.displayVinyl();
        }
    }
    else{
        activeAudio.hideVinyl();
    }
}

function setupJukebox(){
    $(document).ready(function(){
        const carousel =  $('.jukebox-carousel');
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
            //if slide hasn't changed, don't do anything
            if(currentSlideIndex == nextSlideIndex){
                return;
            }

            if(activeAudio.exists()){
                //if song is currently playing, pause
                if(activeAudio.isPlaying()){
                    activeAudio.pauseSong();
                }

                //set timestamp to start
                activeAudio.resetTime();

                //change vinyl cover image
                const nextSlide = $(slick.$slides.get(nextSlideIndex))[0];
                const nextSlideCover = nextSlide.querySelector("img");
                activeAudio.vinylImage.src = nextSlideCover.src;
            }
        });
        renderSongs();
    })
}

function renderSongs(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tracks = JSON.parse(xhr.response);

            var jukebox = $(".jukebox-carousel");

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


    audio.src = `https://api.mecena.net/track/${track.track}`;
    audio.preload = "auto";
    cover.src = `https://api.mecena.net/image/${track.cover}?type=artwork`;
    title.innerHTML = track.title;
    artist.innerHTML = track.artist;

    song.classList.add("jukebox-song");
    coverWrapper.classList.add("jukebox-song-img-wrapper")
    cover.classList.add("jukebox-song-img");
    actionButton.classList.add("fas", "fa-play", "control-btn");
    title.classList.add("jukebox-song-title");
    artist.classList.add("jukebox-song-artist");

    //convert hh:mm:ss track timestamp format to seconds
    const startTime = hmsToSeconds(track.start_time);
    const endTime = hmsToSeconds(track.end_time);
    audio.currentTime = startTime;

    //action button click event listener
    actionButton.addEventListener("click", ()=>{
        //if activeAudio exists and is playing, pause  
        if(activeAudio.exists() && activeAudio.isPlaying()){
            activeAudio.pauseSong(actionButton);
        }
        //if isn't playing
        else{
            //first time playing jukebox
            if(!activeAudio.exists())
                activeAudio.setupVinyl(cover.src);

            //if audio changed
            if(activeAudio.hasChanged(audio))
                activeAudio.setSong(audio, startTime, endTime);

            activeAudio.playSong(actionButton);
        }
    })

    jukebox.slick('slickAdd', song);
}

function pressPrev(){
    const prevButton = document.getElementById("jukebox-prev");
    prevButton.click();
}

function pressControl(){
    const button = document.querySelector(".jukebox-song.slick-center .control-btn");
    button.click();
}

function pressNext(){
    const nextButton = document.getElementById("jukebox-next");
    nextButton.click();
}

function handleVinylPress(){
    // if(activeAudio.isPlaying())
    //     activeAudio.pauseSong();
    // else if(activeAudio.hasChanged(audio))
}

function generateMediaElement(wrapper, iconClass, link){
    if(link.length > 0){
        const icon = document.createElement("a");
        icon.classList.add(iconClass);
        icon.classList.add("fab");
        icon.classList.add("jukebox-song-media");
        icon.href = link;
        icon.target = "_blank";

        wrapper.appendChild(icon);
    }
}

function hmsToSeconds(hms){
    let parts = hms.split(':');
    return (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
}