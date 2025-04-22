// src/background/index.ts
console.log('Glite Extension Background Service Worker Loaded.');

// This service worker currently does nothing.
// Authentication, API calls, and core logic will be added here.

// Example listener (can be removed if not needed initially)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Glite Extension installed.');
});
