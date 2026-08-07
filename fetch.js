const SUPABASE_URL = 'https://ehwbxyuvkftikeigwxcz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod2J4eXV2a2Z0aWtlaWd3eGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTEyNjIsImV4cCI6MjEwMTYyNzI2Mn0.Yca_6GW5Apnfybb-11Jg7XdJamol3DrbBwqXV2yZQzQ';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allReviews = [];
let currentFilter = 'ALL';

async function loadReviews() {
  const grid = document.getElementById('reviews-grid');
  grid.innerHTML = '<p style="color: #8b949e;">Loading reviews...</p>';

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    grid.innerHTML = `<p style="color: #f85149;">Failed to load reviews. Error: ${error.message}</p>`;
    return;
  }

  allReviews = data || [];
  renderReviews(allReviews);
}

function renderReviews(reviews) {
  const grid = document.getElementById('reviews-grid');
  grid.innerHTML = '';

  if (reviews.length === 0) {
    grid.innerHTML = '<p style="color: #8b949e; padding: 20px 0;">No reviews found.</p>';
    return;
  }

  reviews.forEach(review => {
    const card = document.createElement('details');
    card.className = 'review-card';

    card.innerHTML = `
      <summary>
        <img src="${review.cover_url || 'https://via.placeholder.com/300'}" class="album-cover" alt="Album Cover" />
        <div class="album-info">
          <div class="album-title">${review.title || 'Untitled Album'}</div>
          <div class="album-artist">${review.artist || 'Unknown Artist'}</div>
          <div class="score-badge">${review.rating || 'NO SCORE'}</div>
        </div>
        <div class="expand-icon">▼ READ</div>
      </summary>
      <div class="review-content">
        <p>${review.review_text || 'No review text provided.'}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterBy(score) {
  currentFilter = score;
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (event && event.target) {
    event.target.classList.add('active');
  }

  applyFiltersAndSearch();
}

function handleSearch() {
  applyFiltersAndSearch();
}

function applyFiltersAndSearch() {
  const query = document.getElementById('search-input').value.toLowerCase();

  let filtered = allReviews;

  // Filter by Rating Badge
  if (currentFilter !== 'ALL') {
    filtered = filtered.filter(r => r.rating === currentFilter);
  }

  // Filter by Search Query
  if (query.trim() !== '') {
    filtered = filtered.filter(r => 
      (r.title && r.title.toLowerCase().includes(query)) ||
      (r.artist && r.artist.toLowerCase().includes(query)) ||
      (r.review_text && r.review_text.toLowerCase().includes(query))
    );
  }

  renderReviews(filtered);
}

document.addEventListener('DOMContentLoaded', loadReviews);
