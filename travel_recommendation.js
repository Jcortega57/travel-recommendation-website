let travelData = null;

// Fetch data from JSON
fetch('travel_recommendation_api.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    travelData = data;
  })
  .catch(error => {
    console.error('Fetching data failed:', error);
  });

// Search logic
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.search-container button[type="button"]');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const keyword = searchInput.value.trim().toLowerCase();
      handleSearch(keyword);
    });
  }
});

function handleSearch(keyword) {
  if (!travelData) {
    alert('Travel data is not loaded yet. Please try again in a moment.');
    return;
  }

  let results = [];

  // Normalize input: lowercase, trim, remove trailing punctuation
  let cleanKeyword = keyword.replace(/[^a-zA-Z]/g, '').toLowerCase();

  // If "temples" is searched (allow "temple" or "temples")
  if (cleanKeyword === "temple" || cleanKeyword === "temples") {
    results = travelData.temples.map(t => ({
      name: t.name,
      imageUrl: t.imageUrl,
      description: t.description
    }));
  }
  // If "beaches" is searched (allow "beach" or "beaches")
  else if (cleanKeyword === "beach" || cleanKeyword === "beaches") {
    results = travelData.beaches.map(b => ({
      name: b.name,
      imageUrl: b.imageUrl,
      description: b.description
    }));
  }
  // If a country is searched (exact match, ignoring punctuation)
  else {
    // Remove punctuation for country matching
    const normalizedCountries = travelData.countries.map(c => ({
      ...c,
      normalName: c.name.replace(/[^a-zA-Z]/g, '').toLowerCase()
    }));
    const country = normalizedCountries.find(c => c.normalName === cleanKeyword);
    if (country) {
      results = country.cities.map(city => ({
        name: city.name,
        imageUrl: city.imageUrl,
        description: city.description
      }));
    }
  }

  displayResults(results, keyword);
}

function displayResults(results, keyword) {
  let resultsDiv = document.getElementById('search-results');
  if (!resultsDiv) {
    // If not present, create one at the end of the body
    resultsDiv = document.createElement('div');
    resultsDiv.id = 'search-results';
    document.body.appendChild(resultsDiv);
  }
  resultsDiv.innerHTML = ""; // Clear old results

  if (!results || results.length === 0) {
    resultsDiv.innerHTML = `<p style="color:#fff;">No results found for "<b>${keyword}</b>".</p>`;
    return;
  }

  // Build result cards
  const cards = results.map(item => `
    <div class="result-card">
      <img src="${item.imageUrl}" alt="${item.name}" class="result-image" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </div>
  `).join('');

  resultsDiv.innerHTML = `<div class="results-grid">${cards}</div>`;
}

/* RESET BUTTON */
function resetSearchAndResults() {
  // Clear the search input
  document.getElementById('search-input').value = '';

  // Clear the search results (including images and descriptions)
  document.getElementById('search-results').innerHTML = '';
}