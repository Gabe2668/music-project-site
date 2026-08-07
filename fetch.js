const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allReviews = [];

async function loadReviews() {
  const grid = document.getElementById('reviews-grid');
  grid.innerHTML = '<p style="color: #8b949e;">Loading reviews...</p>';

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    grid.innerHTML = '<p style="color: #f85149;">Failed to load reviews.</p>';
    return;
  }

  allReviews = data;
  renderReviews(allReviews);
}

function renderReviews(reviews) {
  const grid = document.getElementById('reviews-grid');
  grid.innerHTML = '';

  if (reviews.length === 0) {
    grid.innerHTML = '<p style="color: #8b949e;">No reviews found.</p>';
    return;
  }

  reviews.forEach(review => {
    const card = document.createElement('details');
    card.className = 'review-card';

    card.innerHTML = `
      <summary>
        <img src="${review.cover_url || 'https://via.placeholder.com/300'}" class="album-cover" alt="Cover" />
        <div class="album-info">
          <div class="album-title">${review.title || 'Untitled'} - ${review.artist || 'Unknown'}</div>
          <div class="score-badge">${review.rating}</div>
        </div>
        <div class="expand-icon">▼ Click to Expand</div>
      </summary>
      <div class="review-content">
        <p>${review.review_text}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterBy(score) {
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (score === 'ALL') {
    renderReviews(allReviews);
  } else {
    const filtered = allReviews.filter(r => r.rating === score);
    renderReviews(filtered);
  }
}

document.addEventListener('DOMContentLoaded', loadReviews);
