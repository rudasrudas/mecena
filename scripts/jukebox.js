function render(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tracks = JSON.parse(xhr.response);
            console.log(tracks);

            var jukebox = $(".owl-carousel");

            for(let i = 0; i < Object.keys(tracks).length; i++){
                const song = document.createElement("div");

                const cover = document.createElement("img");
                const title = document.createElement("h4");
                const artist = document.createElement("h4");

                song.appendChild(cover);
                song.appendChild(title);
                song.appendChild(artist);

                cover.src = `https://api.mecena.net/artwork/${tracks[i].cover}`;
                title.innerHTML = tracks[i].title;
                artist.innerHTML = tracks[i].artist;

                song.classList.add("jukebox-song");
                cover.classList.add("jukebox-song-img");
                title.classList.add("jukebox-song-title");
                artist.classList.add("jukebox-song-artist");

                song.style.opacity = 1;

                // jukebox.appendChild(song);
                jukebox.owlCarousel('add', song).owlCarousel('update')

                song.onclick = async function () {

                    var audio = new Audio(`https://api.mecena.net/track/${tracks[i].track}`);
                    // audio.play();
                }
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
