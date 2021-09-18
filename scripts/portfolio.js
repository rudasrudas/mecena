//Wait for the page to load
window.onload = function() {
    jumpToTheCenter();
    setupPlayer();
}

var player = {
    currentSound: undefined,
    progressBar: undefined,
    currentTime: undefined,
    duration: undefined,
    button: undefined,
    loadingRing: undefined,
    playlist: [],
    initialize: function(tracks){
        this.button = document.querySelector("#play");
        this.loadingRing = document.querySelector("#loading-ring");
        this.progressBar = document.querySelector(".progress-bar");
        this.currentTime = document.querySelector("#current-time");
        this.duration = document.querySelector("#duration");
        for(let i = 0; i < tracks.length; i++){
            this.playlist.push({
                id: tracks[i].id,
                howl: new Howl({
                    src: `https://api.mecena.net/track/${tracks[i].track}`,
                    onplay: function(){
                        player.duration.innerHTML = player.formatTime(Math.round(player.currentSound.duration()))
                        requestAnimationFrame(player.step);
                    },
                    onpause: function(){
                        player.button.classList.remove("fa-pause");
                        player.button.classList.add("fa-play");
                    },
                    onstop: function(){
                        player.button.classList.remove("fa-pause");
                        player.button.classList.add("fa-play");
                        player.duration.innerHTML = "0:00";
                        player.progressBar.style.width = "0%";
                        // for safety measures, if user closes while song is loading
                        player.button.style.display = "block";
                        player.loadingRing.style.display = "none";
                    },
                    onend: function(){
                        player.button.classList.remove("fa-pause");
                        player.button.classList.add("fa-play");
                    },
                    onseek: function(){
                        requestAnimationFrame(player.step);
                    },
                    onload: function(){
                        //when song is loaded, remove loading ring and display control button
                        player.button.style.display = "block";
                        player.loadingRing.style.display = "none";
                    }
                })
            });
        }
    },
    play: function(id){
        this.currentSound = this.getSong(id);
        if(this.currentSound === undefined) return;

        if (this.currentSound.state() === 'loaded')
            this.button.style.display = 'block';
        else {
            //if not loaded, display loading ring
            this.loadingRing.style.display = 'block';
            this.button.style.display = 'none';
        }
        //prepare buttons
        player.button.classList.remove("fa-play");
        player.button.classList.add("fa-pause");
        this.currentSound.play();
    },
    pause: function(){
        this.currentSound.pause();
    },
    stop: function(){
        this.currentSound.stop();
    },
    seek: function(per){
        if(this.isPlaying()){
            this.currentSound.seek(this.currentSound.duration() * per);
        }
    },
    isPlaying: function(){
        return this.exists() && this.currentSound.playing();
    },
    exists: function(){
        return this.currentSound !== undefined;
    },
    step: function(){
        const seek = player.currentSound.seek() || 0;
        const duration = player.currentSound.duration() || 0;
        const progressPercent = (seek / duration) * 100;
        player.currentTime.innerHTML = player.formatTime(Math.round(seek));
        player.progressBar.style.width = `${progressPercent}%`;
        if(player.isPlaying()){
            requestAnimationFrame(player.step);
        }
    },
    formatTime(secs){
        let minutes = Math.floor(secs / 60) || 0;
        let seconds = (secs - minutes * 60) || 0;
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    },
    getSong(id){
        for(let i = 0; i < this.playlist.length; i++){
            if(this.playlist[i].id == id){
                return this.playlist[i].howl;
            }
        }
        return undefined;
    }
}

//Immediately-invoked Function Expression
;(function(){
    getArtworks();
    getTracks();
})();

function getArtworks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/artworks`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const artworks = JSON.parse(xhr.response);
            var container = $('#artworks')[0];
            for(let i = 0; i < Object.keys(artworks).length; i++){
                appendArtwork(artworks[i], container);
            }
        }
        else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function appendArtwork(artwork_info, container){
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="artwork">
        <img onclick="openModal(this)" data-modal-target="#artwork-info" class="artwork-img" src="https://api.mecena.net/image/${artwork_info.artwork}?type=artwork">
        <h4 class="artwork-label">${artwork_info.title}</h4>
    </div>`.trim();
    const artwork = div.firstChild;
    container.appendChild(div.firstChild);
    const artworkImg = artwork.getElementsByClassName("artwork-img")[0];
    const modal = document.getElementById("artwork-info");
    setupArtworkModal(modal, artworkImg, artwork_info.title, artwork_info.artist, artwork_info.description);
}

function setupArtworkModal(modal, artworkImg, title, artist, description){
    const modalTitle = modal.querySelector("#artwork-info .title");
    const modalArtist = modal.querySelector("#artwork-info .artist");
    const modalDescription = modal.querySelector("#artwork-info .description");
    const modalArtwork = modal.querySelector("#artwork-info .artwork-image");

    artworkImg.addEventListener("click", ()=>{
        modalTitle.innerHTML = title;
        modalArtist.innerHTML = artist;
        modalDescription.innerHTML = description;
        modalArtwork.src = artworkImg.src;
    })
}

function getTracks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tracks = JSON.parse(xhr.response);
            var container = $('#tracks')[0];
            for(let i = 0; i < Object.keys(tracks).length; i++){
                appendTrack(tracks[i], container);
            }
            player.initialize(tracks);
        }
        else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function appendTrack(track_info, container){
    let div = document.createElement('div');
    div.innerHTML = `
    <div onclick="openModal(this)" data-modal-target="#track-info" class="track">
        <img class="track-img" src="https://api.mecena.net/image/${track_info.cover}?type=artwork">
        <h4 class="track-label">${track_info.title}</h4>
    </div>`.trim();
    const track = div.firstChild;
    container.appendChild(track);
    const trackCover = track.getElementsByClassName("track-img")[0];
    const modal = document.getElementById("track-info");
    setupTrackModal(modal, trackCover, track_info)
}

function setupTrackModal(modal, cover, track){
    const songCover = modal.querySelector("#track-info .song-cover");
    const songTitle = modal.querySelector("#track-info .song-title");
    const songArtist = modal.querySelector("#track-info .song-artist");
    const streamingServices = modal.querySelector("#track-info .streaming-services");

    cover.addEventListener("click", ()=>{
        modal.setAttribute('data-track-id', `${track.id}`);
        songCover.src = cover.src;
        songTitle.innerHTML = track.title;
        songArtist.innerHTML = track.artist;

        streamingServices.innerHTML = "";
        generateStreamingService(streamingServices, track.media_spotify, "spotify", "Spotify");
        generateStreamingService(streamingServices, track.media_apple_music, "apple", "Apple Music");
        generateStreamingService(streamingServices, track.media_youtube, "youtube", "Youtube");
        generateStreamingService(streamingServices, track.media_soundcloud, "soundcloud", "SoundCloud");
        generateStreamingService(streamingServices, track.media_itunes, "itunes", "iTunes");
    })
}

function setupPlayer(){
    const playButton = document.querySelector("#play");
    const progressContainer = document.querySelector(".progress-bar-container");
    const modal = $("#track-info");
    playButton.addEventListener("click", () => {
        const id = modal[0].dataset.trackId;
        if(!player.isPlaying())
            player.play(id);
        else
            player.pause();
    })
    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        player.seek(clickX / width);
    })
    modal.on("close", () => {
        player.stop();
    })
}

function generateStreamingService(container, link, service, serviceFull){
    if(link.length > 0){
        let a = document.createElement("a");
        a.innerHTML = `
        <a href="${link}" class="stream-song ${service}">
            <p class="stream-text">Listen on ${serviceFull}</p>
            <i class="fab fa-${service} stream-icon"></i>
        </a>`.trim();

        const serviceElement = a.firstChild;
        container.appendChild(serviceElement)
    }
}

function jumpToTheCenter(){
    document.getElementById('splitter').scrollIntoView({
        inline: "center"
    });
}

function scrollToCovers(){
    let options = {
        behavior: "smooth",
        block: "end",
        inline: "center"
    }
    document.getElementById("artwork-side").scrollIntoView(options);
}

function scrollToSongs(){
    let options = {
        behavior: "smooth",
        block: "end",
        inline: "center"
    }
    document.getElementById("track-side").scrollIntoView(options);
}

//Pointer logic

function slideLeft(item) {
    document.getElementById(item).classList.add("shifted-left");
}

function slideRight(item) {
    document.getElementById(item).classList.add("shifted-right");
}

function updatePointers(){
    let content = document.getElementsByClassName('portfolio-content')[0];

    let position = content.scrollLeft/(content.scrollWidth - content.offsetWidth);
    
    
    if(position < 0.03){
        document.getElementById('track-pointer').classList.remove("shifted-right");
    }
    else if(!document.getElementById('track-pointer').classList.contains("shifted-right")){
        document.getElementById('track-pointer').classList.add("shifted-right");
    }

    if(position > 0.97){
        document.getElementById('artwork-pointer').classList.remove("shifted-left");
    }
    else if(!document.getElementById('artwork-pointer').classList.contains("shifted-left")){
        document.getElementById('artwork-pointer').classList.add("shifted-left");
    }
}