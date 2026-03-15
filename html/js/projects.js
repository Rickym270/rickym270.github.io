/**
 * Projects page - dynamically loads projects from API
 */

// API Base URL - fallback if api.js isn't loaded
// Use var or check if already defined to prevent redeclaration errors in SPA navigation
if (typeof API_BASE_URL_FALLBACK === 'undefined') {
    var isLocalHost = false;
    try {
        isLocalHost = (typeof window !== 'undefined') &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    } catch (e) {
        isLocalHost = false;
    }
    var API_BASE_URL_FALLBACK = isLocalHost
        ? 'http://localhost:8080'
        : (typeof window !== 'undefined' && window.API_BASE_URL) || 'https://YOUR_RENDER_APP.onrender.com';
}

// Cache for project classification
// Check if already defined to prevent redeclaration errors in SPA navigation
if (typeof projectClassification === 'undefined') {
    var projectClassification = null;
}

/**
 * Load project classification from JSON file
 * @returns {Promise<Object>} - Classification object with Ongoing/In Progress, Completed, Discontinued, Ideas arrays
 */
async function loadProjectClassification() {
    if (projectClassification) {
        return projectClassification;
    }
    
    try {
        const response = await fetch('/data/ProjectClassification.json');
        if (!response.ok) {
            console.warn('Could not load ProjectClassification.json, using default grouping');
            return null;
        }
        projectClassification = await response.json();
        return projectClassification;
    } catch (error) {
        console.warn('Error loading ProjectClassification.json:', error);
        return null;
    }
}

/**
 * Normalize project name for matching (case-insensitive, handle variations)
 * @param {string} name - Project name
 * @returns {string} - Normalized name for comparison
 */
function normalizeProjectName(name) {
    if (!name) return '';
    // Remove spaces, convert to lowercase for comparison
    return name.replace(/\s+/g, '').toLowerCase();
}

/**
 * Check if a project name matches any name in a classification array
 * @param {string} projectName - Project name to check
 * @param {Array} classificationArray - Array of names from classification
 * @returns {boolean} - True if project matches any name in array
 */
function matchesClassification(projectName, classificationArray) {
    if (!projectName || !classificationArray) return false;
    const normalizedProject = normalizeProjectName(projectName);
    return classificationArray.some(classifiedName => 
        normalizeProjectName(classifiedName) === normalizedProject
    );
}

// Static fallback URL when API is unavailable (same as api.js)
var PROJECTS_STATIC_FALLBACK_URL = '/data/web_data/projects.json';
// localStorage key for projects cache (must match api.js)
var PROJECTS_CACHE_KEY = 'portfolio_projects_cache';

/**
 * Normalize project for comparison (slug, name, summary/description)
 * @param {Object} p - Project object
 * @returns {Object} - Normalized fingerprint
 */
function projectFingerprint(p) {
    return {
        slug: (p.slug || p.name || '').toString().toLowerCase(),
        name: (p.name || '').toString(),
        summary: (p.summary || p.description || '').toString()
    };
}

/**
 * Compare two project arrays for equality (order-independent by slug, same slugs with same name/summary)
 * @param {Array} a - First list
 * @param {Array} b - Second list
 * @returns {boolean} - True if data is equivalent
 */
function projectsDataEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    var mapA = {};
    a.forEach(function(p) {
        var fp = projectFingerprint(p);
        mapA[fp.slug] = fp;
    });
    for (var i = 0; i < b.length; i++) {
        var fp = projectFingerprint(b[i]);
        var fromA = mapA[fp.slug];
        if (!fromA || fromA.name !== fp.name || fromA.summary !== fp.summary) return false;
    }
    return true;
}

// Fetch projects function - works standalone or with api.js
async function fetchProjectsFromAPI() {
    if (typeof fetchProjects !== 'undefined') {
        // Use api.js function if available (includes API, localStorage, static fallback)
        return await fetchProjects();
    }
    // Standalone fetch: try API, then static fallback
    var _apiUrl = API_BASE_URL_FALLBACK + '/api/projects';
    try {
        var response = await fetch(_apiUrl);
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        return await response.json();
    } catch (error) {
        try {
            var fallbackResponse = await fetch(PROJECTS_STATIC_FALLBACK_URL);
            if (fallbackResponse.ok) {
                var data = await fallbackResponse.json();
                if (data && Array.isArray(data)) {
                    if (typeof window !== 'undefined') window.projectsFallbackUsed = true;
                    return data;
                }
            }
        } catch (e) { /* ignore */ }
        if (error.name === 'TypeError' || error.message.indexOf('Failed to fetch') !== -1 || error.message.indexOf('Load failed') !== -1) {
            var enhancedError = new Error('Network error: ' + error.message + '. This may be a CORS issue if accessing from a local IP address.');
            enhancedError.name = error.name;
            enhancedError.originalError = error;
            throw enhancedError;
        }
        throw error;
    }
}

/**
 * Get image path for a project
 * @param {string} projectName - Name of the project
 * @returns {string} - Image path (returns path, but image may not exist - handled in render)
 */
function getProjectImage(projectName) {
    const basePath = '/html/imgs/';
    
    // Explicit mappings for known exceptions or special filenames
    const imageMap = {
        'Blue Manager': 'Blue_Manager.png',
        'BlueManager': 'Blue_Manager.png',
        'KappaSigmaHC': 'KappaSigmaHC.png',
        // Xpress Transit variants
        'Xpress Transit': 'Xpress_Transit.jpg',
        'XPress Transit': 'Xpress_Transit.jpg',
        'XpressTransit': 'Xpress_Transit.jpg',
        'xpress transit': 'Xpress_Transit.jpg'
    };
    if (imageMap[projectName]) {
        return `${basePath}${imageMap[projectName]}`;
    }
    
    // Generate common filename variations
    const noSpaces = projectName.replace(/\s+/g, '');
    const underscores = projectName.replace(/\s+/g, '_');
    const hyphens = projectName.replace(/\s+/g, '-');
    const alnum = projectName.replace(/[^A-Za-z0-9]/g, '');
    const lowerNoSpaces = noSpaces.toLowerCase();
    const lowerUnderscores = underscores.toLowerCase();
    
    const candidates = [
        // Preferred variations (underscore style first)
        `${underscores}.png`,
        `${underscores}.jpg`,
        `${underscores}.png`,
        `${noSpaces}.png`,
        `${noSpaces}.jpg`,
        `${hyphens}.png`,
        `${hyphens}.jpg`,
        // Lowercase fallbacks
        `${lowerUnderscores}.png`,
        `${lowerNoSpaces}.png`,
        `${lowerUnderscores}.jpg`,
        `${lowerNoSpaces}.jpg`,
        // Last resort: original with encoding (if any spaces/specials)
        `${encodeURIComponent(projectName)}.png`,
        `${encodeURIComponent(projectName)}.jpg`
    ];
    
    // Return the first candidate; missing file will be hidden by onerror
    return `${basePath}${candidates[0]}`;
}

/**
 * Render a single project card
 * @param {Object} project - Project object
 * @param {string} containerId - Container ID to append to
 */
function renderProjectCard(project, containerId) {
    const imagePath = getProjectImage(project.name);
    const summary = project.summary || project.description || 'No description available';
    const tech = project.tech || [];
    const techTags = tech.length > 0 
        ? tech.map(t => `<span class="tech-tag">${t}</span>`).join('') 
        : '';
    
    const projectSlug = project.slug || project.name.toLowerCase().replace(/\s+/g, '-');
    
    const cardHtml = `
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="project-card fade-in">
                <div class="project-header">
                    <img src="${imagePath}" class="project-image" alt="${project.name}" 
                         onerror="this.onerror=null; this.style.display='none';"
                         loading="lazy">
                </div>
                <h5 class="card-title" data-no-translate="true">${project.name}</h5>
                <p class="card-text" data-translate="projects.descriptions.${projectSlug}">${summary}</p>
                ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
            </div>
        </div>
    `;
    
    const container = document.getElementById(containerId);
    if (container) {
        const row = container.querySelector('.row');
        if (row) {
            row.insertAdjacentHTML('beforeend', cardHtml);
        } else {
            container.insertAdjacentHTML('beforeend', cardHtml);
        }
    }
}


/**
 * Group projects by status using ProjectClassification.json
 * Projects are grouped by classification file, then fallback to status field or activity
 * @param {Array} projects - Array of project objects
 * @param {Object} classification - ProjectClassification.json data
 * @returns {Object} - Grouped projects
 */
function groupProjects(projects, classification = null) {
    const grouped = {
        inProgress: [],
        complete: [],
        ideas: []
    };
    
    projects.forEach(project => {
        const projectName = project.name || project.slug || '';
        let classified = false;
        
        // Priority 1: Use ProjectClassification.json if available
        if (classification) {
            // Check "Ongoing" (newer) or "In Progress" (legacy) for in-progress projects
            if ((classification['Ongoing'] && matchesClassification(projectName, classification['Ongoing'])) ||
                (classification['In Progress'] && matchesClassification(projectName, classification['In Progress']))) {
            grouped.inProgress.push(project);
                classified = true;
        } 
            // Check "Completed"
            else if (classification['Completed'] && matchesClassification(projectName, classification['Completed'])) {
                grouped.complete.push(project);
                classified = true;
            }
            // Check "Ideas"
            else if (classification['Ideas'] && matchesClassification(projectName, classification['Ideas'])) {
                grouped.ideas.push(project);
                classified = true;
            }
            // Skip "Discontinued" projects - don't add them to any group
            else if (classification['Discontinued'] && matchesClassification(projectName, classification['Discontinued'])) {
                classified = true; // Mark as classified but don't add anywhere
            }
        }
        
        // Priority 2: Use status field from API (can be "in-progress", "complete", or "ideas")
        if (!classified) {
            const status = project.status ? String(project.status).toLowerCase() : '';
            
            if (status === 'in-progress' || status === 'in_progress' || status === 'inprogress') {
            grouped.inProgress.push(project);
        } 
            // Ideas section - handle both "ideas" and "idea" for backward compatibility
            else if (status === 'ideas' || status === 'idea') {
            grouped.ideas.push(project);
        } 
            // Default: put all other projects in "Complete" section (status = "complete" or undefined)
        else {
            grouped.complete.push(project);
            }
        }
    });
    
    return grouped;
}

/**
 * Render all projects
 * @param {Array} projects - Array of project objects
 * @param {Object} classification - Optional ProjectClassification.json data
 */
function renderProjects(projects, classification = null) {
    // Exclude specific projects by slug or name
    const EXCLUDED = new Set([
        'learning-java-2825378',
        'pact-5-minute-getting-started-guide',
        'cpptuts',
        'pythontutorial'
    ]);
    const isExcluded = (project) => {
        const slug = (project.slug || '').toLowerCase();
        const name = (project.name || '').toLowerCase();
        if (EXCLUDED.has(slug)) return true;
        // Normalize name as slug-like for comparison (spaces -> hyphens)
        const nameAsSlug = name.replace(/\s+/g, '-');
        return EXCLUDED.has(name) || EXCLUDED.has(nameAsSlug);
    };
    
    // Default featured: if missing, treat as true so we can sort but not filter out
    const normalized = (projects || []).map(p => {
        if (typeof p.featured === 'undefined') {
            p.featured = true;
        }
        return p;
    }).filter(p => !isExcluded(p));
    
    // Sort: featured first, then alphabetical by name
    normalized.sort((a, b) => {
        const aFeat = a.featured === true ? 1 : 0;
        const bFeat = b.featured === true ? 1 : 0;
        if (bFeat - aFeat !== 0) return bFeat - aFeat;
        const an = (a.name || '').toLowerCase();
        const bn = (b.name || '').toLowerCase();
        return an.localeCompare(bn);
    });
    
    // Deduplicate after normalization
    const uniqueProjects = deduplicateProjects(normalized);
    
    // Clear existing content in rows before rendering to prevent duplicates
    const inProgressRow = document.querySelector('#ProjInProgress .row');
    const completeRow = document.querySelector('#ProjComplete .row');
    const ideasRow = document.querySelector('#ProjComingSoon .row');
    
    // Clear "Please Wait" messages
    if (inProgressRow) inProgressRow.innerHTML = '';
    if (completeRow) completeRow.innerHTML = '';
    if (ideasRow) ideasRow.innerHTML = '';
    
    const grouped = groupProjects(uniqueProjects, classification);
    
    // Render in-progress projects
    grouped.inProgress.forEach(project => {
        renderProjectCard(project, 'ProjInProgress');
    });
    
    // Render complete projects
    grouped.complete.forEach(project => {
        renderProjectCard(project, 'ProjComplete');
    });
    
    // Render ideas
    grouped.ideas.forEach(project => {
        renderProjectCard(project, 'ProjComingSoon');
    });
    
    // Hide sections that have no projects
    if (grouped.inProgress.length === 0) {
        const section = document.getElementById('ProjInProgress');
        if (section) {
            section.style.display = 'none';
        }
    }
    
    if (grouped.complete.length === 0) {
        const section = document.getElementById('ProjComplete');
        if (section) {
            section.style.display = 'none';
        }
    }
    
    if (grouped.ideas.length === 0) {
        const section = document.getElementById('ProjComingSoon');
        if (section) {
            section.style.display = 'none';
        }
    }
}

/**
 * Deduplicate projects by slug or name
 * @param {Array} projects - Array of project objects
 * @returns {Array} - Deduplicated array
 */
function deduplicateProjects(projects) {
    const seen = new Set();
    return projects.filter(project => {
        const key = project.slug || project.name || JSON.stringify(project);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Flag to prevent double initialization
// Check if already defined to prevent redeclaration errors in SPA navigation
if (typeof projectsInitialized === 'undefined') {
    var projectsInitialized = false;
}
// Make it accessible globally for SPA navigation
window.projectsInitialized = false;
// Provide a safe reset API so SPA can re-initialize when navigating back
window.resetProjectsInit = function resetProjectsInit() {
    projectsInitialized = false;
    window.projectsInitialized = false;
};

/**
 * Run background API fetch and, if response differs from current data, silently update UI and cache.
 * Call after rendering from cache. No-op if cache-first APIs are not available.
 */
function startProjectsBackgroundRefresh(classification, displayedProjects) {
    if (typeof window.fetchProjectsFromAPIBackground !== 'function') return;
    window.fetchProjectsFromAPIBackground()
        .then(function(apiData) {
            if (!Array.isArray(apiData) || projectsDataEqual(displayedProjects, apiData)) return;
            window.projectsCache = apiData;
            window.projectsFallbackUsed = false;
            try {
                localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify({ data: apiData, at: Date.now() }));
            } catch (e) { /* ignore */ }
            renderProjects(apiData, classification);
            var fallbackNote = document.querySelector('#content p[data-translate="projects.fallbackNote"]');
            if (fallbackNote) fallbackNote.remove();
            if (typeof window.TranslationManager !== 'undefined' && window.TranslationManager.applyTranslations) {
                window.TranslationManager.applyTranslations();
            }
        })
        .catch(function() { /* ignore background failure */ });
}

/**
 * Initialize projects page - load and render projects from API
 * Uses cache-first: show static/cached data immediately, then refresh from API in background and silently update if different.
 */
async function initProjects() {
    // Prevent double initialization
    if (projectsInitialized || window.projectsInitialized) {
        return;
    }
    projectsInitialized = true;
    window.projectsInitialized = true;
    try {
        // Show loading state in each section
        const inProgressRow = document.querySelector('#ProjInProgress .row');
        const completeRow = document.querySelector('#ProjComplete .row');
        const ideasRow = document.querySelector('#ProjComingSoon .row');
        
        // Get translated loading text
        const loadingText = (typeof window.TranslationManager !== 'undefined' && window.TranslationManager.t)
            ? window.TranslationManager.t('projects.loading')
            : 'Loading...';
        
        if (inProgressRow) {
            inProgressRow.innerHTML = `<div class="col-12 text-center"><p class="text-muted" data-translate="projects.loading">${loadingText}</p></div>`;
        }
        if (completeRow) {
            completeRow.innerHTML = `<div class="col-12 text-center"><p class="text-muted" data-translate="projects.loading">${loadingText}</p></div>`;
        }
        if (ideasRow) {
            ideasRow.innerHTML = `<div class="col-12 text-center"><p class="text-muted" data-translate="projects.loading">${loadingText}</p></div>`;
        }
        
        const classification = await loadProjectClassification();
        var projects = null;
        var usedCacheFirst = false;

        if (typeof window.fetchProjectsCacheFirst === 'function') {
            try {
                projects = await window.fetchProjectsCacheFirst();
                usedCacheFirst = true;
                if (typeof window !== 'undefined') window.projectsFallbackUsed = true;
                window.projectsCache = projects;
            } catch (e) {
                /* no cache, fall through to API/fallback */
            }
        }
        if (!projects || projects.length === 0) {
            projects = await fetchProjectsFromAPI();
            if (projects) window.projectsCache = projects;
        }

        // Render all projects (no feature-only filter)
        if (projects && projects.length > 0) {
            renderProjects(projects, classification);
            if (usedCacheFirst && typeof window !== 'undefined' && window.projectsFallbackUsed) {
                var containerEl = document.querySelector('#content .container');
                if (!containerEl) containerEl = document.querySelector('.container');
                var fallbackNote = document.createElement('p');
                fallbackNote.className = 'text-muted small mb-2';
                fallbackNote.setAttribute('data-translate', 'projects.fallbackNote');
                fallbackNote.textContent = 'Showing cached projects; some data may be outdated.';
                if (containerEl) {
                    if (containerEl.firstChild) {
                        containerEl.insertBefore(fallbackNote, containerEl.firstChild);
                    } else {
                        containerEl.appendChild(fallbackNote);
                    }
                }
            }
            if (usedCacheFirst && typeof window.fetchProjectsFromAPIBackground === 'function') {
                startProjectsBackgroundRefresh(classification, projects);
            }
            // Re-apply translations after projects are rendered
            if (typeof window.TranslationManager !== 'undefined') {
                setTimeout(function() {
                    window.TranslationManager.applyTranslations();
                }, 100);
            }
        } else {
            // Show message if no projects
            let containerEl = document.querySelector('#content .container');
            if (!containerEl) containerEl = document.querySelector('.container');
            if (containerEl) {
                const noProjects = document.createElement('div');
                noProjects.className = 'alert alert-info';
                noProjects.innerHTML = '<p>No projects to display.</p>';
                containerEl.appendChild(noProjects);
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Detect CORS/network errors
        const isCorsError = error.name === 'TypeError' ||
                           error.message.includes('Failed to fetch') ||
                           error.message.includes('Load failed') ||
                           error.message.includes('Network error');

        if (isCorsError) {
            const currentOrigin = window.location.origin;
            const apiBase = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : API_BASE_URL_FALLBACK;
            const apiUrl = apiBase + '/api/projects';
            console.warn(
                'Projects API request failed (CORS/network or server error):',
                error.message || 'Failed to fetch',
                '\nOrigin:', currentOrigin,
                '\nAPI:', apiUrl,
                '\nIf the browser also reported 503 (Service Unavailable), the API is down or overloaded — check Render service status and logs.',
                '\nIf only CORS is reported, redeploy the API so CorsConfig allows this origin.'
            );
        } else {
            // Non-CORS: log and show inline message below
        }

        // Replace "Loading..." with a single error message so the page doesn't stay stuck (no alert box)
        const loadErrorText = (typeof window.TranslationManager !== 'undefined' && window.TranslationManager.t)
            ? window.TranslationManager.t('projects.loadError')
            : 'Unable to load projects. Please try again later.';
        const inProgressRow = document.querySelector('#ProjInProgress .row');
        const completeRow = document.querySelector('#ProjComplete .row');
        const ideasRow = document.querySelector('#ProjComingSoon .row');
        const errorContent = `<div class="col-12 text-center"><p class="text-muted" data-translate="projects.loadError">${loadErrorText}</p></div>`;
        if (inProgressRow) inProgressRow.innerHTML = errorContent;
        if (completeRow) completeRow.innerHTML = '';
        if (ideasRow) ideasRow.innerHTML = '';
        if (typeof window.TranslationManager !== 'undefined' && window.TranslationManager.applyTranslations) {
            window.TranslationManager.applyTranslations();
        }
    }
}

// Auto-initialize when DOM is ready
// When loaded via jQuery .load(), scripts execute after DOM insertion
(function() {
    function tryInit() {
        // Check if projects container exists (means we're on the projects page)
        if (document.querySelector('#ProjInProgress')) {
            // Reset initialization flag if page was reloaded
            if (window.projectsInitialized && !document.querySelector('#ProjInProgress .project-card')) {
                window.projectsInitialized = false;
                projectsInitialized = false;
            }
            // Ensure DOM is fully ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initProjects);
            } else {
                // DOM is ready, but wait a tick to ensure all elements are inserted
                setTimeout(initProjects, 50);
            }
        }
    }
    
    // Try immediately (in case page is loaded normally)
    tryInit();
    
    // Also try after delays (in case loaded via jQuery .load())
    setTimeout(tryInit, 100);
    setTimeout(tryInit, 300);
    
    // Make initProjects available globally for SPA navigation
    window.initProjects = initProjects;
})();

