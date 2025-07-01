// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.getElementById('fetchButton');
const gallery = document.getElementById('gallery');

// Modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.querySelector('.close');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Add event listener to the fetch button
fetchButton.addEventListener('click', fetchNASAImages);

// Modal event listeners
closeModal.addEventListener('click', hideModal);

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

// Close modal with escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    hideModal();
  }
});

// Function to show the modal with image/video details
function showModal(item) {
  // Show the modal immediately with loading state
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  // Show loading state first
  showLoadingState();
  
  // Small delay to ensure loading state is visible
  setTimeout(() => {
    // Set the title and date
    modalTitle.textContent = item.title;
    modalDate.textContent = `Date: ${item.date}`;
    modalExplanation.textContent = item.explanation;
    
    // Handle media display based on type
    if (item.media_type === 'image') {
      loadImageContent(item);
    } else if (item.media_type === 'video') {
      loadVideoContent(item);
    }
  }, 100); // Short delay to show loading state
}

// Function to show loading state in modal
function showLoadingState() {
  // Hide both media containers
  modalImage.style.display = 'none';
  modalVideo.style.display = 'none';
  
  // Show loading message
  modalTitle.textContent = 'Loading...';
  modalDate.textContent = '';
  modalExplanation.textContent = 'Please wait while we load this amazing space content...';
  
  // Create and show loading spinner in media container
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'modalLoading';
  loadingDiv.className = 'modal-loading';
  loadingDiv.innerHTML = `
    <div class="loading-spinner">🚀</div>
    <p>Loading space content...</p>
  `;
  
  // Remove any existing loading div
  const existingLoading = document.getElementById('modalLoading');
  if (existingLoading) {
    existingLoading.remove();
  }
  
  // Add loading div to media container
  const mediaContainer = document.querySelector('.modal-media-container');
  mediaContainer.appendChild(loadingDiv);
}

// Function to load image content
function loadImageContent(item) {
  // Create a new image to preload
  const newImage = new Image();
  
  // When image loads successfully
  newImage.onload = () => {
    // Remove loading state
    const loadingDiv = document.getElementById('modalLoading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
    
    // Set the image source and show it
    modalImage.src = item.hdurl || item.url;
    modalImage.alt = item.title;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';
  };
  
  // If image fails to load, show error and use regular URL
  newImage.onerror = () => {
    // Try the regular URL if hdurl fails
    if (item.hdurl && item.url !== item.hdurl) {
      const fallbackImage = new Image();
      fallbackImage.onload = () => {
        const loadingDiv = document.getElementById('modalLoading');
        if (loadingDiv) {
          loadingDiv.remove();
        }
        modalImage.src = item.url;
        modalImage.alt = item.title;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
      };
      fallbackImage.src = item.url;
    } else {
      // Show error state
      const loadingDiv = document.getElementById('modalLoading');
      if (loadingDiv) {
        loadingDiv.innerHTML = `
          <div class="loading-error">❌</div>
          <p>Error loading image</p>
        `;
      }
    }
  };
  
  // Start loading the image
  newImage.src = item.hdurl || item.url;
}

// Function to load video content
function loadVideoContent(item) {
  // Remove loading state
  const loadingDiv = document.getElementById('modalLoading');
  if (loadingDiv) {
    loadingDiv.remove();
  }
  
  // Show video, hide image
  modalImage.style.display = 'none';
  modalVideo.style.display = 'block';
  
  // Extract YouTube video ID and create embed
  const videoId = extractYouTubeID(item.url);
  if (videoId) {
    modalVideo.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0" 
              allowfullscreen>
      </iframe>
    `;
  } else {
    // Fallback for non-YouTube videos
    modalVideo.innerHTML = `
      <p>Video: <a href="${item.url}" target="_blank">Click here to watch</a></p>
    `;
  }
}

// Function to hide the modal
function hideModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore background scrolling
}

// Function to extract YouTube video ID from URL
function extractYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

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
    
    // Make image clickable to open modal
    mediaElement.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      showModal(item);
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
    
    // Make video thumbnail clickable to open modal
    mediaElement.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      showModal(item);
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
  
  // Make the entire card clickable to open modal
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    showModal(item);
  });
  
  return card;
}
