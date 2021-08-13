//Wait for the page to load
window.onload = function() {
    
}

//Immediately-invoked Function Expression
;(function(){
    getArtworks();
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
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function appendArtwork(artwork, container){
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="artwork">
        <img class="artwork-img" src="https://api.mecena.net/artwork/${artwork.artwork}">
        <h4 class="artwork-label">${artwork.title}</h4>
    </div>`.trim();

    container.appendChild(div.firstChild);
}