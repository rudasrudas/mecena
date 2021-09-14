window.onload = function() {
    // getArtwork(document.getElementById('hero-img'), 'mar.png');
    // getInstagramFeed();
}

function getArtwork(img, id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/image/${id}?type=artwork`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const src = xhr.response;
            document.getElementById('hero-img').innerHTML = src;
            img.src = src;
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}