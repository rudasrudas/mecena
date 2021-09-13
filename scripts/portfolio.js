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

function appendArtwork(artwork, container){
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="artwork">
        <img class="artwork-img" onclick="showArtwork(${artwork.id})" src="https://api.mecena.net/artwork/${artwork.artwork}">
        <h4 class="artwork-label">${artwork.title}</h4>
    </div>`.trim();
    
    container.appendChild(div.firstChild);
}

function showArtwork(id) {
    document.getElementById('artwork-info').classList.remove('hidden');
}

function getTracks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/tracks`, true);
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

function appendTrack(track, container){
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="track">
        <img class="track-img" onclick="showTrack(${track.id})" src="https://api.mecena.net/artwork/${track.cover}">
        <h4 class="track-label">${track.title}</h4>
    </div>`.trim();

    container.appendChild(div.firstChild);
}

function showTrack(id) {
    document.getElementById('track-info').classList.remove('hidden');
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

function hideModal(id){
    document.getElementById(id).classList.add('hidden');
}