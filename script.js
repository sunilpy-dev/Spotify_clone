console.log("javascript loaded");
// let anme="dhdjhs jdhjdh hii hii hii";
// console.log(anme.replaceAll("hii","nii"));
let currentSong = new Audio();
let songs;//here we have maked the songs as the golbal variable

let currfolder;



//function to converty seconds of time to proper second and minute formate
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currfolder = folder;

    //so by using teh .htaccess file we can access the somngs folder wihtout the host post http://127.0.0.1:3000
    let a = await fetch(`/${folder}/`);//now we are making it to fetch the songs from the folders
    let response = await a.text()///it used to convert the data into an text formate that is fetched
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;//set the entire songs dom to the created new div tag
    let as = div.getElementsByTagName("a");//fetched all thetag that are a in response dom
    // console.log(as);//provide the array of a tag
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {//so here we are checkig that if the element url is ends with the .mp3 then push it into an songs array their url pnly

            songs.push(element.href.split(`/${folder}/`)[1]);// so here we get the two arya which are of before /songs/ and after it

        }
    }
    // console.log(songs);



    //play the first song


    //show all the song in the playlis
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];//now here we move from the songul querry to inside of it so only .tagname wala dom use hua nd here we get more tags so we have to look only for the 0th index tag name of ul
    songul.innerHTML = "";
    for (const song of songs) {
        // songul.innerHTML=songul.innerHTML+song;
        // console.log(song);
        // songul.innerHTML = songul.innerHTML + `<li> ${song.replaceAll("%20"," ")} </li>`;//placing inside the li tags and we have used the choping to make it more covennient fr the reading but replace only replace the first to make it for all %20 e ahve to use replaeAll
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div></li>`;//By this we are setting the custom song card to display in the given place

    }
    // console.log(songul);

    // .replaceAll("%20"," ")

    //attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {//we hae fetched the all lis thar are resides inside of the songlist ul
        // console.log(e.getElementsByTagName("div")[0]);//here we get the firt div of the li taht contains the song details
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);//now here we get the first div of the li taht contains the song details and only the song name
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio=new Audio("/songs/"+track);//here we fetched the song from the songs folder to play
    currentSong.src = `/${currfolder}/` + track;//here we have set the new Audio sorce as the songs folder song
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);//here we are trying to get the song info of that particular music when trigger to play that music specificaly
    //by use of the decodeURI we can decode the encoded uri or say url given initally or passes
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


// display album function
async function displayAlbums() {
    let a = await fetch(`/songs/`);//now we are making it to fetch the songs from the folders
    let response = await a.text()///it used to convert the data into an text formate that is fetched
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;//set the entire songs dom to the created new div tag
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);

    //so the event of folder listening is not wrking due to that we were getiing the folders asynchronumously so here w have to use the tradition alfor lop for that
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {//checked for the link that contains only the /songs in it
            // console.log(e.href.split("/").slice(-2)[0]);//get teh folder name here
            let folder = e.href.split("/").slice(-2)[0];
            //get teh metadta of the folder
            let a = await fetch(`/songs/${folder}/info.json`);//now we are making it to fetch the songs from the folders
            let response = await a.json()//now this timewe are fetching the data in the formate of json
            // console.log(response);//now we got the entire created info.json 
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder=${folder} class="card ">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                fill="none"><!-- Green Circle -->
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" fill="#000" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        };

        //load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {//so byclassnaem give collection and to convert from collect to array we use the arrya.from
            e.addEventListener("click", async item => {
                // console.log(item,item.currentTarget.dataset);//to get only active of clicked on which we have applied teh event listner we can do currentTarget insted of target
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0])

            })
        })
    };
    // console.log(div);
}






async function main() {

    //get the list of sog of all songs
    await getSongs("songs/ncs");//beacuse to fetch the all songs it will take some time 
    // console.log(songs);

    // currentSong.src=songs[0];//here we are by default setting the current song value to first one 
    playMusic(songs[0], true);//here we are setting teh default song to zero and try to paly if not pause 

    // remove the song initializtion to out of it fro accessing it outside

    //Display all the albums on the page
    displayAlbums();









    //attach event listner to the play ,next and previous
    play.addEventListener("click", () => {//we can directly add the js to the id and we dont have to fetch it like in this case for adding the event listner
        if (currentSong.paused) {
            //this give us the flag if the current song is play or in pasue state
            currentSong.play();
            play.src = "images/pause.svg"//so on teh new song play the play image change to pause and pause to play
        }
        else {
            currentSong.pause();//this just pause the song 
            play.src = "images/play.svg"
        }
    })



    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {//here the timupdate is the event taht sets the time updatation
        // console.log(currentSong.currentTime, currentSong.duration);//here the current time give us the current time in secont till the song started and the duration give the total time of that song
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`//uses the function to convert teh time of elapsed and total time to a proper format and inserted inside the inner html

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })



    //Add an event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e.offsetX,e.target);//this give on which target of tag we are clicking
        //tehe e.offsetX give us how far wee have clicked
        // console.log(e.target.getBoundingClientRect(),e.offsetX);//get boundingClientRect() function only work when we apply it to the target elelemt
        // console.log(e.target.getBoundingClientRect().width,e.offsetX);//thias .width will give how far according to the device width and the traget element width we can click on


        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";//no here we have maked the style of circle to change on our click as of the position of the click
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;//by doing this we have alterd the songcurrent time and updated it according to the user preference of clicked

    })



    //add an event listner for hamburger icon
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //add event listner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add event listner to previous
    previous.addEventListener("click", () => {
        console.log("Previous clicked");
        // console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);//here we are getiing the indexo of the the current song mp3 value in the array of songs
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    //add event listner to next
    next.addEventListener("click", () => {
        console.log("next clicked");
        // console.log(currentSong);//fetched the current song on click of next
        // console.log(songs,index);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);//here we are getiing the indexo of the the current song mp3 value in the array of songs
        // console.log(songs.length)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })


    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value);//so heree by using the e.tragett.value is giving us the volume value out of 100
        console.log("Setting volume to ", e.target.value);//so heree by using the e.tragett.value is giving us the volume value out of 100
        currentSong.volume = parseInt(e.target.value) / 100; //by doing this we are changing teh value of volume of the current song
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
        if (currentSong.volume <= 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg","mute.svg");
        }
    })



    //add event listner to mute the volume button
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log(e.target.src);
        if (e.target.src.includes("volume.svg")) {//so here we were only getting the entire link so we have to chack it using the includes not by ==
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");//and to make changes we have to add the replace think and strings are immutable so we have to redefine the link here
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            currentSong.volume = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })













    //play the song
    // var audio = new Audio(songs[0]);//here audio method taks an html Autio file source and then using the var we can do audio.play(); that will automatically play the song in media
    // // audio.muted;
    // // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;//and this helps to fetch teh duration of an audio
    //     console.log(duration);//this give us the total duration in seconds
    // })

}
main();