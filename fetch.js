const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';


const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


let allReviews=[];
let currentFilter="ALL";



async function loadReviews(){


    const grid=document.getElementById("reviews-grid");


    grid.innerHTML="Loading...";


    console.log("Loading reviews");


    const {data,error}=await client
        .from("reviews")
        .select("*")
        .order("created_at",{ascending:false});



    console.log("Database result:",data,error);



    if(error){

        grid.innerHTML =
        "ERROR: "+error.message;

        return;

    }



    allReviews=data || [];


    renderReviews(allReviews);


}



function renderReviews(reviews){

    const grid=document.getElementById("reviews-grid");

    grid.innerHTML="";


    if(reviews.length===0){

        grid.innerHTML="No reviews found.";

        return;

    }



    reviews.forEach(review=>{


        const card=document.createElement("details");

        card.className="review-card";


        card.innerHTML=`

        <summary>

        <img src="${review.cover_url || ''}" class="album-cover">

        <div class="album-info">

        <div class="album-title">
        ${review.title}
        </div>

        <div class="album-artist">
        ${review.artist}
        </div>

        <div class="score-badge">
        ${review.rating}
        </div>

        </div>

        </summary>


        <div class="review-content">

        ${review.review_text}

        </div>

        `;


        grid.appendChild(card);


    });


}



document.addEventListener(
"DOMContentLoaded",
loadReviews
);
