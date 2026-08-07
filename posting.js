const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


console.log("Posting.js loaded");


function extractAlbumId(input) {

    if (!input) return null;


    if (input.includes("album/")) {

        return input
            .split("album/")[1]
            .split("?")[0];

    }


    return input.trim();

}



async function fetchSpotifyAlbumData(albumId) {


    try {


        console.log("Spotify ID:", albumId);


        const url =
        `https://open.spotify.com/oembed?url=https://open.spotify.com/album/${albumId}`;


        const response = await fetch(url);


        if (!response.ok) {

            throw new Error("Spotify request failed");

        }


        const data = await response.json();


        console.log("Spotify data:", data);



        let title = "Unknown Album";
        let artist = "Unknown Artist";


        if (data.title) {


            const split = data.title.split(" by ");


            if(split.length >= 2){

                title = split[0];
                artist = split.slice(1).join(" by ");

            }

            else {

                title = data.title;

            }


        }



        return {

            title: title,

            artist: artist,

            genre: "Unknown",

            cover_url: data.thumbnail_url || ""

        };



    } catch(error){


        console.error(
            "Spotify metadata error:",
            error
        );


        return {

            title:"Unknown Album",

            artist:"Unknown Artist",

            genre:"Unknown",

            cover_url:""

        };


    }


}



document.addEventListener(
"DOMContentLoaded",
()=>{


const form =
document.getElementById("review-form");



if(!form){

console.error("No review form found");

return;

}



form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const button =
document.getElementById("submit-btn");



button.disabled=true;

button.innerText="Publishing...";



const spotifyInput =
document.getElementById("spotify-id").value;



const rating =
document.getElementById("rating").value;



const reviewText =
document.getElementById("review-body").value;



const albumId =
extractAlbumId(spotifyInput);



const spotifyData =
await fetchSpotifyAlbumData(albumId);



const review = {


title:
spotifyData.title,


artist:
spotifyData.artist,


genre:
spotifyData.genre,


cover_url:
spotifyData.cover_url,


rating:
rating,


review_text:
reviewText


};



console.log(
"Sending review:",
review
);



const {data,error} =
await client
.from("reviews")
.insert(review)
.select();



console.log(
"Supabase:",
data,
error
);



if(error){


alert(
"DATABASE ERROR:\n\n"
+
error.message
);


button.disabled=false;

button.innerText="Publish Review";


return;


}



alert(
"Review Published!"
);



window.location.href="index.html";



});


});
