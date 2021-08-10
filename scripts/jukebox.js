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

    const cover = document.createElement("img");
    const title = document.createElement("h3");
    const artist = document.createElement("h4");
    const mediaWrapper = document.createElement("div");

    generateMediaElement(mediaWrapper, "fa-spotify", track.media_spotify);
    generateMediaElement(mediaWrapper, "fa-apple", track.media_apple_music);
    generateMediaElement(mediaWrapper, "fa-youtube", track.media_youtube);
    generateMediaElement(mediaWrapper, "fa-soundcloud", track.media_soundcloud);
    generateMediaElement(mediaWrapper, "fa-itunes", track.media_itunes);

    //append elements

    song.appendChild(cover);
    song.appendChild(title);
    song.appendChild(artist);
    song.appendChild(mediaWrapper);

    //element styling

    cover.src = `https://api.mecena.net/artwork/${track.cover}`;
    title.innerHTML = track.title;
    artist.innerHTML = track.artist;

    song.classList.add("jukebox-song");
    cover.classList.add("jukebox-song-img");
    title.classList.add("jukebox-song-title");
    artist.classList.add("jukebox-song-artist");

    song.onclick = async function () {

        var audio = new Audio(`https://api.mecena.net/track/${track.track}`);
        // audio.play();
    }

    jukebox.owlCarousel('add', song).owlCarousel('update')
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