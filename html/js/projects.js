/**
 * Projects page - dynamically loads projects from API
 */

// API Base URL - fallback if api.js isn't loaded
const API_BASE_URL_FALLBACK = 'https://ricky-api-745807383723.us-east1.run.app';

// Fetch projects function - works standalone or with api.js
async function fetchProjectsFromAPI() {
    if (typeof fetchProjects !== 'undefined') {
        // Use api.js function if available
        return await fetchProjects();
    } else {
        // Fallback standalone fetch
        const response = await fetch(`${API_BASE_URL_FALLBACK}/api/projects`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}

/**
 * Get image path for a project
 * @param {string} projectName - Name of the project
 * @returns {string} - Image path (returns path, but image may not exist - handled in render)
 */
function getProjectImage(projectName) {
    // Return image path - missing images are handled gracefully via onerror
    // URL encode the project name for proper path handling
    return `/html/imgs/${encodeURIComponent(projectName)}.png`;
}

/**
 * Render a single project card
 * @param {Object} project - Project object
 * @param {string} containerId - Container ID to append to
 */
function renderProjectCard(project, containerId) {
    const imagePath = getProjectImage(project.name);
    const summary = project.summary || project.description || 'No description available';
    const repoUrl = project.repo || '#';
    const tech = project.tech || [];
    const techTags = tech.length > 0 
        ? tech.map(t => `<span class="tech-tag">${t}</span>`).join('') 
        : '';
    
    const cardHtml = `
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="project-card fade-in">
                <img src="${imagePath}" class="project-image" alt="${project.name}" 
                     onerror="this.onerror=null; this.style.display='none';"
                     loading="lazy">
                <h5 class="card-title">${project.name}</h5>
                <p class="card-text">${summary}</p>
                ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
                <a href="${repoUrl}" class="card-link mt-auto" target="_blank" rel="noopener noreferrer">
                    View on GitHub →
                </a>
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
 * Group projects by status (featured, in progress, complete, ideas)
 * Projects are grouped by featured flag or status field
 * @param {Array} projects - Array of project objects
 * @returns {Object} - Grouped projects
 */
function groupProjects(projects) {
    const grouped = {
        inProgress: [],
        complete: [],
        ideas: []
    };
    
    projects.forEach(project => {
        // Priority 1: Manual status declaration in projects.json takes precedence
        if (project.status === 'in-progress' || project.status === 'in_progress' || project.status === 'inProgress') {
            grouped.inProgress.push(project);
        } 
        // Priority 2: Automatic detection based on GitHub activity (commits within last month)
        else if (project.hasRecentActivity === true) {
            grouped.inProgress.push(project);
        } 
        // Ideas section
        else if (project.status === 'idea' || project.status === 'ideas') {
            grouped.ideas.push(project);
        } 
        // Default: put all other featured projects in "Complete" section
        else {
            grouped.complete.push(project);
        }
    });
    
    return grouped;
}

/**
 * Render all projects
 * @param {Array} projects - Array of project objects
 */
function renderProjects(projects) {
    // Deduplicate projects first
    const uniqueProjects = deduplicateProjects(projects);
    
    // Clear existing content in rows before rendering to prevent duplicates
    const inProgressRow = document.querySelector('#ProjInProgress .row');
    const completeRow = document.querySelector('#ProjComplete .row');
    const ideasRow = document.querySelector('#ProjComingSoon .row');
    
    // Clear "Please Wait" messages
    if (inProgressRow) inProgressRow.innerHTML = '';
    if (completeRow) completeRow.innerHTML = '';
    if (ideasRow) ideasRow.innerHTML = '';
    
    const grouped = groupProjects(uniqueProjects);
    
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
let projectsInitialized = false;
// Make it accessible globally for SPA navigation
window.projectsInitialized = false;

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
        
        if (inProgressRow) {
            inProgressRow.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Loading...</p></div>';
        }
        if (completeRow) {
            completeRow.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Loading...</p></div>';
        }
        if (ideasRow) {
            ideasRow.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Loading...</p></div>';
        }
        
        // Fetch projects from API
        const projects = await fetchProjectsFromAPI();
        
        // Filter projects: only show featured projects
        const featuredProjects = projects.filter(project => {
            return project.featured === true;
        });
        
        // Render only featured projects
        if (featuredProjects && featuredProjects.length > 0) {
            renderProjects(featuredProjects);
        } else {
            // Show message if no featured projects
            const noProjects = document.createElement('div');
            noProjects.className = 'alert alert-info';
            noProjects.innerHTML = '<p>No featured projects to display.</p>';
            container.appendChild(noProjects);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-warning';
        errorMsg.innerHTML = '<p>Unable to load projects from API. Showing static content instead.</p>';
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

