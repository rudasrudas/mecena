window.onload = function() {
    // getArtwork(document.getElementById('hero-img'), 'mar.png');
}

function getFeaturedSongs() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net:5000/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(JSON.parse(xhr.response));
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function getArtwork(img, id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/artwork/${id}`, true);
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