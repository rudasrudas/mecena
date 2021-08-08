function render(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://45.80.152.150:5000/featured`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const tracks = JSON.parse(xhr.response);
            console.log(tracks);

            var songElements = [];
            var selected;

            var jukebox = document.getElementById("jukebox-content");

            for(let i = 0; i < Object.keys(tracks).length; i++){
                const song = document.createElement("div");

                const cover = document.createElement("img");
                const title = document.createElement("h4");
                const artist = document.createElement("h4");

                song.appendChild(cover);
                song.appendChild(title);
                song.appendChild(artist);

                cover.src = `http://45.80.152.150:5000/artwork/${tracks[i].cover}`;
                title.innerHTML = tracks[i].title;
                artist.innerHTML = tracks[i].artist;

                song.classList.add("jukebox-song");
                cover.classList.add("jukebox-song-img");
                title.classList.add("jukebox-song-title");
                artist.classList.add("jukebox-song-artist");

                song.style.opacity = 1;

                songElements.push(song);
                jukebox.appendChild(song);

                song.onclick = async function () {

                    var audio = new Audio(`http://45.80.152.150:5000/track/${tracks[i].track}`);
                    audio.play();

                    selected = i;

                    fadeTo(songElements[i-2], 0);
                    fadeTo(songElements[i-1], 0.5);
                    fadeTo(songElements[i], 1);
                    fadeTo(songElements[i+1], 0.5);
                    fadeTo(songElements[i+2], 0);

                    while (song.getBoundingClientRect().left + (song.getBoundingClientRect().right - song.getBoundingClientRect().left)/2 < window.innerWidth/2){
                        let newLeft = (+jukebox.style.left.substring(0, jukebox.style.left.length-2) + 10) + "px";
                        jukebox.style.left = newLeft;

                        await sleep(1);
                    }
                    while (song.getBoundingClientRect().left + (song.getBoundingClientRect().right - song.getBoundingClientRect().left)/2 > window.innerWidth/2){
                        let newLeft = (+jukebox.style.left.substring(0, jukebox.style.left.length-2) - 10) + "px";
                        jukebox.style.left = newLeft;
                        await sleep(1);
                    }
                }
            }

            console.log(songElements);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fadeTo(song, opacity){
    console.log(song);
    if (song == undefined || song.style == undefined) return;

    while (opacity > song.style.opacity){
        //Fade out
        song.style.opacity += 0.1;
    }
    while (opacity < song.style.opacity){
        //Fade in
        song.style.opacity -= 0.1;
    }
    console.log("SUCCESS!");
}