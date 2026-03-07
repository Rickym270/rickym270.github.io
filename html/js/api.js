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
        // #region agent log
        var _url = API_BASE_URL + endpoint;
        if (typeof fetch !== 'undefined') fetch('http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5613b1'},body:JSON.stringify({sessionId:'5613b1',location:'api.js:fetchFromAPI',message:'api fetch attempt',data:{origin:typeof window!=='undefined'?window.location.origin:null,apiUrl:_url,hostname:typeof window!=='undefined'?window.location.hostname:null},hypothesisId:'H1',timestamp:Date.now()})}).catch(function(){});
        // #endregion
        const response = await fetch(_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        
        // Enhance error message for CORS/network issues
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
            // #region agent log
            if (typeof fetch !== 'undefined') fetch('http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5613b1'},body:JSON.stringify({sessionId:'5613b1',location:'api.js:corsError',message:'CORS/network error in api.js',data:{origin:typeof window!=='undefined'?window.location.origin:null,apiUrl:API_BASE_URL+endpoint,errorName:error.name,errorMessage:(error.message||'')},hypothesisId:'H2',timestamp:Date.now()})}).catch(function(){});
            // #endregion
            const enhancedError = new Error(`Network error: ${error.message}. This may be a CORS issue if accessing from a local IP address.`);
            enhancedError.name = error.name;
            enhancedError.originalError = error;
            throw enhancedError;
        }
        
        throw error;
    }
}

// Global cache for projects data
window.projectsCache = null;
window.projectsCachePromise = null;
/** Set to true when projects were loaded from static fallback or localStorage (for optional UI note) */
window.projectsFallbackUsed = false;

var PROJECTS_STATIC_FALLBACK_URL = '/data/web_data/projects.json';
var PROJECTS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
var PROJECTS_CACHE_KEY = 'portfolio_projects_cache';

/**
 * Fetch projects: try API, then localStorage (if not expired), then static JSON fallback.
 * @returns {Promise<Array>} - Array of project objects
 */
async function fetchProjectsWithFallback() {
    try {
        var projects = await fetchFromAPI('/api/projects');
        window.projectsFallbackUsed = false;
        try {
            localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify({ data: projects, at: Date.now() }));
        } catch (e) { /* ignore */ }
        return projects;
    } catch (apiErr) {
        try {
            var raw = localStorage.getItem(PROJECTS_CACHE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.data) && (Date.now() - (parsed.at || 0)) < PROJECTS_CACHE_TTL_MS) {
                    window.projectsFallbackUsed = true;
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

