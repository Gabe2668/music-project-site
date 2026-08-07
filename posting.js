const SUPABASE_URL =
'https://ehwbxyuvkftikeigwxcz.supabase.co';

const SUPABASE_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';


const LASTFM_KEY =
'a8f56651daec5b647bee240225a73caa';


const client =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);





function extractAlbumId(input){


if(!input) return "";


if(input.includes("album/")){


return input
.split("album/")[1]
.split("?")[0];


}


return input.trim();


}








async function fetchSpotifyData(albumId){


try{


const response =
await fetch(
`https://open.spotify.com/oembed?url=https://open.spotify.com/album/${albumId}`
);



const data =
await response.json();



let title="Unknown Album";
let artist="Unknown Artist";



if(data.title){


const split =
data.title.split(" by ");



if(split.length > 1){


title = split[0];

artist =
split.slice(1).join(" by ");


}

else{


title=data.title;


}



}



return {


title:title,

artist:artist,

cover_url:
data.thumbnail_url || ""


};



}


catch(error){


console.error(
"Spotify error:",
error
);


return {


title:"Unknown Album",

artist:"Unknown Artist",

cover_url:""


};



}


}









async function fetchLastFMGenres(artist,album){


try{


const url =
`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`;



const response =
await fetch(url);



const data =
await response.json();




if(
data.album &&
data.album.tags &&
data.album.tags.tag
){


return data.album.tags.tag
.slice(0,5)
.map(tag=>tag.name)
.join(", ");


}




return "Unknown";



}


catch(error){


console.error(
"Last.fm error:",
error
);


return "Unknown";


}



}










document.addEventListener(
"DOMContentLoaded",
()=>{


const form =
document.getElementById("review-form");



if(!form) return;





form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const button =
document.getElementById("submit-btn");



button.disabled=true;

button.innerText="Fetching Metadata...";





const spotifyInput =
document.getElementById("spotify-id").value;



const rating =
document.getElementById("rating").value;



const manualGenre =
document.getElementById("genre").value;



const year =
document.getElementById("year").value;



const reviewText =
document.getElementById("review-body").value;






const albumId =
extractAlbumId(
spotifyInput
);




const spotifyData =
await fetchSpotifyData(
albumId
);





button.innerText="Finding Genres...";



let genre =
manualGenre;



if(!genre){


genre =
await fetchLastFMGenres(
spotifyData.artist,
spotifyData.title
);


}







const review = {


title:
spotifyData.title,


artist:
spotifyData.artist,


genre:
genre,


year:
year,


cover_url:
spotifyData.cover_url,


rating:
rating,


review_text:
reviewText



};





console.log(
"Sending:",
review
);





button.innerText="Publishing...";





const {data,error} =
await client
.from("reviews")
.insert([review])
.select();






console.log(
"Supabase:",
data,
error
);





if(error){


alert(
"Database error:\n\n" +
error.message
);


button.disabled=false;

button.innerText="Publish Review";


return;


}







alert(
"Review Published!"
);



window.location.href =
"index.html";



}



);



});
