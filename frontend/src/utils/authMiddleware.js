import axios from 'axios';

let isAuthSet = false;
let authReadyCallbacks = [];

export function setAuthHeader() {
  // Check if the header has already been set
  if (isAuthSet) return;
  
  // Try to get the token from localStorage
  const token = localStorage.getItem('token');
  
  // Log the token status for debugging
  console.log('Attempting to set Authorization header. Token found:', !!token);

  if (token) {
    // Set the header if the token exists
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    isAuthSet = true;
    
    // Call any waiting callbacks
    authReadyCallbacks.forEach(callback => callback());
    authReadyCallbacks = [];
  }
}

export function onAuthReady(callback) {
  if (isAuthSet) {
    callback();
  } else {
    authReadyCallbacks.push(callback);
    // Ensure the header is checked/set
    setAuthHeader();
  }
}

// Initial call to set the header when the script loads
setAuthHeader();
