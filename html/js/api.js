/**
 * API Client for Spring Boot API (Render).
 * Production URL is set in api-config.js; fallback used if config not loaded.
 */

// Avoid redeclaration when this script is loaded multiple times via SPA navigation.
// Use global assignment without var/let/const so we don't re-declare identifiers.
(function() {
    try {
        var g = (typeof globalThis !== 'undefined') ? globalThis : window;
        if (typeof g.API_BASE_URL === 'undefined') {
            var isLocalHost = false;
            try {
                isLocalHost = !!(g.location && (g.location.hostname === 'localhost' || g.location.hostname === '127.0.0.1'));
            } catch (e) {
                isLocalHost = false;
            }
            var productionUrl = (typeof g.API_BASE_URL !== 'undefined' ? g.API_BASE_URL : null) || (typeof window !== 'undefined' && window.API_BASE_URL) || 'https://YOUR_RENDER_APP.onrender.com';
            g.API_BASE_URL = isLocalHost ? 'http://localhost:8080' : productionUrl;
        }
    } catch (e) {
        // Fallback for unusual environments
        if (typeof API_BASE_URL === 'undefined') {
            // eslint-disable-next-line no-implicit-globals
            API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL) || 'https://YOUR_RENDER_APP.onrender.com';
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
        var _url = API_BASE_URL + endpoint;
        const response = await fetch(_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        
        // Enhance error message for CORS/network issues
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
            const enhancedError = new Error(`Network error: ${error.message}. This may be a CORS issue if accessing from a local IP address.`);
            enhancedError.name = error.name;
            enhancedError.originalError = error;
            throw enhancedError;
        }
        
        throw error;
    }
}

// Global cache for projects data — do not reset on SPA re-injection of this script (projects.html loads api.js again)
if (typeof window.projectsCache === 'undefined') {
    window.projectsCache = null;
}
if (typeof window.projectsCachePromise === 'undefined') {
    window.projectsCachePromise = null;
}
if (typeof window.projectsFallbackUsed === 'undefined') {
    window.projectsFallbackUsed = false;
}
/** True when `projectsCache` / session list came from a successful API response (not static/localStorage fallback) */
if (typeof window.projectsCacheFromApi === 'undefined') {
    window.projectsCacheFromApi = false;
}

var PROJECTS_STATIC_FALLBACK_URL = '/data/web_data/projects.json';
var PROJECTS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
var PROJECTS_CACHE_KEY = 'portfolio_projects_cache';
/** Tab session: last successful `/api/projects` JSON (avoids repeat API calls on SPA revisits / same tab) */
var PROJECTS_SESSION_KEY = 'portfolio_projects_api_session_v1';

/**
 * Load projects from cache only (static file then localStorage). Does not call the API.
 * Use for fast first paint when API may be slow or sleeping.
 * @returns {Promise<Array>} - Array of project objects
 * @throws {Error} - If no cached data is available
 */
async function fetchProjectsCacheFirst() {
    // 1. Static file (same-origin, fast)
    try {
        var r = await fetch(PROJECTS_STATIC_FALLBACK_URL);
        if (r.ok) {
            var data = await r.json();
            if (data && Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch (e) { /* ignore */ }
    // 2. localStorage (if not expired)
    try {
        var raw = localStorage.getItem(PROJECTS_CACHE_KEY);
        if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0 &&
                (Date.now() - (parsed.at || 0)) < PROJECTS_CACHE_TTL_MS) {
                return parsed.data;
            }
        }
    } catch (e) { /* ignore */ }
    throw new Error('No cached projects');
}

/**
 * Fetch projects from API only (no fallback). For background refresh after cache-first display.
 * @returns {Promise<Array>} - Array of project objects
 */
function fetchProjectsFromAPIBackground() {
    return fetchFromAPI('/api/projects');
}

/**
 * Fetch projects: try API, then localStorage (if not expired), then static JSON fallback.
 * @returns {Promise<Array>} - Array of project objects
 */
async function fetchProjectsWithFallback() {
    // 1) Same-tab session: reuse last successful API response without hitting the network again
    try {
        var rawSession = sessionStorage.getItem(PROJECTS_SESSION_KEY);
        if (rawSession) {
            var sessionParsed = JSON.parse(rawSession);
            if (
                sessionParsed &&
                Array.isArray(sessionParsed.data) &&
                sessionParsed.data.length > 0 &&
                sessionParsed.fromApi === true
            ) {
                window.projectsFallbackUsed = false;
                window.projectsCacheFromApi = true;
                return sessionParsed.data;
            }
        }
    } catch (e) { /* ignore */ }

    // 2) API (primary for this tab until success is stored above)
    try {
        var projects = await fetchFromAPI('/api/projects');
        window.projectsFallbackUsed = false;
        window.projectsCacheFromApi = true;
        try {
            localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify({ data: projects, at: Date.now() }));
        } catch (e) { /* ignore */ }
        try {
            sessionStorage.setItem(
                PROJECTS_SESSION_KEY,
                JSON.stringify({ data: projects, fromApi: true, at: Date.now() })
            );
        } catch (e) { /* ignore */ }
        return projects;
    } catch (apiErr) {
        try {
            var raw = localStorage.getItem(PROJECTS_CACHE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.data) && (Date.now() - (parsed.at || 0)) < PROJECTS_CACHE_TTL_MS) {
                    window.projectsFallbackUsed = true;
                    window.projectsCacheFromApi = false;
                    return parsed.data;
                }
            }
        } catch (e) { /* ignore */ }
        try {
            var r = await fetch(PROJECTS_STATIC_FALLBACK_URL);
            if (r.ok) {
                var data = await r.json();
                if (data && Array.isArray(data)) {
                    window.projectsFallbackUsed = true;
                    window.projectsCacheFromApi = false;
                    return data;
                }
            }
        } catch (e) { /* ignore */ }
        throw apiErr;
    }
}

/**
 * Prefetch projects data on page load
 * This ensures projects are ready when user navigates to projects page
 */
function prefetchProjects() {
    if (!window.projectsCache && !window.projectsCachePromise) {
        window.projectsCachePromise = fetchProjectsWithFallback()
            .then(function(projects) {
                window.projectsCache = projects;
                window.projectsCachePromise = null;
                return projects;
            })
            .catch(function(error) {
                console.log('Projects prefetch failed (will fetch on demand):', error);
                window.projectsCachePromise = null;
                return null;
            });
    }
    return window.projectsCachePromise;
}

/**
 * Fetch projects from API
 * Uses in-memory cache, then API, then localStorage (TTL), then static fallback.
 * @returns {Promise<Array>} - Array of project objects
 */
async function fetchProjects() {
    if (window.projectsCache) {
        return Promise.resolve(window.projectsCache);
    }
    if (window.projectsCachePromise) {
        return window.projectsCachePromise;
    }
    window.projectsCachePromise = fetchProjectsWithFallback();
    try {
        var result = await window.projectsCachePromise;
        window.projectsCache = result;
        return result;
    } finally {
        window.projectsCachePromise = null;
    }
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
        submitContact,
        checkHealth,
        API_BASE_URL
    };
}

