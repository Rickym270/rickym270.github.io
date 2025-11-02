/**
 * API Client for Spring Boot API on Cloud Run
 * Base URL: https://ricky-api-745807383723.us-east1.run.app
 */

const API_BASE_URL = 'https://ricky-api-745807383723.us-east1.run.app';

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

/**
 * Fetch projects from API
 * @returns {Promise<Array>} - Array of project objects
 */
async function fetchProjects() {
    return await fetchFromAPI('/api/projects');
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
        fetchMeta,
        fetchStats,
        fetchGitHubActivity,
        submitContact,
        checkHealth,
        API_BASE_URL
    };
}

