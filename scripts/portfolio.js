const artworkModal = document.getElementById("artwork-info");
const artworkTitle = artworkModal.querySelector(".title");
const artworkArtist = artworkModal.querySelector(".artist");
const artworkDescription = artworkModal.querySelector(".description");
const artworkSocials = artworkModal.querySelector(".socials-inner");
const artworkImage = artworkModal.querySelector(".artwork-image");
const artworkBody = artworkModal.querySelector(".modal-body");

const trackModal = document.getElementById("track-info");
const trackAbout = trackModal.querySelector(".about-artist-text");
const trackCover = trackModal.querySelector(".song-cover");
const trackTitle = trackModal.querySelector(".song-title");
const trackArtist = trackModal.querySelector(".song-artist");
const trackStream = trackModal.querySelector(".streaming-services");
const trackSocials = trackModal.querySelector(".socials-inner");
const trackBody = trackModal.querySelector(".modal-body");

jumpToTheCenter();
setupPlayer();
setupModals();

var player = {
    currentSound: undefined,
    progressBar: undefined,
    currentTime: undefined,
    duration: undefined,
    button: undefined,
    loadingRing: undefined,
    playlist: [],
    initialize: function(tracks){
        this.button = trackModal.querySelector("#play");
        this.loadingRing = trackModal.querySelector("#loading-ring");
        this.progressBar = trackModal.querySelector(".progress-bar");
        this.currentTime = trackModal.querySelector("#current-time");
        this.duration = trackModal.querySelector("#duration");
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
        if(this.exists())
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
        <h4 class="artwork-label">${artwork_info.title} – ${artwork_info.artist}</h4>
    </div>`.trim();
    const artwork = div.firstChild;
    container.appendChild(div.firstChild);
    const artworkImg = artwork.getElementsByClassName("artwork-img")[0];
    setupArtworkLoad(artworkImg, artwork_info);
}

function setupArtworkLoad(artworkImg, artwork){
    let infoType = infoTypes.ARTWORK;
    artworkImg.addEventListener("click", ()=>{
        fetchMoreInfo(infoType, artwork.id, (info) => {
            console.log(info)
            artworkTitle.innerHTML = info.title;
            artworkArtist.innerHTML = info.artist_name;
            artworkDescription.innerHTML = info.description;
            generateSocials(artworkSocials, info)
            artworkImage.src = `https://api.mecena.net/image/${info.artwork}?type=artwork`;
            artworkBody.classList.remove("hidden");
        })
    })
}

function getTracks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/songs`, true);
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
        <h4 class="track-label">${track_info.artist} – ${track_info.title}</h4>
    </div>`.trim();
    const track = div.firstChild;
    container.appendChild(track);
    const trackCover = track.getElementsByClassName("track-img")[0];
    setupTrackLoad(trackCover, track_info)
}

function setupTrackLoad(cover, track){
    let infoType = infoTypes.SONG;

    cover.addEventListener("click", ()=>{
        trackModal.setAttribute('data-track-id', `${track.id}`);
        fetchMoreInfo(infoType, track.id, (info) => {
            trackAbout.innerHTML = info.artist_biography;
            trackCover.src = `https://api.mecena.net/image/${info.cover}?type=artwork`;
            trackTitle.innerHTML = info.title;
            trackArtist.innerHTML = info.artist_name;
            generateStreamingServices(info);
            generateSocials(trackSocials, info);
            trackBody.classList.remove("hidden");
        });
    });
}

function setupPlayer(){
    const playButton = document.querySelector("#play");
    const progressContainer = document.querySelector(".progress-bar-container");
    playButton.addEventListener("click", () => {
        const id = trackModal.dataset.trackId;
        if(!player.isPlaying())
            player.play(id);
        else
            player.pause();
    });
    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        player.seek(clickX / width);
    });
    $(trackModal).on("close", () => {
        player.stop();
    });
}

function setupModals(){
    $(artworkModal).on("close", () => {
        artworkBody.classList.add("hidden");
    });
    $(trackModal).on("close", () => {
        trackBody.classList.add("hidden");
    });
}

function generateStreamingServices(info){
    trackStream.innerHTML = "";
    const services = [
        {
            service: "spotify",
            serviceFull: "Spotify",
            link: info.media_spotify
        },
        {
            service: "apple",
            serviceFull: "Apple Music",
            link: info.media_apple_music
        },
        {
            service: "youtube",
            serviceFull: "Youtube",
            link: info.media_youtube
        },
        {
            service: "soundcloud",
            serviceFull: "Soundcloud",
            link: info.media_soundcloud
        },
        {
            service: "itunes",
            serviceFull: "iTunes",
            link: info.media_itunes
        }   
    ];
    for(let i = 0; i < services.length; i++){
        if(services[i].link.length > 0){
            let a = document.createElement("a");
            a.innerHTML = `
            <a href="${services[i].link}" class="stream-song ${services[i].service}">
                <p class="stream-text">Listen on ${services[i].serviceFull}</p>
                <i class="fab fa-${services[i].service} stream-icon"></i>
            </a>`.trim();
    
            trackStream.appendChild(a.firstChild);
        }
    }
}

function generateSocials(container, info){
    container.innerHTML = "";
    const socials = [
        {
            social: "facebook",
            link: info.artist_media_facebook
        },
        {
            social: "instagram",
            link: info.artist_media_instagram
        },
        {
            social: "soundcloud",
            link: info.artist_media_soundcloud
        },
        {
            social: "spotify",
            link: info.artist_media_spotify
        },
        {
            social: "youtube",
            link: info.artist_media_youtube
        }
    ];

    for(let i = 0; i < socials.length; i++){
        if(socials[i].link.length > 0){
            let a = document.createElement("a");
            a.innerHTML = `
            <a href="${socials[i].link}" class="fab fa-${socials[i].social} social-icon"></a>`.trim();

            container.appendChild(a.firstChild);
        }
    }
}

const infoTypes = {
    SONG: "song",
    ARTWORK: "artwork"
}

function fetchMoreInfo(info, id, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/${info}/${id}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.response));
        }
        else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function jumpToTheCenter(){
    document.getElementById('splitter').scrollIntoView({
        inline: "center",
        block: "end"
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