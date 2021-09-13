//Wait for the page to load
window.onload = function() {
    jumpToTheCenter();
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
    setupModalLoad(modal, artworkImg, artwork_info.title, "Some text about the artwork...")
}

function setupModalLoad(modal, target, title, text){
    const modalTitle = modal.getElementsByClassName("title")[0];
    const modalBody = modal.getElementsByClassName("modal-body")[0];
    target.addEventListener("click", ()=>{
        modalTitle.innerHTML = title;
        modalBody.innerHTML = text;
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
    const trackImg = track.getElementsByClassName("track-img")[0];
    const modal = document.getElementById("track-info");
    setupModalLoad(modal, trackImg, track_info.title, "Some text about the track...")
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