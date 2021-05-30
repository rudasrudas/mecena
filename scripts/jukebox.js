function render(){
    var songList = [["https://preview.redd.it/wzfk3rqz36d41.png?auto=webp&s=0ef0940179edeb0548fcfc3c062ed81bdc63e185", "Trilogy kiss", "The Weeknd"],
                    ["https://images-na.ssl-images-amazon.com/images/I/A1LVEJikmZL._SL1500_.jpg", "Currents", "Tame Impala"], 
                    ["https://i2.wp.com/thesewaneepurple.org/wp-content/uploads/2020/02/The-Slow-Rush-album-cover.-Photo-from-Consequence-of-Sound..jpg?fit=3000%2C3000&ssl=1", "The Slow Rush", "Tame Impala"]];

    var jukebox = document.getElementById("jukebox-content");

    for(let i = 0; i < songList.length; i++){
        let song = document.createElement("div");

        let cover = document.createElement("img");
        let title = document.createElement("h4");
        let artist = document.createElement("h4");

        song.appendChild(cover);
        song.appendChild(title);
        song.appendChild(artist);

        cover.src = songList[i][0];
        title.innerHTML = songList[i][1];
        artist.innerHTML = songList[i][2];

        song.onclick = async function () {
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

        song.classList.add("jukebox-song");
        cover.classList.add("jukebox-song-img");
        title.classList.add("jukebox-song-title");
        artist.classList.add("jukebox-song-artist");

        jukebox.appendChild(song);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
