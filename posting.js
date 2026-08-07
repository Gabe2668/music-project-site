const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = 'Publishing...';
  submitBtn.disabled = true;

  const spotifyInput = document.getElementById('spotify-id').value;
  const rating = document.getElementById('rating').value;
  const reviewText = document.getElementById('review-body').value;

  const newReview = {
    title: spotifyInput.length > 0 ? spotifyInput : "Album Review",
    artist: "Artist",
    year: "2026",
    cover_url: "https://via.placeholder.com/300",
    rating: rating,
    review_text: reviewText
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert([newReview]);

  if (error) {
    console.error('Error posting:', error);
    alert('Failed to post. Ensure RLS is disabled in your Supabase reviews table.');
    submitBtn.innerText = 'Publish Review';
    submitBtn.disabled = false;
  } else {
    alert('Review Posted Successfully!');
    window.location.href = 'index.html';
  }
});
