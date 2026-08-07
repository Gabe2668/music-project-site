const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Posting.js loaded");

function extractAlbumId(url) {
    if (!url) return null;

    if (url.includes("album/")) {
        return url.split("album/")[1].split("?")[0];
    }

    return url.trim();
}


async function fetchSpotifyAlbumData(albumId) {

    try {

        console.log("Fetching Spotify:", albumId);

        const response = await fetch(
            `https://open.spotify.com/oembed?url=https://open.spotify.com/album/${albumId}`
        );

        if (!response.ok) {
            throw new Error("Spotify lookup failed");
        }

        const data = await response.json();

        const parts = data.title.split(" by ");

        return {
            title: parts[0] || "Unknown Album",
            artist: parts[1] || "Unknown Artist",
            cover_url: data.thumbnail_url || ""
        };

    } catch(error){

        console.error("Spotify error:", error);

        return {
            title:"Unknown Album",
            artist:"Unknown Artist",
            cover_url:""
        };
    }
}



document.addEventListener("DOMContentLoaded", () => {


    const form = document.getElementById("review-form");


    if (!form) {
        console.error("FORM NOT FOUND");
        return;
    }


    console.log("Form found");


    form.addEventListener("submit", async function(e){

        e.preventDefault();

        console.log("Submit clicked");


        const button = document.getElementById("submit-btn");

        button.disabled = true;
        button.innerText = "Publishing...";


        const spotifyInput =
            document.getElementById("spotify-id").value;


        const rating =
            document.getElementById("rating").value;


        const reviewText =
            document.getElementById("review-body").value;



        const albumId = extractAlbumId(spotifyInput);


        const spotifyData =
            await fetchSpotifyAlbumData(albumId);



        const review = {

            title: spotifyData.title,

            artist: spotifyData.artist,

            year: new Date().getFullYear().toString(),

            cover_url: spotifyData.cover_url,

            rating: rating,

            review_text: reviewText

        };


        console.log("Sending to Supabase:", review);



        const {data,error} =
            await client
            .from("reviews")
            .insert(review)
            .select();



        console.log("Supabase response:", data,error);



        if(error){

            alert(
                "DATABASE ERROR:\n\n" + error.message
            );

            button.disabled=false;
            button.innerText="Publish Review";

            return;

        }



        alert("Review published!");

        window.location.href="index.html";


    });


});
