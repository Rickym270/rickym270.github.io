/**
 * Projects page - dynamically loads projects from API
 */

// API Base URL - fallback if api.js isn't loaded
// Use var or check if already defined to prevent redeclaration errors in SPA navigation
if (typeof API_BASE_URL_FALLBACK === 'undefined') {
    var API_BASE_URL_FALLBACK = 'https://ricky-api-745807383723.us-east1.run.app';
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

// Fetch projects function - works standalone or with api.js
async function fetchProjectsFromAPI() {
    if (typeof fetchProjects !== 'undefined') {
        // Use api.js function if available
        return await fetchProjects();
    } else {
        // Fallback standalone fetch
        try {
        const response = await fetch(`${API_BASE_URL_FALLBACK}/api/projects`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
        } catch (error) {
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
 * Initialize projects page - load and render projects from API
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
        
        // Load project classification and fetch projects in parallel
        const [classification, projects] = await Promise.all([
            loadProjectClassification(),
            fetchProjectsFromAPI()
        ]);
        // Render all projects (no feature-only filter)
        if (projects && projects.length > 0) {
            renderProjects(projects, classification);
            // Re-apply translations after projects are rendered
            if (typeof window.TranslationManager !== 'undefined') {
                setTimeout(() => {
                    window.TranslationManager.applyTranslations();
                }, 100);
            }
        } else {
            // Show message if no projects
            const containerEl = document.querySelector('.container');
            if (containerEl) {
                const noProjects = document.createElement('div');
                noProjects.className = 'alert alert-info';
                noProjects.innerHTML = '<p>No projects to display.</p>';
                containerEl.appendChild(noProjects);
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Show detailed error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-warning';
        
        // Provide more helpful error information
        let errorText = 'Unable to load projects from API. Showing static content instead.';
        
        // Detect CORS/network errors
        const isCorsError = error.name === 'TypeError' || 
                           error.message.includes('Failed to fetch') || 
                           error.message.includes('Load failed') ||
                           error.message.includes('Network error');
        
        if (isCorsError) {
            const currentOrigin = window.location.origin;
            errorText += `<br><small><strong>CORS/Network Error:</strong> ${error.message || 'Failed to fetch'}</small>`;
            errorText += `<br><small>Current origin: ${currentOrigin}</small>`;
            errorText += `<br><small>API URL: ${typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : API_BASE_URL_FALLBACK}/api/projects</small>`;
            errorText += `<br><small><em>Note: The API needs to be redeployed with updated CORS configuration to allow requests from local IP addresses.</em></small>`;
        } else if (error.message) {
            errorText += `<br><small>Error: ${error.message}</small>`;
        }
        
        errorMsg.innerHTML = `<p>${errorText}</p>`;
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorMsg, container.querySelector('#ProjInProgress'));
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

