const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = 'Publishing...';
  submitBtn.disabled = true;

  const rawInput = document.getElementById('spotify-id').value.trim();
  const ratingVal = document.getElementById('rating').value;
  const reviewVal = document.getElementById('review-body').value.trim();

  // Clean title display
  let albumTitle = rawInput;
  if (rawInput.includes('spotify.com')) {
    albumTitle = "Spotify Album Entry";
  }

  // Fail-safe payload (Sends basic fields first, ensuring success regardless of DB columns)
  const payload = {
    rating: ratingVal,
    review_text: reviewVal,
    title: albumTitle,
    artist: "Artist",
    year: "2026",
    cover_url: "https://via.placeholder.com/300/161b22/58a6ff?text=Album"
  };

  const { error } = await supabase
    .from('reviews')
    .insert([payload]);

  if (error) {
    console.error('Supabase Error:', error);
    alert('Error posting review: ' + error.message);
    submitBtn.innerText = 'Publish Review';
    submitBtn.disabled = false;
  } else {
    alert('Review Posted Successfully!');
    window.location.href = 'index.html';
  }
});
