$(document).ready(function(){
    // Prevent double initialization - only run default load once per page load
    if (typeof window.spaInitialized !== 'undefined') {
        return; // Already initialized, don't run again
    }
    window.spaInitialized = true;
    
    // Better URL parsing - handle both absolute and relative paths
    var pathParts = window.location.pathname.split("/").filter(Boolean);
    var location_name = pathParts[pathParts.length - 1] || "";
    var isIndexPage = location_name === "index.html" || location_name === "" || pathParts.length === 0;
    
    // Default load - only if content is truly empty (comments/whitespace don't count)
    var contentElement = jQuery("#content");
    var contentHtml = contentElement.length ? contentElement.html().trim() : "";
    // Remove HTML comments
    var contentWithoutComments = contentHtml.replace(/<!--[\s\S]*?-->/g, '').trim();
    var isEmpty = !contentElement.length || contentWithoutComments === "";
    if (isIndexPage && isEmpty) {
        console.log("SPA: Loading home.html, isIndexPage:", isIndexPage, "content empty:", isEmpty);
        // Add cache-busting query to ensure latest HTML (and scripts) load
        jQuery("#content").load("html/pages/home.html?v=20251110", function(response, status, xhr){
            if (status === "error") {
                console.error("Failed to load home.html:", xhr && xhr.status, xhr && xhr.statusText);
                // Mark as failed for testing/diagnostics
                jQuery("#content").attr("data-content-loaded", "error");
                return;
            }
            // Mark content as loaded for testing
            jQuery("#content").attr("data-content-loaded", "true");
            // Reinitialize theme after content loads
            if (typeof window.reinitTheme === 'function') {
                window.reinitTheme();
            }
            // Reinitialize Bootstrap carousel to ensure its presence
            if (typeof jQuery.fn.carousel !== 'undefined') {
                jQuery('#homeCarousel').carousel();
            }
            // Re-apply translations after content loads
            if (typeof window.TranslationManager !== 'undefined') {
                window.TranslationManager.applyTranslations();
            }
            // Set active nav item
            updateActiveNavItem('html/pages/home.html');
        });
    } else {
        console.log("SPA: Skipping home.html load, isIndexPage:", isIndexPage, "content exists:", !isEmpty);
    }
    
    // Function to update active nav item based on current page
    function updateActiveNavItem(url) {
        // Remove active class from all nav items
        jQuery("li.nav-item").removeClass("active");
        
        // Map URLs to nav items
        var navMapping = {
            'html/pages/home.html': 'a[data-url="html/pages/home.html"]',
            'html/pages/projects.html': 'a[data-url="html/pages/projects.html"]',
            'html/pages/skills.html': 'a[data-url="html/pages/skills.html"]',
            'html/pages/docs.html': 'a[data-url="html/pages/docs.html"]',
            'html/pages/tutorials.html': 'a[data-url="html/pages/tutorials.html"]',
            'html/pages/Journal/index.html': 'a[data-url="html/pages/Journal/index.html"]'
        };
        
        // Find matching nav item and add active class
        for (var mappedUrl in navMapping) {
            if (url.includes(mappedUrl.split('/').pop()) || url === mappedUrl) {
                var selector = navMapping[mappedUrl];
                var navLink = jQuery(selector);
                if (navLink.length) {
                    navLink.closest('li.nav-item').addClass('active');
                    break;
                }
            }
        }
    }
    
    // Function to setup click handlers
    function setupClickHandlers() {
        // Use event delegation for dynamically loaded content
        jQuery(document).off('click', 'a.nav-link, a.dropdown-item, a.inline-load, a.navbar-brand-name');
        jQuery(document).on('click', 'a.nav-link, a.dropdown-item, a.inline-load, a.navbar-brand-name', function(e){
            e.preventDefault(); // Prevent default anchor behavior
            var sectionUrl = $(this).attr("data-url");
            // If no data-url but href points to index.html, load home page
            if (!sectionUrl && $(this).attr("href") === "index.html") {
                sectionUrl = "html/pages/home.html";
            }
            // Handle href="#Skills" or similar hash links
            if (!sectionUrl && $(this).attr("href") && $(this).attr("href").startsWith("#")) {
                var href = $(this).attr("href").substring(1);
                // Map hash to actual URL
                if (href === "Skills") {
                    sectionUrl = "html/pages/skills.html";
                } else if (href === "Projects") {
                    sectionUrl = "html/pages/projects.html";
                }
            }
            if(sectionUrl){
                // Append cache-busting param to force fresh fetch of HTML sections
                var bust = "v=20251110";
                if (sectionUrl.indexOf('?') === -1) {
                    sectionUrl = sectionUrl + "?" + bust;
                } else if (!sectionUrl.includes("v=")) {
                    sectionUrl = sectionUrl + "&" + bust;
                }
                // Reset projects initialization flag when loading projects page
                if (sectionUrl.includes('projects.html')) {
                    if (typeof window.resetProjectsInit === 'function') {
                        window.resetProjectsInit();
                    } else if (typeof window.projectsInitialized !== 'undefined') {
                        window.projectsInitialized = false;
                    }
                }
                // For tutorial pages, load only the body content (not full page redirect)
                if (sectionUrl.includes('/data/projects/')) {
                    // Load the entire page and extract body content
                    jQuery.get(sectionUrl, function(data) {
                        // Handle Jekyll markdown files (start with ---)
                        if (data.trim().startsWith('---')) {
                            // Skip frontmatter and use rest as content
                            var lines = data.split('\n');
                            var contentStart = -1;
                            for (var i = 0; i < lines.length; i++) {
                                if (lines[i].trim() === '---' && i > 0) {
                                    contentStart = i + 1;
                                    break;
                                }
                            }
                            if (contentStart > 0) {
                                data = lines.slice(contentStart).join('\n');
                            }
                        }
                        
                        var $temp = jQuery('<div>').html(data);
                        var bodyContent = $temp.find('body').html() || $temp.html();
                        // Only load if we got valid content
                        if (bodyContent && bodyContent.trim() !== '') {
                            // Remove any script tags that might cause redirects
                            var $contentDiv = jQuery('<div>').html(bodyContent);
                            $contentDiv.find('script').remove();
                            // Ensure all links with data-url get inline-load class
                            $contentDiv.find('a[data-url]').addClass('inline-load').attr('href', '#');
                            // Convert regular links to inline-load links if they point to data/projects
                            $contentDiv.find('a[href*="/data/projects/"]').each(function() {
                                var href = jQuery(this).attr('href');
                                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                                    jQuery(this).addClass('inline-load').attr('data-url', href).attr('href', '#');
                                }
                            });
                            // Convert any remaining relative links to prevent redirects
                            $contentDiv.find('a[href]:not([href^="#"]):not([href^="http"])').each(function() {
                                var href = jQuery(this).attr('href');
                                if (href && href.includes('/data/projects/')) {
                                    jQuery(this).addClass('inline-load').attr('data-url', href).attr('href', '#');
                                }
                            });
                            // Wrap content in container if not already wrapped
                            if (!$contentDiv.find('.container').length) {
                                var wrappedContent = '<div class="container">' + $contentDiv.html() + '</div>';
                                jQuery("#content").html(wrappedContent);
                            } else {
                                jQuery("#content").html($contentDiv.html());
                            }
                            console.log("Loaded " + sectionUrl);
                            // Mark content as loaded for testing
                            jQuery("#content").attr("data-content-loaded", "true");
                            // Reinitialize theme after content loads
                            if (typeof window.reinitTheme === 'function') {
                                window.reinitTheme();
                            }
                            // Reinitialize Bootstrap carousel if to ensure its presence
                            if (typeof jQuery.fn.carousel !== 'undefined') {
                                jQuery('#homeCarousel').carousel();
                            }
                            // Re-apply translations after content loads
                            if (typeof window.TranslationManager !== 'undefined') {
                                window.TranslationManager.applyTranslations();
                            }
                            // Re-setup click handlers for newly loaded content
                            setupClickHandlers();
                        } else {
                            console.error("Failed to load content from " + sectionUrl);
                        }
                    }).fail(function() {
                        console.error("Failed to fetch " + sectionUrl);
                    });
                } else {
                jQuery("#content").load(sectionUrl, function(response, status, xhr){
                    if (status === "error") {
                        console.error("Failed to load " + sectionUrl + ":", xhr && xhr.status, xhr && xhr.statusText);
                        jQuery("#content").attr("data-content-loaded", "error");
                        return;
                    }
                    console.log("Loaded " + sectionUrl);
                    // Mark content as loaded for testing
                    jQuery("#content").attr("data-content-loaded", "true");
                        // Reinitialize theme after content loads
                        if (typeof window.reinitTheme === 'function') {
                            window.reinitTheme();
                        }
                        // Reinitialize Bootstrap carousel if to ensure its presence
                        if (typeof jQuery.fn.carousel !== 'undefined') {
                            jQuery('#homeCarousel').carousel();
                        }
                        // Re-apply translations after content loads
                        if (typeof window.TranslationManager !== 'undefined') {
                            window.TranslationManager.applyTranslations();
                        }
                        // Update active nav item
                        updateActiveNavItem(sectionUrl);
                        // Re-setup click handlers for newly loaded content
                        setupClickHandlers();
                        // Load scripts if projects page
                        if (sectionUrl.includes('projects.html')) {
                            // Ensure projects.js runs after content is loaded
                            setTimeout(function() {
                                if (typeof initProjects === 'function' && !window.projectsInitialized) {
                                    initProjects();
                                }
                            }, 100);
                        }
                });
                }
            }
        });
    }
    
    // Setup click handlers initially
    setupClickHandlers();
});
