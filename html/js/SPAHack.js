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
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
    } else {
        console.log("SPA: Skipping home.html load, isIndexPage:", isIndexPage, "content exists:", !isEmpty);
    }
    
    // Function to update active nav item based on current page
    // Make it globally accessible
    window.updateActiveNavItem = function updateActiveNavItem(url) {
        // Remove active class from all nav items (desktop and mobile)
        jQuery("li.nav-item").removeClass("active");
        jQuery(".mobile-nav-item, .mobile-nav-subitem").removeClass("active");
        
        // Map URLs to nav items
        var navMapping = {
            'html/pages/home.html': 'a[data-url="html/pages/home.html"]',
            'html/pages/projects.html': 'a[data-url="html/pages/projects.html"]',
            'html/pages/skills.html': 'a[data-url="html/pages/skills.html"]',
            'html/pages/docs.html': 'a[data-url="html/pages/docs.html"]',
            'html/pages/tutorials.html': 'a[data-url="html/pages/tutorials.html"]',
            'html/pages/engineering.html': 'a[data-url="html/pages/engineering.html"]',
            'html/pages/lifestyle.html': 'a[data-url="html/pages/lifestyle.html"]'
        };
        
        // Special handling for dropdown items (Docs > Notes, Blog > Engineering/Personal)
        var dropdownMapping = {
            'html/pages/docs.html': {
                dropdownParent: '#navbarDropdownDocs, #navbarDropdownDocsMedium',
                dropdownToggle: '#navbarDropdownMenuLink, #navbarDropdownMenuLinkMedium'
            },
            'html/pages/tutorials.html': {
                dropdownParent: '#navbarDropdownDocs, #navbarDropdownDocsMedium',
                dropdownToggle: '#navbarDropdownMenuLink, #navbarDropdownMenuLinkMedium'
            },
            'html/pages/engineering.html': {
                dropdownParent: '#navbarDropdownBlog',
                dropdownToggle: '#navbarDropdownBlogLink, #navbarDropdownBlogLinkMedium'
            },
            'html/pages/lifestyle.html': {
                dropdownParent: '#navbarDropdownBlog',
                dropdownToggle: '#navbarDropdownBlogLink, #navbarDropdownBlogLinkMedium'
            }
        };
        
        // Remove nav-link-active from all nav links (Blog active underline)
        jQuery('.nav-link, .dropdown-toggle').removeClass('nav-link-active');
        
        // Find matching nav item and add active class
        for (var mappedUrl in navMapping) {
            if (url.includes(mappedUrl.split('/').pop()) || url === mappedUrl) {
                var selector = navMapping[mappedUrl];
                var navLink = jQuery(selector);
                
                // Check if this is a dropdown item that needs special handling
                if (dropdownMapping[mappedUrl] && navLink.hasClass('dropdown-item')) {
                    // For dropdown items, highlight the parent dropdown instead
                    var dropdownParent = jQuery(dropdownMapping[mappedUrl].dropdownParent);
                    var dropdownToggle = jQuery(dropdownMapping[mappedUrl].dropdownToggle);
                    
                    // Remove active from dropdown-item to prevent it from being highlighted
                    navLink.removeClass('active');
                    
                    // Add active to the parent dropdown li
                    if (dropdownParent.length) {
                        dropdownParent.addClass('active');
                    }
                    // Also ensure the dropdown-toggle link gets active styling
                    if (dropdownToggle.length) {
                        dropdownToggle.addClass('active');
                        dropdownToggle.closest('li.nav-item').addClass('active');
                        // Blog dropdown: add nav-link-active (blue underline) when on Engineering/Personal
                        if (mappedUrl === 'html/pages/engineering.html' || mappedUrl === 'html/pages/lifestyle.html') {
                            dropdownToggle.addClass('nav-link-active');
                        }
                        // Docs dropdown: add nav-link-active when on Notes/Tutorials
                        if (mappedUrl === 'html/pages/docs.html' || mappedUrl === 'html/pages/tutorials.html') {
                            dropdownToggle.addClass('nav-link-active');
                        }
                    }
                } else if (navLink.length) {
                    // Regular nav item - highlight normally
                    navLink.closest('li.nav-item').addClass('active');
                    navLink.addClass('active');
                }
                
                // Update mobile sidebar (always use the direct link)
                if (!navLink.hasClass('dropdown-item')) {
                    navLink.addClass('active');
                }
                break;
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
                            // Move focus to main content for keyboard/screen reader users
                            var mainEl = document.getElementById('content');
                            if (mainEl && mainEl.getAttribute('tabindex') === '-1') {
                                mainEl.focus({ preventScroll: false });
                            }
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
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            if (typeof window.initMermaidInContent === 'function' && document.getElementById('content') && document.getElementById('content').querySelector('.mermaid')) {
                                window.requestAnimationFrame(function () {
                                    window.initMermaidInContent(document.getElementById('content'));
                                });
                            }
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
                    // Build blog pills synchronously so they exist before any test or user interaction (avoids 50ms timer race on slow devices)
                    if (sectionUrl.includes('engineering.html') || sectionUrl.includes('lifestyle.html')) {
                        if (typeof window.initBlogCategoryPills === 'function') {
                            window.initBlogCategoryPills();
                        }
                    }
                    // Move focus to main content for keyboard/screen reader users
                    var mainEl = document.getElementById('content');
                    if (mainEl && mainEl.getAttribute('tabindex') === '-1') {
                        mainEl.focus({ preventScroll: false });
                    }
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
                            // Add a small delay to ensure DOM is fully updated
                            setTimeout(() => {
                                window.TranslationManager.applyTranslations();
                                // When posts are loaded via SPA, inline scripts inside the HTML won't run.
                                // Compute reading time for any post that includes these IDs.
                                var postBody = document.getElementById('post-body');
                                var readingTimeNum = document.getElementById('reading-time-num');
                                if (postBody && readingTimeNum) {
                                    var override = postBody.getAttribute('data-read-mins-override');
                                    if (override && /^\d+$/.test(override.trim())) {
                                        readingTimeNum.textContent = String(parseInt(override, 10));
                                    } else {
                                        var text = postBody.innerText || postBody.textContent || '';
                                        var words = text.trim().split(/\s+/).filter(Boolean).length;
                                        var mins = Math.max(1, Math.ceil(words / 200));
                                        readingTimeNum.textContent = mins;
                                    }
                                }
                                if (sectionUrl.includes('engineering.html') || sectionUrl.includes('lifestyle.html')) {
                                    if (typeof window.initBlogCategoryPills === 'function') {
                                        window.initBlogCategoryPills();
                                    }
                                }
                                if (sectionUrl.includes('engineering.html') && typeof window.syncEngineeringFeaturedFromNewestCard === 'function') {
                                    window.syncEngineeringFeaturedFromNewestCard();
                                }
                            }, 50);
                        }
                        // Update active nav item
                        // Update active nav items
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
                        // Initialize docs page functionality if docs page
                        if (sectionUrl.includes('docs.html')) {
                            // Ensure docs page initialization runs after SPA load
                            setTimeout(function() {
                                if (typeof window.initDocsPage === 'function') {
                                    window.initDocsPage();
                                }
                            }, 200);
                        }
                        // Reset scroll to top after load (run after focus/layout so we win)
                        setTimeout(function() { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }, 0);
                });
                }
            }
        });
    }
    
    // Setup click handlers initially
    setupClickHandlers();
    
    // Prevent text selection on skill badges globally
    // Use event delegation to handle dynamically loaded content
    document.addEventListener('mousedown', function(e) {
        // Check if target is an Element and has closest method
        if (e.target && e.target.nodeType === Node.ELEMENT_NODE && e.target.closest) {
        if (e.target.closest('.skill-badge')) {
            e.preventDefault();
            }
        }
    }, { passive: false });
    
    document.addEventListener('selectstart', function(e) {
        // Check if target is an Element and has closest method
        if (e.target && e.target.nodeType === Node.ELEMENT_NODE && e.target.closest) {
        if (e.target.closest('.skill-badge')) {
            e.preventDefault();
            }
        }
    });
});
