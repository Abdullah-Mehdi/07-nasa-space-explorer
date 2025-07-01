// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

// Function to update theme icon
function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    themeIcon.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.getElementById('fetchButton');
const gallery = document.getElementById('gallery');

// Space facts elements
const spaceFactElement = document.getElementById('spaceFact');
const newFactButton = document.getElementById('newFactButton');

// Array of fun space facts
const spaceFacts = [
  "One day on Venus is longer than one year on Venus! It takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
  "There are more possible games of chess than there are atoms in the observable universe.",
  "A neutron star is so dense that a teaspoon of its material would weigh about 6 billion tons on Earth.",
  "The footprints left by Apollo astronauts on the Moon will last for millions of years because there's no wind to blow them away.",
  "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth.",
  "If you could drive a car to the Sun at 60 mph, it would take you over 100 years to get there.",
  "Saturn's moon Titan has lakes and rivers made of liquid methane and ethane instead of water.",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but don't worry - it won't happen for 4.5 billion years!",
  "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
  "The International Space Station travels at 17,500 mph and orbits Earth every 90 minutes.",
  "Mars has the largest volcano in the solar system - Olympus Mons is about 13.6 miles high, nearly three times taller than Mount Everest.",
  "There are more stars in the universe than grains of sand on all the beaches on Earth.",
  "The Sun is so massive that it accounts for 99.86% of the total mass of our solar system.",
  "Mercury has no atmosphere, so temperatures can range from 800°F during the day to -300°F at night.",
  "A year on Pluto lasts 248 Earth years, so if you were born on Pluto, you'd have to wait almost 250 years for your first birthday!",
  "The universe is expanding so fast that galaxies are moving away from us faster than the speed of light.",
  "Black holes don't actually suck things in - they warp space-time so severely that nothing can escape once it crosses the event horizon.",
  "The coldest place in the universe isn't in space - it's in laboratories on Earth where scientists have reached temperatures near absolute zero.",
  "Betelgeuse, one of the brightest stars in the night sky, could explode as a supernova at any time in the next 100,000 years.",
  "The Hubble Space Telescope has traveled more than 4 billion miles in its orbit around Earth - that's like traveling to Neptune and back!",
  "Europa, one of Jupiter's moons, has twice as much water as all of Earth's oceans combined, hidden beneath its icy surface.",
  "A day on Mercury lasts 59 Earth days, but a year on Mercury is only 88 Earth days long.",
  "The Voyager 1 spacecraft, launched in 1977, is now over 14 billion miles from Earth and still sending data back to NASA.",
  "If Earth were the size of a marble, the Sun would be the size of a basketball located about 26 yards away.",
  "Astronauts can grow up to 2 inches taller in space because the lack of gravity allows their spine to stretch out."
];

// Modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.querySelector('.close');
const modalShareButton = document.getElementById('modalShareButton');
const modalDownloadButton = document.getElementById('modalDownloadButton');

// Variable to store current modal item for sharing and downloading
let currentModalItem = null;

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Initialize space facts when page loads
displayRandomSpaceFact();

// Run initial validation to ensure proper button state
setTimeout(() => {
  validateDateSelection();
}, 100);

// Add event listener to the fetch button
fetchButton.addEventListener('click', fetchNASAImages);

// Add event listener to the new fact button
newFactButton.addEventListener('click', displayRandomSpaceFact);

// Add validation listeners to date inputs
startInput.addEventListener('change', validateDateSelection);
endInput.addEventListener('change', validateDateSelection);

// Function to validate date selection and provide user feedback
function validateDateSelection() {
  const startDate = new Date(startInput.value);
  const endDate = new Date(endInput.value);
  const today = new Date();
  const earliestDate = new Date('1995-06-16');
  
  let isValid = true;
  let errorMessage = '';
  
  // Check if start date is in the future
  if (startDate > today) {
    isValid = false;
    errorMessage = 'Start date cannot be in the future. Please select a date up to today.';
    startInput.style.borderColor = '#ff4444';
  } else {
    startInput.style.borderColor = '#ddd';
  }
  
  // Check if end date is in the future
  if (endDate > today) {
    isValid = false;
    errorMessage = 'End date cannot be in the future. Please select a date up to today.';
    endInput.style.borderColor = '#ff4444';
  } else {
    endInput.style.borderColor = '#ddd';
  }
  
  // Check if dates are before NASA's first image
  if (startDate < earliestDate) {
    isValid = false;
    errorMessage = 'Start date cannot be before June 16, 1995 (NASA\'s first APOD image).';
    startInput.style.borderColor = '#ff4444';
  }
  
  if (endDate < earliestDate) {
    isValid = false;
    errorMessage = 'End date cannot be before June 16, 1995 (NASA\'s first APOD image).';
    endInput.style.borderColor = '#ff4444';
  }
  
  // Check if start date is after end date
  if (startDate > endDate) {
    isValid = false;
    errorMessage = 'Start date cannot be after end date.';
    startInput.style.borderColor = '#ff4444';
    endInput.style.borderColor = '#ff4444';
  }
  
  // Show or hide error message
  showValidationMessage(errorMessage, !isValid);
  
  // Enable/disable fetch button based on validation
  fetchButton.disabled = !isValid;
  fetchButton.style.opacity = isValid ? '1' : '0.5';
  fetchButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
}

// Function to show validation messages to the user
function showValidationMessage(message, isError) {
  // Remove existing validation message
  const existingMessage = document.getElementById('validationMessage');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Add new validation message if there's a message
  if (message) {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'validationMessage';
    messageDiv.className = `validation-message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    
    // Insert after the filters div
    const filtersDiv = document.querySelector('.filters');
    filtersDiv.parentNode.insertBefore(messageDiv, filtersDiv.nextSibling);
  }
}

// Function to display a random space fact
function displayRandomSpaceFact() {
  // Show loading state briefly for smooth transition
  spaceFactElement.style.opacity = '0.5';
  spaceFactElement.textContent = 'Loading an amazing space fact...';
  
  // After a brief delay, show the new fact
  setTimeout(() => {
    // Get a random fact from the array
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    const randomFact = spaceFacts[randomIndex];
    
    // Display the fact with a smooth transition
    spaceFactElement.textContent = randomFact;
    spaceFactElement.style.opacity = '1';
  }, 300);
}

// Modal event listeners
closeModal.addEventListener('click', hideModal);

// Modal share button event listener
modalShareButton.addEventListener('click', () => {
  if (currentModalItem) {
    shareAPOD(currentModalItem);
  }
});

// Modal download button event listener
modalDownloadButton.addEventListener('click', (e) => {
  if (currentModalItem && currentModalItem.media_type === 'image') {
    // Store the button reference in the event for the download function
    window.event = e;
    downloadImage(currentModalItem);
  }
});

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
  // Store current item for sharing and downloading
  currentModalItem = item;
  
  // Show the modal immediately with loading state
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  // Show/hide download button based on media type
  if (item.media_type === 'image') {
    modalDownloadButton.style.display = 'flex';
    modalDownloadButton.disabled = false;
  } else {
    modalDownloadButton.style.display = 'none';
  }
  
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
  currentModalItem = null; // Clear current item
}

// Function to share an APOD item
function shareAPOD(item) {
  // Create a shareable URL
  const shareUrl = `https://apod.nasa.gov/apod/ap${item.date.replace(/-/g, '').substring(2)}.html`;
  
  // Create share data
  const shareData = {
    title: `NASA APOD: ${item.title}`,
    text: `Check out this amazing space ${item.media_type === 'video' ? 'video' : 'image'} from NASA! "${item.title}" - ${item.date}`,
    url: shareUrl
  };
  
  // Try to use native Web Share API if available
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData)
      .then(() => {
        showShareFeedback('Shared successfully! 🚀');
      })
      .catch((error) => {
        console.log('Share cancelled or failed:', error);
        // Fallback to copy link
        copyToClipboard(shareUrl, item);
      });
  } else {
    // Fallback: Copy link to clipboard
    copyToClipboard(shareUrl, item);
  }
}

// Function to copy link to clipboard as fallback
function copyToClipboard(url, item) {
  // Try to use modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => {
        showShareFeedback('Link copied to clipboard! 📋');
      })
      .catch(() => {
        // Final fallback: show the URL
        showShareFeedback(`Share this link: ${url}`, true);
      });
  } else {
    // Legacy fallback: create a temporary input to copy
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
      document.execCommand('copy');
      showShareFeedback('Link copied to clipboard! 📋');
    } catch (err) {
      showShareFeedback(`Share this link: ${url}`, true);
    }
    
    document.body.removeChild(tempInput);
  }
}

// Function to show share feedback to user
function showShareFeedback(message, isLongMessage = false) {
  // Remove existing share feedback
  const existingFeedback = document.getElementById('shareFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.id = 'shareFeedback';
  feedback.className = 'share-feedback';
  feedback.textContent = message;
  
  // Position it appropriately
  if (modal.style.display === 'block') {
    // If modal is open, position relative to modal
    modal.appendChild(feedback);
    feedback.style.position = 'absolute';
    feedback.style.top = '20px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '1002';
  } else {
    // If in gallery view, position at top of page
    document.body.appendChild(feedback);
    feedback.style.position = 'fixed';
    feedback.style.top = '20px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '1000';
  }
  
  // Auto-remove feedback after delay
  const delay = isLongMessage ? 8000 : 3000;
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, delay);
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
    showValidationMessage('Please select both start and end dates', true);
    return;
  }
  
  // Validate dates one more time before fetching
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const today = new Date();
  
  if (startDateObj > today || endDateObj > today) {
    showValidationMessage('Cannot fetch images for future dates. Please select dates up to today.', true);
    return;
  }
  
  // Calculate number of days in range
  const daysDifference = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
  
  // Show confirmation for large date ranges
  if (daysDifference > 30) {
    const confirm = window.confirm(
      `You've selected ${daysDifference} days of images. This might take a while to load. Do you want to continue?`
    );
    if (!confirm) {
      return;
    }
  }
  
  // Clear any existing validation messages
  showValidationMessage('', false);
  
  // Show success message for valid selection
  showValidationMessage(
    `Loading ${daysDifference} day${daysDifference > 1 ? 's' : ''} of space images from ${startDate} to ${endDate}...`, 
    false
  );
  
  // Show loading message in gallery
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading amazing space images...</p>
      <p style="font-size: 14px; color: #888;">Fetching ${daysDifference} day${daysDifference > 1 ? 's' : ''} of content...</p>
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
    
    // Clear validation message after successful fetch
    setTimeout(() => {
      showValidationMessage('', false);
    }, 2000);
    
    // Display the images in the gallery
    displayImages(data);
    
  } catch (error) {
    // Show error message if something goes wrong
    console.error('Error fetching NASA images:', error);
    showValidationMessage('Sorry, there was an error loading the images. Please try again.', true);
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
    
    // Add mouse tilt effect for images
    addTiltEffect(card, mediaElement);
    
  } else if (item.media_type === 'video') {
    // Create a clickable div for videos (since they're usually YouTube embeds)
    mediaElement = document.createElement('div');
    mediaElement.className = 'video-thumbnail';
    
    // Extract YouTube video ID to get thumbnail
    const videoId = extractYouTubeID(item.url);
    let thumbnailUrl = '';
    
    if (videoId) {
      // Use YouTube thumbnail as background
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    // Set background image if we have a thumbnail
    if (thumbnailUrl) {
      mediaElement.style.backgroundImage = `url(${thumbnailUrl})`;
      mediaElement.style.backgroundSize = 'cover';
      mediaElement.style.backgroundPosition = 'center';
      mediaElement.style.position = 'relative';
    }
    
    mediaElement.innerHTML = `
      <div class="video-overlay">
        <div class="video-play-icon">▶️</div>
        <p>Click to watch video</p>
      </div>
    `;
    
    // Make video thumbnail clickable to open modal
    mediaElement.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      showModal(item);
    });
    mediaElement.style.cursor = 'pointer';
    
    // Add mouse tilt effect for videos
    addTiltEffect(card, mediaElement);
  }
  
  // Create share button for the card
  const shareButton = document.createElement('button');
  shareButton.className = 'card-share-btn';
  shareButton.innerHTML = '🔗';
  shareButton.title = 'Share this space image';
  shareButton.setAttribute('aria-label', 'Share this image');
  
  // Add share functionality
  shareButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card click event
    shareAPOD(item);
  });

  // Create download button for the card (only for images)
  let downloadButton = null;
  if (item.media_type === 'image') {
    downloadButton = document.createElement('button');
    downloadButton.className = 'card-download-btn';
    downloadButton.innerHTML = '💾';
    downloadButton.title = 'Download high-resolution image';
    downloadButton.setAttribute('aria-label', 'Download this image');
    
    // Add download functionality
    downloadButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      // Store the button reference in the event for the download function
      window.event = e;
      downloadImage(item);
    });
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
  card.appendChild(shareButton);
  if (downloadButton) {
    card.appendChild(downloadButton);
  }
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

// Function to add mouse tilt effect to gallery items
function addTiltEffect(card, mediaElement) {
  // Mouse move handler for tilt effect
  card.addEventListener('mousemove', (e) => {
    // Get the card's position and dimensions
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    // Calculate the distance from center (normalized to -1 to 1)
    const mouseX = (e.clientX - cardCenterX) / (rect.width / 2);
    const mouseY = (e.clientY - cardCenterY) / (rect.height / 2);
    
    // Calculate tilt angles (max 15 degrees)
    const tiltX = mouseY * -10; // Negative for natural tilt direction
    const tiltY = mouseX * 10;
    
    // Apply the transform with scale and tilt
    const scale = 1.05;
    mediaElement.style.transform = `scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  
  // Mouse enter handler - start the effect
  card.addEventListener('mouseenter', () => {
    mediaElement.style.transition = 'transform 0.1s ease';
  });
  
  // Mouse leave handler - reset to normal
  card.addEventListener('mouseleave', () => {
    mediaElement.style.transition = 'transform 0.3s ease';
    mediaElement.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
  });
}

// Function to download high-resolution image
async function downloadImage(item) {
  let downloadBtn = null;
  let originalText = '';
  
  try {
    // Find the download button that was clicked
    downloadBtn = event.target;
    originalText = downloadBtn.innerHTML;
    
    // Show loading state on download button
    downloadBtn.innerHTML = '⏳ Downloading...';
    downloadBtn.disabled = true;
    
    // Use hdurl if available, otherwise use regular url
    const imageUrl = item.hdurl || item.url;
    
    // Try to download using direct link approach first (works for same-origin or CORS-enabled images)
    try {
      const response = await fetch(imageUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Get the image as blob
      const blob = await response.blob();
      
      // Create download filename
      const date = item.date;
      const title = item.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
      const extension = imageUrl.toLowerCase().includes('.jpg') || imageUrl.toLowerCase().includes('.jpeg') ? '.jpg' : '.png';
      const filename = `NASA_APOD_${date}_${title}${extension}`;
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      // Show success feedback
      showDownloadFeedback('Image downloaded successfully! 📁');
      
    } catch (fetchError) {
      // Fallback: Open image in new tab for manual save
      console.log('Direct download failed, using fallback method:', fetchError);
      
      // Create download filename for display
      const date = item.date;
      const title = item.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
      
      // Open the high-resolution image in a new tab
      const newWindow = window.open(imageUrl, '_blank');
      if (newWindow) {
        // Show instruction feedback
        showDownloadFeedback(`Opening high-res image in new tab. Right-click and "Save As..." to download. 💾`, false);
      } else {
        // If popup blocked, copy URL to clipboard
        try {
          await navigator.clipboard.writeText(imageUrl);
          showDownloadFeedback(`Popup blocked. High-res image URL copied to clipboard! Paste in new tab to download. 📋`, false);
        } catch (clipboardError) {
          showDownloadFeedback(`Download failed. Try right-clicking the image and selecting "Save As..." ❌`, true);
        }
      }
    }
    
  } catch (error) {
    console.error('Download failed:', error);
    showDownloadFeedback('Download failed. Please try again. ❌', true);
  } finally {
    // Restore button state
    if (downloadBtn && originalText) {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }
  }
}

// Function to show download feedback to user
function showDownloadFeedback(message, isError = false) {
  // Remove existing download feedback
  const existingFeedback = document.getElementById('downloadFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.id = 'downloadFeedback';
  feedback.className = isError ? 'download-feedback download-error' : 'download-feedback';
  feedback.textContent = message;
  
  // Position it appropriately
  if (modal.style.display === 'block') {
    // If modal is open, position relative to modal
    modal.appendChild(feedback);
    feedback.style.position = 'absolute';
    feedback.style.top = '70px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '1002';
  } else {
    // If in gallery view, position at top of page
    document.body.appendChild(feedback);
    feedback.style.position = 'fixed';
    feedback.style.top = '70px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '1000';
  }
  
  // Auto-remove feedback after delay (longer for informational messages)
  const delay = message.length > 50 ? 6000 : 3000;
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, delay);
}

// Function to extract YouTube video ID from URL
