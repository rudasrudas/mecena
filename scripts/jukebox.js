function setupCarousel(){
    var owl = $(".owl-carousel");
    var prevBtn = $("#jukebox-prev");
    var nextBtn = $("#jukebox-next");
    owl.owlCarousel({
        center: true,
        items: 3,
        loop: true,
        margin: 30,
        dots: false,
        startPosition: 5
    });
    
    prevBtn.click(() => {
        owl.trigger("prev.owl.carousel")
    })
    
    nextBtn.click(() => {
        owl.trigger("next.owl.carousel")
    })

    // owl.on("changed.owl.carousel", function(e) {
    //     // console.log(e);
    //     // var index = e.item.index;

    //     // console.log($(".owl-item").eq(index - 1)[0]);

    //     // current
    //     // console.log($(".owl-item").eq(index)[0]);

    //     // const playedSong = document.getElementsByClassName("jukebox-song played")[0];
    //     // const wasPlayed = typeof playedSong !== 'undefined';

      
    //     // if(wasPlayed){
    //     //     const audio = playedSong.getElementsByTagName("audio")[0];
    //     //     const isPlaying = !audio.paused && audio.currentTime > 0 && !audio.ended;
    //     //     if(isPlaying){
    //     //         const button = playedSong.getElementsByClassName("control-btn")[0];

    //     //         stopSong(audio, button);
    //     //     }
    //     //     playedSong.classList.remove("played");
    //     // }
    // });

    owl.on('changed.owl.carousel', function(event) {
        console.log(event.item.index);
        // var center = $(".center")[0];
        // center.addEventListener("click", ()=>{
        //     let audio = center.querySelector('audio');
        //     let actionButton = center.querySelector('.control-btn');
        //     const isPlaying = !audio.paused && audio.currentTime > 0 && !audio.ended;
    
        //     if(isPlaying){
        //         pauseSong(audio, actionButton);
        //     }
        //     else{
        //         playSong(audio, actionButton);
        //     }
        // });
    });
}

function render(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tracks = JSON.parse(xhr.response);
            console.log(tracks);

            var jukebox = $(".owl-carousel");

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

    //event listeners

    actionButton.addEventListener("click", ()=>{
        //this works as well
        // const vinyl = document.getElementsByClassName("vinyl-player")[0];
        // const isPlaying = vinyl.classList.contains("play");
        
        const isPlaying = !audio.paused && audio.currentTime > 0 && !audio.ended;

        if(isPlaying){
            pauseSong(audio, actionButton);
        }
        else{
            playSong(audio, actionButton);
        }
    })

    jukebox.owlCarousel('add', song).owlCarousel('update');
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

function playSong(audio, button){
    // song.classList.add("played");
    document.getElementsByClassName("vinyl-player")[0].classList.add("play");
    button.classList.remove("fa-play");
    button.classList.add("fa-pause");
    audio.play();
}

function pauseSong(audio, button){
    document.getElementsByClassName("vinyl-player")[0].classList.remove("play");
    button.classList.remove("fa-pause");
    button.classList.add("fa-play");
    audio.pause();
}

function stopSong(audio, button){
    pauseSong(audio, button);
    audio.currentTime = 0; 
}