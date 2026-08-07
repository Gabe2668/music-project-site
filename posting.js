const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Extract Spotify Album ID from link
function extractAlbumId(url) {
  if (!url) return null;
  if (url.includes('album/')) {
    return url.split('album/')[1].split('?')[0];
  }
  return url.trim();
}

// Fetch Album Metadata using Spotify's public embed API endpoint
async function fetchSpotifyAlbumData(albumId) {
  try {
    const response = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/album/${albumId}`);
    if (!response.ok) throw new Error('Spotify album not found');
    const data = await response.json();
    
    // Parses "Album Title by Artist Name" format
    const titleParts = data.title ? data.title.split(' by ') : ['Untitled Album', 'Unknown Artist'];
    const albumTitle = titleParts[0] || 'Untitled Album';
    const artistName = titleParts[1] || 'Unknown Artist';

    return {
      title: albumTitle,
      artist: artistName,
      cover_url: data.thumbnail_url || 'https://via.placeholder.com/300'
    };
  } catch (err) {
    console.warn('Could not fetch automatically from Spotify. Using fallback text.', err);
    return {
      title: 'Album Review',
      artist: 'Artist',
      cover_url: 'https://via.placeholder.com/300'
    };
  }
}

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = 'Fetching Spotify Data & Publishing...';
  submitBtn.disabled = true;

  const rawSpotifyInput = document.getElementById('spotify-id').value;
  const rating = document.getElementById('rating').value;
  const reviewText = document.getElementById('review-body').value;

  const albumId = extractAlbumId(rawSpotifyInput);
  const spotifyData = await fetchSpotifyAlbumData(albumId);

  const newReview = {
    title: spotifyData.title,
    artist: spotifyData.artist,
    year: new Date().getFullYear().toString(),
    cover_url: spotifyData.cover_url,
    rating: rating,
    review_text: reviewText
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert([newReview]);

  if (error) {
    console.error('Error posting to Supabase:', error);
    alert('Failed to post review: ' + error.message);
    submitBtn.innerText = 'Publish Review';
    submitBtn.disabled = false;
  } else {
    alert('Review Published Successfully!');
    window.location.href = 'index.html';
  }
});
