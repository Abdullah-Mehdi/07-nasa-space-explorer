// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.getElementById('fetchButton');
const gallery = document.getElementById('gallery');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Add event listener to the fetch button
fetchButton.addEventListener('click', fetchNASAImages);

// Function to fetch NASA APOD images for the selected date range
async function fetchNASAImages() {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Show loading message
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading amazing space images...</p>
    </div>
  `;
  
  try {
    // Build the API URL with the date range and API key
    const apiUrl = `${NASA_API_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
    
    // Fetch data from NASA APOD API
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Display the images in the gallery
    displayImages(data);
    
  } catch (error) {
    // Show error message if something goes wrong
    console.error('Error fetching NASA images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>Sorry, there was an error loading the images. Please try again.</p>
      </div>
    `;
  }
}

// Function to display the fetched images in a grid format
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  
  // Check if we have any images
  if (!images || images.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔍</div>
        <p>No images found for the selected date range.</p>
      </div>
    `;
    return;
  }
  
  // Create a card for each image/video
  images.forEach(item => {
    const card = createImageCard(item);
    gallery.appendChild(card);
  });
}

// Function to create a card for each NASA image or video
function createImageCard(item) {
  // Create the main card container
  const card = document.createElement('div');
  card.className = 'gallery-item';
  
  // Create the media element (image or video)
  let mediaElement;
  
  if (item.media_type === 'image') {
    // Create an image element
    mediaElement = document.createElement('img');
    mediaElement.src = item.url;
    mediaElement.alt = item.title;
    
    // Make image clickable to open full size
    mediaElement.addEventListener('click', () => {
      window.open(item.hdurl || item.url, '_blank');
    });
    mediaElement.style.cursor = 'pointer';
    
  } else if (item.media_type === 'video') {
    // Create a clickable div for videos (since they're usually YouTube embeds)
    mediaElement = document.createElement('div');
    mediaElement.className = 'video-thumbnail';
    mediaElement.innerHTML = `
      <div class="video-play-icon">▶️</div>
      <p>Click to watch video</p>
    `;
    
    // Make video thumbnail clickable to open video
    mediaElement.addEventListener('click', () => {
      window.open(item.url, '_blank');
    });
    mediaElement.style.cursor = 'pointer';
  }
  
  // Create title element
  const title = document.createElement('h3');
  title.textContent = item.title;
  title.style.marginTop = '10px';
  title.style.fontSize = '16px';
  title.style.fontWeight = 'bold';
  
  // Create date element
  const date = document.createElement('p');
  date.textContent = `Date: ${item.date}`;
  date.style.color = '#666';
  date.style.fontSize = '14px';
  date.style.margin = '5px 0';
  
  // Create explanation element (truncated)
  const explanation = document.createElement('p');
  const maxLength = 150;
  const truncatedExplanation = item.explanation.length > maxLength 
    ? item.explanation.substring(0, maxLength) + '...' 
    : item.explanation;
  explanation.textContent = truncatedExplanation;
  explanation.style.fontSize = '14px';
  explanation.style.lineHeight = '1.4';
  explanation.style.marginTop = '10px';
  
  // Add all elements to the card
  card.appendChild(mediaElement);
  card.appendChild(title);
  card.appendChild(date);
  card.appendChild(explanation);
  
  return card;
}
