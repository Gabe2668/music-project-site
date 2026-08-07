const SUPABASE_URL =
'https://ehwbxyuvkftikeigwxcz.supabase.co';


const SUPABASE_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';


const client =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);




function extractAlbumId(input){

if(input.includes("album/")){

return input
.split("album/")[1]
.split("?")[0];

}

return input.trim();

}





async function fetchSpotifyAlbumData(albumId){


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

let parts =
data.title.split(" by ");


title=parts[0];

artist=parts.slice(1).join(" by ");

}



return {

title,
artist,
cover_url:data.thumbnail_url || ""

};


}

catch(error){


console.error(error);


return {

title:"Unknown Album",
artist:"Unknown Artist",
cover_url:""

};


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

button.innerText="Publishing...";




const albumInput =
document.getElementById("spotify-id").value;



const spotifyData =
await fetchSpotifyAlbumData(
extractAlbumId(albumInput)
);




const review={


title:
spotifyData.title,


artist:
spotifyData.artist,


genre:
document.getElementById("genre").value,


year:
document.getElementById("year").value,


cover_url:
spotifyData.cover_url,


rating:
document.getElementById("rating").value,


review_text:
document.getElementById("review-body").value


};





console.log(review);





const {error}=
await client
.from("reviews")
.insert(review);



if(error){


alert(error.message);


button.disabled=false;

button.innerText="Publish Review";


return;


}




alert("Review Published!");

window.location.href="index.html";



});



});
