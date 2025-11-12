/**
 * API Client for Spring Boot API on Cloud Run
 * Base URL: https://ricky-api-745807383723.us-east1.run.app
 */

// Avoid redeclaration when this script is loaded multiple times via SPA navigation.
// Use global assignment without var/let/const so we don't re-declare identifiers.
(function() {
    try {
        var g = (typeof globalThis !== 'undefined') ? globalThis : window;
        if (typeof g.API_BASE_URL === 'undefined') {
            g.API_BASE_URL = 'https://ricky-api-745807383723.us-east1.run.app';
        }
    } catch (e) {
        // Fallback for unusual environments
        if (typeof API_BASE_URL === 'undefined') {
            // eslint-disable-next-line no-implicit-globals
            API_BASE_URL = 'https://ricky-api-745807383723.us-east1.run.app';
        }
    }
})();

/**
 * Fetch data from API endpoint
 * @param {string} endpoint - API endpoint (e.g., '/api/projects')
 * @returns {Promise<any>} - JSON response data
 */
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Global cache for projects data
window.projectsCache = null;
window.projectsCachePromise = null;

/**
 * Prefetch projects data on page load
 * This ensures projects are ready when user navigates to projects page
 */
function prefetchProjects() {
    // Only prefetch if not already cached or in progress
    if (!window.projectsCache && !window.projectsCachePromise) {
        window.projectsCachePromise = fetchFromAPI('/api/projects')
            .then(projects => {
                window.projectsCache = projects;
                window.projectsCachePromise = null;
                return projects;
            })
            .catch(error => {
                console.log('Projects prefetch failed (will fetch on demand):', error);
                window.projectsCachePromise = null;
                return null;
            });
    }
    return window.projectsCachePromise;
}

/**
 * Fetch projects from API
 * Uses cached data if available, otherwise fetches fresh data
 * @returns {Promise<Array>} - Array of project objects
 */
async function fetchProjects() {
    // Return cached data if available
    if (window.projectsCache) {
        return Promise.resolve(window.projectsCache);
    }
    
    // If prefetch is in progress, wait for it
    if (window.projectsCachePromise) {
        return window.projectsCachePromise;
    }
    
    // Otherwise fetch fresh data
    const projects = await fetchFromAPI('/api/projects');
    window.projectsCache = projects;
    return projects;
}

/**
 * Fetch profile metadata from API
 * @returns {Promise<Object>} - Metadata object
 */
async function fetchMeta() {
    return await fetchFromAPI('/api/meta');
}

/**
 * Fetch stats from API
 * @returns {Promise<Object>} - Stats object
 */
async function fetchStats() {
    return await fetchFromAPI('/api/stats');
}

/**
 * Fetch GitHub activity from API
 * @returns {Promise<Array>} - Array of activity objects
 */
async function fetchGitHubActivity() {
    return await fetchFromAPI('/api/github/activity');
}

/**
 * Submit contact form
 * @param {Object} contactData - Contact form data {name, email, message}
 * @returns {Promise<Object>} - Created contact message
 */
async function submitContact(contactData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
}

/**
 * Check API health
 * @returns {Promise<Object>} - Health status object
 */
async function checkHealth() {
    return await fetchFromAPI('/api/health');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchFromAPI,
        fetchProjects,
        prefetchProjects,
        fetchMeta,
        fetchStats,
        fetchGitHubActivity,
        submitContact,
        checkHealth,
        API_BASE_URL
    };
}

