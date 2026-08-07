const SUPABASE_URL =
'https://ehwbxyuvkftikeigwxcz.supabase.co';

const SUPABASE_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4NjA1MTI2MiwiZXhwIjoyMTAxNjI3MjYyfQ.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';


const client =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);



let allReviews = [];

let showingRecent = false;







async function loadReviews(){



const container =
document.getElementById(
"rating-sections"
);



container.innerHTML =
"Loading reviews...";





const {data,error} =
await client
.from("reviews")
.select("*")
.order(
"created_at",
{
ascending:false
}
);





console.log(
"Database:",
data,
error
);





if(error){


container.innerHTML =
"ERROR: " + error.message;


return;


}





allReviews =
data || [];





renderSections(
allReviews
);



}









function renderSections(reviews){



const container =
document.getElementById(
"rating-sections"
);



container.innerHTML="";





if(reviews.length===0){


container.innerHTML =
"No reviews found.";


return;


}





const ratings = [

"10/10",
"9/10",
"8/10",
"7/10",
"6/10",
"5/10",
"4/10",
"3/10",
"2/10",
"1/10",
"0/10"

];







ratings.forEach(rating=>{



const matching =
reviews.filter(
r=>r.rating===rating
);





if(matching.length===0)
return;







const section =
document.createElement(
"section"
);



section.className =
"rating-section";





section.innerHTML = `

<div class="rating-header">

<h2>${rating}</h2>

<span>
${matching.length} album${matching.length === 1 ? "" : "s"}
</span>

</div>


<div class="reviews-grid"></div>


`;






const grid =
section.querySelector(
".reviews-grid"
);






matching.forEach(review=>{


grid.appendChild(
createCard(review)
);


});





container.appendChild(
section
);



});






if(showingRecent){


container.innerHTML="";



const section =
document.createElement(
"section"
);



section.className =
"rating-section";



section.innerHTML = `

<div class="rating-header">

<h2>Most Recent</h2>

<span>
${reviews.length} albums
</span>

</div>


<div class="reviews-grid"></div>

`;



const grid =
section.querySelector(
".reviews-grid"
);




reviews.forEach(review=>{

grid.appendChild(
createCard(review)
);


});



container.appendChild(
section
);


}



}









function createCard(review){



const card =
document.createElement(
"details"
);



card.className =
"review-card";





card.innerHTML = `


<summary>


<img 
src="${review.cover_url || ''}"
class="album-cover">



<div class="album-info">


<div class="album-title">

${review.title || "Unknown Album"}

</div>




<div class="album-artist">

${review.artist || "Unknown Artist"}

</div>



<div class="album-genre">

${review.genre || "Unknown Genre"}

</div>



<div class="score-badge">

${review.rating}

</div>



</div>



<div class="expand-arrow">

▶

</div>



</summary>





<div class="review-content">


${review.review_text || "No review."}


${review.year ? 
`<br><br><b>Released:</b> ${review.year}` 
: ""}


</div>



`;







card.addEventListener(
"toggle",
()=>{


const arrow =
card.querySelector(
".expand-arrow"
);



if(card.open){

arrow.classList.add(
"rotate"
);


}

else{


arrow.classList.remove(
"rotate"
);


}


}

);






return card;


}









function sortRecent(){


showingRecent =
!showingRecent;


renderSections(
allReviews
);



}









function handleSearch(){



const query =
document
.getElementById(
"search-input"
)
.value
.toLowerCase();





const filtered =
allReviews.filter(
review=>{


return (

(review.title &&
review.title.toLowerCase().includes(query))


||

(review.artist &&
review.artist.toLowerCase().includes(query))


||

(review.genre &&
review.genre.toLowerCase().includes(query))


||

(review.review_text &&
review.review_text.toLowerCase().includes(query))


);


}

);





renderSections(
filtered
);


}









document.addEventListener(
"DOMContentLoaded",
loadReviews
);
