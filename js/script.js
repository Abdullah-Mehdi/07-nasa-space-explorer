// ===========================
// NASA SPACE EXPLORER - MAIN SCRIPT
// ===========================
// This script manages the NASA APOD (Astronomy Picture of the Day) Explorer application.
// Features include: API key management, dynamic date range selection, image/video gallery,
// modal viewing, sharing, downloading, space facts, and light/dark mode themes.

// ===========================
// API KEY MANAGEMENT SYSTEM
// ===========================
// Handles secure storage and management of NASA API keys in localStorage
// Supports both user-provided keys and a demo key with rate limiting

// DOM elements for API key setup interface
const apiKeySection = document.getElementById('apiKeySection');
const dateFilters = document.getElementById('dateFilters');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyButton = document.getElementById('saveApiKeyButton');
const changeApiKeyButton = document.getElementById('changeApiKeyButton');
const useDemoKeyButton = document.getElementById('useDemoKeyButton');

// Initialize API key management on page load
initializeAPIKeySetup();

/**
 * Initialize the API key setup interface and check for existing stored keys
 * Sets up event listeners for API key management interactions
 */
function initializeAPIKeySetup() {
  // Check if user already has an API key stored in localStorage
  if (hasUserAPIKey()) {
    showDateFilters();
  } else {
    showAPIKeySetup();
  }
  
  // Set up event listeners for API key management buttons
  saveApiKeyButton.addEventListener('click', handleSaveAPIKey);
  changeApiKeyButton.addEventListener('click', showAPIKeySetup);
  useDemoKeyButton.addEventListener('click', handleUseDemoKey);
  
  // Allow Enter key to save API key for better UX
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSaveAPIKey();
    }
  });
}

/**
 * Handle demo key selection with clear rate limit warning
 * Demo keys are limited to 30 requests per hour by NASA
 */
function handleUseDemoKey() {
  saveNASAAPIKey('DEMO_KEY');
  showAPIKeyFeedback('Using demo key! Limited to 30 requests per hour. ⚠️', false);
  setTimeout(() => {
    showDateFilters();
  }, 2000);
}

/**
 * Handle user API key input with validation
 * Validates key format and saves to localStorage
 */
function handleSaveAPIKey() {
  const apiKey = apiKeyInput.value.trim();
  
  if (!apiKey) {
    showAPIKeyFeedback('Please enter your NASA API key.', true);
    return;
  }
  
  // Basic validation - NASA API keys are typically 40 characters
  if (apiKey.length < 20) {
    showAPIKeyFeedback('API key seems too short. Please check and try again.', true);
    return;
  }
  
  // Save the API key to localStorage using config.js functions
  if (saveNASAAPIKey(apiKey)) {
    showAPIKeyFeedback('API key saved successfully! 🚀', false);
    setTimeout(() => {
      showDateFilters();
    }, 1500);
  } else {
    showAPIKeyFeedback('Failed to save API key. Please try again.', true);
  }
}

/**
 * Show the API key setup interface and hide date selection
 */
function showAPIKeySetup() {
  apiKeySection.style.display = 'block';
  dateFilters.style.display = 'none';
  apiKeyInput.value = '';
  apiKeyInput.focus();
}

/**
 * Show the date selection interface and hide API key setup
 */
function showDateFilters() {
  apiKeySection.style.display = 'none';
  dateFilters.style.display = 'flex';
}

/**
 * Display feedback messages for API key operations with auto-removal
 * @param {string} message - The message to display to the user
 * @param {boolean} isError - Whether this is an error message (affects styling)
 */
function showAPIKeyFeedback(message, isError) {
  // Remove any existing feedback to avoid duplicates
  const existingFeedback = document.getElementById('apiKeyFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create new feedback element with appropriate styling
  const feedback = document.createElement('div');
  feedback.id = 'apiKeyFeedback';
  feedback.className = isError ? 'api-feedback api-error' : 'api-feedback api-success';
  feedback.textContent = message;
  
  // Insert feedback after the input group for optimal positioning
  const inputGroup = document.querySelector('.api-key-input-group');
  inputGroup.parentNode.insertBefore(feedback, inputGroup.nextSibling);
  
  // Auto-remove feedback after 3 seconds to keep UI clean
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, 3000);
}

// ===========================
// THEME TOGGLE SYSTEM
// ===========================
// Manages light/dark mode switching with persistence in localStorage
// Follows NASA brand guidelines with accessible color schemes

// DOM elements for theme switching
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Initialize theme based on saved preference or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Set up theme toggle event listener for interactive theme switching
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Apply new theme and save preference for persistence
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

/**
 * Update the theme toggle icon and accessibility label based on current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    themeIcon.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// ===========================
// MAIN APPLICATION DOM ELEMENTS
// ===========================
// Core DOM elements used throughout the application

// Date picker and control elements for image selection
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.getElementById('fetchButton');
const gallery = document.getElementById('gallery');

// Space facts feature elements for educational content
const spaceFactElement = document.getElementById('spaceFact');
const newFactButton = document.getElementById('newFactButton');

// ===========================
// DYNAMIC DATE RANGE CONTROLS
// ===========================
// New feature: Allow users to select custom date ranges with smart defaults

// Create and insert dynamic date range controls
const dateRangeControls = createDateRangeControls();
const dateFiltersContainer = document.getElementById('dateFilters');
dateFiltersContainer.insertBefore(dateRangeControls, dateFiltersContainer.firstChild);

/**
 * Create dynamic date range control elements
 * Allows users to quickly select common date ranges (7 days, 30 days, etc.)
 */
function createDateRangeControls() {
  const container = document.createElement('div');
  container.className = 'date-range-controls';
  
  const label = document.createElement('label');
  label.textContent = 'Quick Select: ';
  label.className = 'date-range-label';
  
  // Create dropdown for quick date range selection
  const select = document.createElement('select');
  select.id = 'dateRangeSelect';
  select.className = 'date-range-select';
  
  // Define available date range options with API limit considerations
  // Note: Removed 3 months and 1 year options to prevent API failures
  const options = [
    { value: 'custom', text: 'Custom Range', days: null },
    { value: '1', text: 'Today Only', days: 1 },
    { value: '3', text: 'Last 3 Days', days: 3 },
    { value: '7', text: 'Last Week (7 days)', days: 7 },
    { value: '14', text: 'Last 2 Weeks', days: 14 },
    { value: '30', text: 'Last Month (30 days)', days: 30 }
  ];
  
  // Create option elements for each date range
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    optionElement.dataset.days = option.days;
    select.appendChild(optionElement);
  });
  
  // Set default to 7 days (matching original behavior)
  select.value = '7';
  
  // Add event listener for date range selection
  select.addEventListener('change', handleDateRangeSelection);
  
  // Create custom range input for advanced users
  const customRangeContainer = document.createElement('div');
  customRangeContainer.className = 'custom-range-container';
  customRangeContainer.style.display = 'none';
  
  const customLabel = document.createElement('label');
  customLabel.textContent = 'Days: ';
  customLabel.className = 'custom-range-label';
  
  const customInput = document.createElement('input');
  customInput.type = 'number';
  customInput.id = 'customDaysInput';
  customInput.className = 'custom-days-input';
  customInput.min = '1';
  customInput.max = '365';
  customInput.value = '30';
  customInput.placeholder = 'Enter days';
  
  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'Apply';
  applyButton.className = 'apply-custom-btn';
  applyButton.addEventListener('click', applyCustomRange);
  
  customRangeContainer.appendChild(customLabel);
  customRangeContainer.appendChild(customInput);
  customRangeContainer.appendChild(applyButton);
  
  // Add warning indicator for large requests
  const warningIndicator = document.createElement('div');
  warningIndicator.id = 'rangeWarning';
  warningIndicator.className = 'range-warning';
  warningIndicator.style.display = 'none';
  
  // Assemble the control container
  container.appendChild(label);
  container.appendChild(select);
  container.appendChild(customRangeContainer);
  container.appendChild(warningIndicator);
  
  return container;
}

/**
 * Handle date range selection from dropdown
 * Updates date inputs and provides warnings for large requests
 */
function handleDateRangeSelection() {
  const select = document.getElementById('dateRangeSelect');
  const customContainer = document.querySelector('.custom-range-container');
  const warningIndicator = document.getElementById('rangeWarning');
  
  if (select.value === 'custom') {
    // Show custom input controls
    customContainer.style.display = 'flex';
    warningIndicator.style.display = 'none';
    return;
  }
  
  // Hide custom controls and apply selected range
  customContainer.style.display = 'none';
  
  const days = parseInt(select.value);
  applyDateRange(days);
}

/**
 * Apply custom date range from manual input
 */
function applyCustomRange() {
  const customInput = document.getElementById('customDaysInput');
  const days = parseInt(customInput.value);
  
  if (!days || days < 1 || days > 365) {
    showValidationMessage('Please enter a valid number of days (1-365)', true);
    return;
  }
  
  applyDateRange(days);
}

/**
 * Apply a date range by calculating dates and updating inputs
 * @param {number} days - Number of days to go back from today
 */
function applyDateRange(days) {
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(today);
  
  // Calculate start date by going back the specified number of days
  startDate.setDate(today.getDate() - (days - 1));
  
  // Ensure we don't go before NASA's first APOD (June 16, 1995)
  const earliestDate = new Date(NASA_EARLIEST_DATE);
  if (startDate < earliestDate) {
    startDate.setTime(earliestDate.getTime());
  }
  
  // Update date inputs with calculated values
  startInput.value = startDate.toISOString().split('T')[0];
  endInput.value = endDate.toISOString().split('T')[0];
  
  // Show warnings for large requests, especially with demo key
  showRangeWarnings(days);
  
  // Trigger validation to update UI state
  validateDateSelection();
}

/**
 * Show appropriate warnings based on selected date range and API key type
 * @param {number} days - Number of days selected
 */
function showRangeWarnings(days) {
  const warningIndicator = document.getElementById('rangeWarning');
  const currentApiKey = getNASAAPIKey();
  const isDemoKey = (currentApiKey === 'DEMO_KEY');
  
  let warningMessage = '';
  let showWarning = false;
  
  if (isDemoKey && days > 25) {
    warningMessage = '⚠️ Demo key limit exceeded! Max 25 days. Get free API key at api.nasa.gov';
    showWarning = true;
  } else if (isDemoKey && days > 10) {
    warningMessage = '⚠️ Large request with demo key may hit 30/hour rate limit';
    showWarning = true;
  } else if (days > 100) {
    warningMessage = '⚠️ Large request may take longer to load';
    showWarning = true;
  }
  
  if (showWarning) {
    warningIndicator.textContent = warningMessage;
    warningIndicator.style.display = 'block';
  } else {
    warningIndicator.style.display = 'none';
  }
}

// ===========================
// SPACE FACTS DATA COLLECTION
// ===========================
// Educational content to engage users while browsing NASA images
// Facts are scientifically accurate and designed to inspire curiosity

// Collection of fascinating space facts for user education and engagement
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

// ===========================
// MODAL SYSTEM COMPONENTS
// ===========================
// Handles detailed viewing of images and videos in an overlay modal
// Supports both NASA images and embedded YouTube videos

// Modal interface elements for detailed image/video viewing
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.querySelector('.close');
const modalShareButton = document.getElementById('modalShareButton');
const modalDownloadButton = document.getElementById('modalDownloadButton');

// Store current modal item for sharing and downloading operations
let currentModalItem = null;

// ===========================
// APPLICATION INITIALIZATION
// ===========================
// Set up initial state and default values for the application

// NASA APOD service constants
const NASA_EARLIEST_DATE = '1995-06-16'; // NASA's first APOD image date
const TODAY_DATE = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

// Set up date input constraints and default values
setupDateInputConstraints();

// Display initial space fact on page load to engage users immediately
displayRandomSpaceFact();

// Apply initial date range (7 days default)
setTimeout(() => {
  applyDateRange(7);
}, 100);

/**
 * Set up date input constraints (min/max dates) and accessibility
 * Restricts date selection to NASA APOD availability period
 */
function setupDateInputConstraints() {
  // Set minimum and maximum dates for both inputs
  startInput.min = NASA_EARLIEST_DATE;
  startInput.max = TODAY_DATE;
  endInput.min = NASA_EARLIEST_DATE;
  endInput.max = TODAY_DATE;
  
  // Add accessible labels for screen readers
  startInput.setAttribute('aria-label', 'Select start date for NASA image range');
  endInput.setAttribute('aria-label', 'Select end date for NASA image range');
}

// ===========================
// EVENT LISTENERS SETUP
// ===========================
// Bind all interactive elements to their respective handler functions

// Main functionality event listeners for core features
fetchButton.addEventListener('click', fetchNASAImages);
newFactButton.addEventListener('click', displayRandomSpaceFact);

// Date validation event listeners for real-time feedback
startInput.addEventListener('change', validateDateSelection);
endInput.addEventListener('change', validateDateSelection);

// ===========================
// DATE VALIDATION AND FEEDBACK SYSTEM
// ===========================
// Comprehensive validation with user-friendly error messages and warnings
// Handles API limits, date constraints, and provides educational feedback

/**
 * Validate user's date selection and provide comprehensive real-time feedback
 * Checks for valid date ranges, API limits, and provides helpful warnings
 */
function validateDateSelection() {
  const startDate = new Date(startInput.value);
  const endDate = new Date(endInput.value);
  const today = new Date();
  const earliestDate = new Date(NASA_EARLIEST_DATE); // Use the constant from initialization
  
  let isValid = true;
  let errorMessage = '';
  
  // Calculate date range for API limit checking and user feedback
  const daysDifference = startDate && endDate ? 
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 0;
  
  // Check basic date validity first (both dates must be selected)
  if (!startInput.value || !endInput.value) {
    fetchButton.disabled = true;
    fetchButton.style.opacity = '0.5';
    fetchButton.style.cursor = 'not-allowed';
    return;
  }
  
  // Validate start date constraints (cannot be in the future)
  if (startDate > today) {
    isValid = false;
    errorMessage = 'Start date cannot be in the future. Please select a date up to today.';
    startInput.style.borderColor = '#ff4444';
  } else {
    startInput.style.borderColor = 'var(--border-color)';
  }
  
  // Validate end date constraints (cannot be in the future)
  if (endDate > today) {
    isValid = false;
    errorMessage = 'End date cannot be in the future. Please select a date up to today.';
    endInput.style.borderColor = '#ff4444';
  } else {
    endInput.style.borderColor = 'var(--border-color)';
  }
  
  // Check NASA APOD availability date range (service started June 16, 1995)
  if (startDate < earliestDate) {
    isValid = false;
    errorMessage = `Start date cannot be before ${NASA_EARLIEST_DATE} (NASA's first APOD image).`;
    startInput.style.borderColor = '#ff4444';
  }
  
  if (endDate < earliestDate) {
    isValid = false;
    errorMessage = `End date cannot be before ${NASA_EARLIEST_DATE} (NASA's first APOD image).`;
    endInput.style.borderColor = '#ff4444';
  }
  
  // Validate date order (start must be before or equal to end)
  if (startDate > endDate) {
    isValid = false;
    errorMessage = 'Start date cannot be after end date.';
    startInput.style.borderColor = '#ff4444';
    endInput.style.borderColor = '#ff4444';
  }
  
  // API limit validation and educational warnings
  if (isValid && daysDifference > 0) {
    const currentApiKey = getNASAAPIKey();
    const isDemoKey = (currentApiKey === 'DEMO_KEY');
    
    // Check API limits based on key type with helpful messaging
    if (isDemoKey && daysDifference > 25) {
      isValid = false;
      errorMessage = `Demo key limit: Maximum 25 days per request (you selected ${daysDifference} days). Get your free API key at api.nasa.gov for unlimited access!`;
    } else if (daysDifference > 365) {
      isValid = false;
      errorMessage = `Maximum 365 days per request (you selected ${daysDifference} days). Please select a smaller date range.`;
    } else if (isDemoKey && daysDifference > 10) {
      // Warning for demo key users with potentially large requests
      errorMessage = `⚠️ Demo key: ${daysDifference} days selected. This may hit the 30 requests/hour limit. Consider getting your free API key!`;
      isValid = true; // Allow but warn
    } else if (daysDifference > 100) {
      // Warning for very large requests even with personal keys
      errorMessage = `⚠️ Large request: ${daysDifference} days selected. This may take a while to load.`;
      isValid = true; // Allow but warn
    }
  }
  
  // Show or hide validation message based on current state
  showValidationMessage(errorMessage, !isValid);
  
  // Enable/disable fetch button based on validation results
  fetchButton.disabled = !isValid;
  fetchButton.style.opacity = isValid ? '1' : '0.5';
  fetchButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
}

/**
 * Display validation messages to the user with appropriate styling
 * @param {string} message - The message to display (empty string removes message)
 * @param {boolean} isError - Whether this is an error message or informational
 */
function showValidationMessage(message, isError) {
  // Remove existing validation message to prevent duplicates
  const existingMessage = document.getElementById('validationMessage');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Add new validation message if there's content to show
  if (message) {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'validationMessage';
    messageDiv.className = `validation-message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    
    // Insert after the date filters for optimal visibility
    const filtersDiv = document.querySelector('.date-filters');
    filtersDiv.parentNode.insertBefore(messageDiv, filtersDiv.nextSibling);
  }
}

/**
 * Display a random space fact with smooth transition animation
 * Provides educational content while users browse the application
 */
function displayRandomSpaceFact() {
  // Show loading state briefly for smooth user experience
  spaceFactElement.style.opacity = '0.5';
  spaceFactElement.textContent = 'Loading an amazing space fact...';
  
  // After a brief delay, show the new fact with animation
  setTimeout(() => {
    // Get a random fact from the curated collection
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    const randomFact = spaceFacts[randomIndex];
    
    // Display the fact with a smooth transition effect
    spaceFactElement.textContent = randomFact;
    spaceFactElement.style.opacity = '1';
  }, 300);
}

// ===========================
// MODAL EVENT LISTENERS AND HANDLERS
// ===========================
// Handle all modal interactions including display, sharing, downloading, and closing

// Modal close button event listener
closeModal.addEventListener('click', hideModal);

// Modal share button event listener with current item context
modalShareButton.addEventListener('click', () => {
  if (currentModalItem) {
    shareAPOD(currentModalItem);
  }
});

// Modal download button event listener for high-resolution images
modalDownloadButton.addEventListener('click', (e) => {
  if (currentModalItem && currentModalItem.media_type === 'image') {
    // Store the button reference in the event for the download function
    window.event = e;
    downloadImage(currentModalItem);
  }
});

// Close modal when clicking outside of it (backdrop click)
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

// Close modal with escape key for accessibility
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    hideModal();
  }
});

/**
 * Show the modal with comprehensive loading states and media handling
 * @param {Object} item - NASA APOD data object containing image/video information
 */
function showModal(item) {
  // Store current item for sharing and downloading functionality
  currentModalItem = item;
  
  // Show the modal immediately with loading state for responsive UX
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  // Show/hide download button based on media type (only available for images)
  if (item.media_type === 'image') {
    modalDownloadButton.style.display = 'flex';
    modalDownloadButton.disabled = false;
  } else {
    modalDownloadButton.style.display = 'none';
  }
  
  // Show loading state first for better perceived performance
  showLoadingState();
  
  // Small delay to ensure loading state is visible and smooth
  setTimeout(() => {
    // Set the title and date information
    modalTitle.textContent = item.title;
    modalDate.textContent = `Date: ${item.date}`;
    modalExplanation.textContent = item.explanation;
    
    // Handle media display based on type (image or video)
    if (item.media_type === 'image') {
      loadImageContent(item);
    } else if (item.media_type === 'video') {
      loadVideoContent(item);
    }
  }, 100); // Short delay to show loading state
}

/**
 * Show loading state in modal with animated spinner
 * Provides visual feedback while content loads
 */
function showLoadingState() {
  // Hide both media containers during loading
  modalImage.style.display = 'none';
  modalVideo.style.display = 'none';
  
  // Show loading message with friendly content
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
  
  // Remove any existing loading div to prevent duplicates
  const existingLoading = document.getElementById('modalLoading');
  if (existingLoading) {
    existingLoading.remove();
  }
  
  // Add loading div to media container for proper positioning
  const mediaContainer = document.querySelector('.modal-media-container');
  mediaContainer.appendChild(loadingDiv);
}

/**
 * Load image content with fallback handling for failed loads
 * @param {Object} item - NASA APOD item with image URLs and metadata
 */
function loadImageContent(item) {
  // Create a new image to preload and check for errors
  const newImage = new Image();
  
  // When image loads successfully, display it in the modal
  newImage.onload = () => {
    // Remove loading state since image is ready
    const loadingDiv = document.getElementById('modalLoading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
    
    // Set the image source (prefer high-resolution URL if available)
    modalImage.src = item.hdurl || item.url;
    modalImage.alt = item.title;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';
  };
  
  // If image fails to load, try fallback or show error
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
      // Show error state if all image sources fail
      const loadingDiv = document.getElementById('modalLoading');
      if (loadingDiv) {
        loadingDiv.innerHTML = `
          <div class="loading-error">❌</div>
          <p>Error loading image</p>
        `;
      }
    }
  };
  
  // Start loading the image (prefer high-resolution if available)
  newImage.src = item.hdurl || item.url;
}

/**
 * Load video content with YouTube embed support
 * @param {Object} item - NASA APOD item with video URL and metadata
 */
function loadVideoContent(item) {
  // Remove loading state since video setup is quick
  const loadingDiv = document.getElementById('modalLoading');
  if (loadingDiv) {
    loadingDiv.remove();
  }
  
  // Show video container, hide image container
  modalImage.style.display = 'none';
  modalVideo.style.display = 'block';
  
  // Extract YouTube video ID and create responsive embed
  const videoId = extractYouTubeID(item.url);
  if (videoId) {
    modalVideo.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0" 
              allowfullscreen>
      </iframe>
    `;
  } else {
    // Fallback for non-YouTube videos with external link
    modalVideo.innerHTML = `
      <p>Video: <a href="${item.url}" target="_blank">Click here to watch</a></p>
    `;
  }
}

/**
 * Hide the modal and restore normal page scrolling
 * Cleans up modal state and current item reference
 */
function hideModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore background scrolling
  currentModalItem = null; // Clear current item reference
}

// ===========================
// SHARING FUNCTIONALITY
// ===========================
// Handles sharing of NASA APOD content via Web Share API or clipboard fallback
// Creates shareable links to official NASA APOD pages

/**
 * Share an APOD item using Web Share API or clipboard fallback
 * @param {Object} item - NASA APOD item to share
 */
function shareAPOD(item) {
  // Create a shareable URL pointing to the official NASA APOD page
  const shareUrl = `https://apod.nasa.gov/apod/ap${item.date.replace(/-/g, '').substring(2)}.html`;
  
  // Create share data with descriptive text
  const shareData = {
    title: `NASA APOD: ${item.title}`,
    text: `Check out this amazing space ${item.media_type === 'video' ? 'video' : 'image'} from NASA! "${item.title}" - ${item.date}`,
    url: shareUrl
  };
  
  // Try to use native Web Share API if available (mobile devices)
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData)
      .then(() => {
        showShareFeedback('Shared successfully! 🚀');
      })
      .catch((error) => {
        console.log('Share cancelled or failed:', error);
        // Fallback to copy link if share is cancelled
        copyToClipboard(shareUrl, item);
      });
  } else {
    // Fallback: Copy link to clipboard for desktop browsers
    copyToClipboard(shareUrl, item);
  }
}

/**
 * Copy link to clipboard as fallback sharing method
 * @param {string} url - URL to copy to clipboard
 * @param {Object} item - NASA APOD item being shared
 */
function copyToClipboard(url, item) {
  // Try to use modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => {
        showShareFeedback('Link copied to clipboard! 📋');
      })
      .catch(() => {
        // Final fallback: show the URL for manual copying
        showShareFeedback(`Share this link: ${url}`, true);
      });
  } else {
    // Legacy fallback: create a temporary input to copy text
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

/**
 * Show share feedback to user with appropriate positioning
 * @param {string} message - Feedback message to display
 * @param {boolean} isLongMessage - Whether this is a long message needing more time
 */
function showShareFeedback(message, isLongMessage = false) {
  // Remove existing share feedback to prevent duplicates
  const existingFeedback = document.getElementById('shareFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element with appropriate styling
  const feedback = document.createElement('div');
  feedback.id = 'shareFeedback';
  feedback.className = 'share-feedback';
  feedback.textContent = message;
  
  // Position it appropriately based on current view
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
  
  // Auto-remove feedback after appropriate delay
  const delay = isLongMessage ? 8000 : 3000;
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, delay);
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL in any common format
 * @returns {string|null} - Video ID or null if not a valid YouTube URL
 */
function extractYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// ===========================
// NASA API INTEGRATION
// ===========================
// Handles fetching data from NASA's APOD API with comprehensive error handling
// Supports both demo keys and user-provided API keys with appropriate limits

/**
 * Fetch NASA APOD images for the selected date range with comprehensive validation
 * Handles API errors, rate limits, and provides user-friendly feedback
 */
async function fetchNASAImages() {
  // Get the selected start and end dates from form inputs
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected before proceeding
  if (!startDate || !endDate) {
    showValidationMessage('Please select both start and end dates', true);
    return;
  }
  
  // Validate dates one more time before making API request
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const today = new Date();
  
  if (startDateObj > today || endDateObj > today) {
    showValidationMessage('Cannot fetch images for future dates. Please select dates up to today.', true);
    return;
  }
  
  // Calculate number of days in range for user feedback and confirmation
  const daysDifference = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
  
  // Show confirmation for large date ranges to prevent accidental large requests
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
  
  // Show success message for valid selection with helpful information
  showValidationMessage(
    `Loading ${daysDifference} day${daysDifference > 1 ? 's' : ''} of space images from ${startDate} to ${endDate}...`, 
    false
  );
  
  // Show loading message in gallery with animated content
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading amazing space images...</p>
      <p style="font-size: 14px; color: #888;">Fetching ${daysDifference} day${daysDifference > 1 ? 's' : ''} of content...</p>
    </div>
  `;
  
  try {
    // Build the API URL with the date range and dynamic API key
    const apiKey = getNASAAPIKey();
    const apiUrl = `${NASA_API_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
    
    // Fetch data from NASA APOD API with error handling
    const response = await fetch(apiUrl);
    
    // Check if the request was successful and provide specific error messages
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Invalid API key. Please check your NASA API key and try again.');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later or use your own API key.');
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }
    
    // Parse the JSON response from NASA's API
    const data = await response.json();
    
    // Clear validation message after successful fetch
    setTimeout(() => {
      showValidationMessage('', false);
    }, 2000);
    
    // Display the images in the gallery with interactive features
    displayImages(data);
    
  } catch (error) {
    // Show error message if something goes wrong with helpful context
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

// ===========================
// GALLERY DISPLAY SYSTEM
// ===========================
// Creates interactive gallery cards with hover effects, sharing, and download features
// Handles both images and videos with appropriate UI elements

/**
 * Display the fetched images in a responsive grid format with interactive features
 * @param {Array} images - Array of NASA APOD data objects
 */
function displayImages(images) {
  // Clear the gallery to prepare for new content
  gallery.innerHTML = '';
  
  // Check if we have any images to display
  if (!images || images.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔍</div>
        <p>No images found for the selected date range.</p>
      </div>
    `;
    return;
  }
  
  // Create a card for each image/video with interactive features
  images.forEach(item => {
    const card = createImageCard(item);
    gallery.appendChild(card);
  });
}

/**
 * Create an interactive card for each NASA image or video
 * @param {Object} item - NASA APOD data object
 * @returns {HTMLElement} - Complete card element with all interactive features
 */
function createImageCard(item) {
  // Create the main card container with interactive styling
  const card = document.createElement('div');
  card.className = 'gallery-item';
  
  // Create the media element (image or video thumbnail)
  let mediaElement;
  
  if (item.media_type === 'image') {
    // Create an image element with click handler for modal viewing
    mediaElement = document.createElement('img');
    mediaElement.src = item.url;
    mediaElement.alt = item.title;
    
    // Make image clickable to open modal for detailed viewing
    mediaElement.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      showModal(item);
    });
    mediaElement.style.cursor = 'pointer';
    
    // Add mouse tilt effect for enhanced visual appeal
    addTiltEffect(card, mediaElement);
    
  } else if (item.media_type === 'video') {
    // Create a clickable div for videos (usually YouTube embeds)
    mediaElement = document.createElement('div');
    mediaElement.className = 'video-thumbnail';
    
    // Extract YouTube video ID to get thumbnail image
    const videoId = extractYouTubeID(item.url);
    let thumbnailUrl = '';
    
    if (videoId) {
      // Use YouTube thumbnail as background for better visual appeal
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
    
    // Add mouse tilt effect for enhanced visual appeal
    addTiltEffect(card, mediaElement);
  }
  
  // Create share button for the card with accessibility features
  const shareButton = document.createElement('button');
  shareButton.className = 'card-share-btn';
  shareButton.innerHTML = '🔗';
  shareButton.title = 'Share this space image';
  shareButton.setAttribute('aria-label', 'Share this image');
  
  // Add share functionality with event handling
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
    
    // Add download functionality with event handling
    downloadButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      // Store the button reference in the event for the download function
      window.event = e;
      downloadImage(item);
    });
  }
  
  // Create title element with proper styling
  const title = document.createElement('h3');
  title.textContent = item.title;
  title.style.marginTop = '10px';
  title.style.fontSize = '16px';
  title.style.fontWeight = 'bold';
  
  // Create date element with metadata styling
  const date = document.createElement('p');
  date.textContent = `Date: ${item.date}`;
  date.style.color = '#666';
  date.style.fontSize = '14px';
  date.style.margin = '5px 0';
  
  // Create explanation element with truncation for card layout
  const explanation = document.createElement('p');
  const maxLength = 150;
  const truncatedExplanation = item.explanation.length > maxLength 
    ? item.explanation.substring(0, maxLength) + '...' 
    : item.explanation;
  explanation.textContent = truncatedExplanation;
  explanation.style.fontSize = '14px';
  explanation.style.lineHeight = '1.4';
  explanation.style.marginTop = '10px';
  
  // Add all elements to the card in proper order
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

/**
 * Add mouse tilt effect to gallery items for enhanced visual appeal
 * Creates a 3D tilt effect that follows mouse movement
 * @param {HTMLElement} card - The card container element
 * @param {HTMLElement} mediaElement - The media element to apply the effect to
 */
function addTiltEffect(card, mediaElement) {
  // Mouse move handler for dynamic tilt effect
  card.addEventListener('mousemove', (e) => {
    // Get the card's position and dimensions for calculations
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    // Calculate the distance from center (normalized to -1 to 1)
    const mouseX = (e.clientX - cardCenterX) / (rect.width / 2);
    const mouseY = (e.clientY - cardCenterY) / (rect.height / 2);
    
    // Calculate tilt angles (max 10 degrees for subtle effect)
    const tiltX = mouseY * -10; // Negative for natural tilt direction
    const tiltY = mouseX * 10;
    
    // Apply the transform with scale and tilt for 3D effect
    const scale = 1.05;
    mediaElement.style.transform = `scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  
  // Mouse enter handler - start the effect with smooth transition
  card.addEventListener('mouseenter', () => {
    mediaElement.style.transition = 'transform 0.1s ease';
  });
  
  // Mouse leave handler - reset to normal with smooth transition
  card.addEventListener('mouseleave', () => {
    mediaElement.style.transition = 'transform 0.3s ease';
    mediaElement.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
  });
}

// ===========================
// IMAGE DOWNLOAD FUNCTIONALITY
// ===========================
// Handles downloading high-resolution images with fallback methods
// Provides user feedback and handles CORS restrictions gracefully

/**
 * Download high-resolution image with multiple fallback methods
 * @param {Object} item - NASA APOD item containing image URLs and metadata
 */
async function downloadImage(item) {
  let downloadBtn = null;
  let originalText = '';
  
  try {
    // Find the download button that was clicked for user feedback
    downloadBtn = event.target;
    originalText = downloadBtn.innerHTML;
    
    // Show loading state on download button for user feedback
    downloadBtn.innerHTML = '⏳ Downloading...';
    downloadBtn.disabled = true;
    
    // Use hdurl if available, otherwise use regular url for best quality
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
      
      // Get the image as blob for download
      const blob = await response.blob();
      
      // Create download filename with date and title
      const date = item.date;
      const title = item.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
      const extension = imageUrl.toLowerCase().includes('.jpg') || imageUrl.toLowerCase().includes('.jpeg') ? '.jpg' : '.png';
      const filename = `NASA_APOD_${date}_${title}${extension}`;
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup after download
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      // Show success feedback to user
      showDownloadFeedback('Image downloaded successfully! 📁');
      
    } catch (fetchError) {
      // Fallback: Open image in new tab for manual save (handles CORS issues)
      console.log('Direct download failed, using fallback method:', fetchError);
      
      // Create download filename for display purposes
      const date = item.date;
      const title = item.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
      
      // Open the high-resolution image in a new tab
      const newWindow = window.open(imageUrl, '_blank');
      if (newWindow) {
        // Show instruction feedback for manual save
        showDownloadFeedback(`Opening high-res image in new tab. Right-click and "Save As..." to download. 💾`, false);
      } else {
        // If popup blocked, copy URL to clipboard as final fallback
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
    // Restore button state regardless of outcome
    if (downloadBtn && originalText) {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }
  }
}

/**
 * Show download feedback to user with appropriate positioning and timing
 * @param {string} message - Feedback message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showDownloadFeedback(message, isError = false) {
  // Remove existing download feedback to prevent duplicates
  const existingFeedback = document.getElementById('downloadFeedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element with appropriate styling
  const feedback = document.createElement('div');
  feedback.id = 'downloadFeedback';
  feedback.className = isError ? 'download-feedback download-error' : 'download-feedback';
  feedback.textContent = message;
  
  // Position it appropriately based on current view context
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
  
  // Auto-remove feedback after appropriate delay (longer for informational messages)
  const delay = message.length > 50 ? 6000 : 3000;
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, delay);
}
