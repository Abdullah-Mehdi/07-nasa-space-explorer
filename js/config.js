// NASA APOD API Configuration
// This file handles API key management for GitHub Pages deployment

// NASA APOD API base URL
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Function to get API key from localStorage or fallback
function getNASAAPIKey() {
  // Try to get user's API key from localStorage
  const userApiKey = localStorage.getItem('nasa_api_key');
  if (userApiKey && userApiKey.trim() !== '') {
    return userApiKey.trim();
  }
  
  // Fallback to demo key (limited requests)
  return 'DEMO_KEY';
}

// Function to save API key to localStorage
function saveNASAAPIKey(apiKey) {
  if (apiKey && apiKey.trim() !== '') {
    localStorage.setItem('nasa_api_key', apiKey.trim());
    return true;
  }
  return false;
}

// Function to check if user has set their own API key
function hasUserAPIKey() {
  const userApiKey = localStorage.getItem('nasa_api_key');
  return userApiKey && userApiKey.trim() !== '';
}

// Function to clear stored API key
function clearNASAAPIKey() {
  localStorage.removeItem('nasa_api_key');
}
