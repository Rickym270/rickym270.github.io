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
 * @returns {string} - Image path or default placeholder
 */
function getProjectImage(projectName) {
    // Try common variations
    const name = projectName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/html/imgs/${projectName}.png`;
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
        ? `<small class="text-muted">${tech.join(', ')}</small>` 
        : '';
    
    const cardHtml = `
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
            <div class="card" style="width: 100%; margin-bottom: 1vh; padding-top: 1vh;">
                <img src="${imagePath}" class="card-img-top center" alt="${project.name}" 
                     style="width: 75%;" 
                     onerror="this.style.display='none';">
                <div class="card-body">
                    <h5 class="card-title nobr">${project.name}</h5>
                    <p class="card-text">${summary}</p>
                    ${techTags ? `<div style="margin-bottom: 0.5rem;">${techTags}</div>` : ''}
                    <a href="${repoUrl}" class="card-link" target="_blank" rel="noopener noreferrer">
                        See on GitHub
                    </a>
                </div>
            </div>
        </div>
        <div class="push4"></div>
    `;
    
    const container = document.getElementById(containerId);
    if (container) {
        const row = container.querySelector('.row') || container.querySelector('div');
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
        featured: [],
        inProgress: [],
        complete: [],
        ideas: []
    };
    
    projects.forEach(project => {
        // Featured projects go to in-progress section (they'll be shown first)
        if (project.featured === true) {
            grouped.featured.push(project);
        } else if (project.status === 'in-progress' || project.status === 'in_progress' || project.status === 'inProgress') {
            grouped.inProgress.push(project);
        } else if (project.status === 'complete' || project.status === 'completed') {
            grouped.complete.push(project);
        } else if (project.status === 'idea' || project.status === 'ideas') {
            grouped.ideas.push(project);
        } else {
            // Default: assume complete if no status specified
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
    const grouped = groupProjects(projects);
    
    // Clear existing static content (optional - comment out if you want to keep fallback)
    // document.getElementById('ProjInProgress').querySelector('.row').innerHTML = '';
    // document.getElementById('ProjComplete').querySelector('.row').innerHTML = '';
    // document.getElementById('ProjComingSoon').querySelector('.row').innerHTML = '';
    
    // Render featured projects first (in "In Progress" section)
    grouped.featured.forEach(project => {
        renderProjectCard(project, 'ProjInProgress');
    });
    
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
    if (grouped.inProgress.length === 0 && grouped.featured.length === 0) {
        const section = document.getElementById('ProjInProgress');
        if (section) {
            const header = section.querySelector('p.text-muted');
            const divider = section.querySelector('.divider');
            if (header) header.style.display = 'none';
            if (divider) divider.style.display = 'none';
        }
    }
    
    if (grouped.complete.length === 0) {
        const section = document.getElementById('ProjComplete');
        if (section) section.style.display = 'none';
    }
    
    if (grouped.ideas.length === 0) {
        const section = document.getElementById('ProjComingSoon');
        if (section) section.style.display = 'none';
    }
}

// Flag to prevent double initialization
let projectsInitialized = false;

/**
 * Initialize projects page - load and render projects from API
 */
async function initProjects() {
    // Prevent double initialization
    if (projectsInitialized) {
        return;
    }
    projectsInitialized = true;
    try {
        // Show loading state
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'text-center';
        loadingMsg.innerHTML = '<p class="text-muted">Loading projects...</p>';
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(loadingMsg, container.querySelector('#ProjInProgress'));
        }
        
        // Fetch projects from API
        const projects = await fetchProjectsFromAPI();
        
        // Remove loading message
        if (loadingMsg.parentNode) {
            loadingMsg.remove();
        }
        
        // Render projects
        if (projects && projects.length > 0) {
            renderProjects(projects);
        } else {
            // Show message if no projects
            const noProjects = document.createElement('div');
            noProjects.className = 'alert alert-info';
            noProjects.innerHTML = '<p>No projects found.</p>';
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
            // Ensure DOM is fully ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initProjects);
            } else {
                // DOM is ready, but wait a tick to ensure all elements are inserted
                setTimeout(initProjects, 0);
            }
        }
    }
    
    // Try immediately (in case page is loaded normally)
    tryInit();
    
    // Also try after a short delay (in case loaded via jQuery .load())
    setTimeout(tryInit, 100);
})();

