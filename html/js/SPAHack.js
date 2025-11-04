$(document).ready(function(){
    // Prevent double initialization - only run default load once per page load
    if (typeof window.spaInitialized !== 'undefined') {
        return; // Already initialized, don't run again
    }
    window.spaInitialized = true;
    
    var location_name = location.href.split("/")[3];
    
    // Default load - only if content is empty (initial page load)
    if ((location_name == "index.html" || location_name == "") && jQuery("#content").html().trim() === "") {
        jQuery("#content").load("html/pages/home.html", function(){
            // Reinitialize theme after content loads
            if (typeof window.reinitTheme === 'function') {
                window.reinitTheme();
            }
            // Reinitialize Bootstrap carousel to ensure its presence
            if (typeof jQuery.fn.carousel !== 'undefined') {
                jQuery('#homeCarousel').carousel();
            }
        });
    }
    
    // Function to setup click handlers
    function setupClickHandlers() {
        // Use event delegation for dynamically loaded content
        jQuery(document).off('click', 'a.nav-link, a.dropdown-item, a.inline-load');
        jQuery(document).on('click', 'a.nav-link, a.dropdown-item, a.inline-load', function(e){
            e.preventDefault(); // Prevent default anchor behavior
            var sectionUrl = $(this).attr("data-url");
            // If no data-url but href points to index.html, load home page
            if (!sectionUrl && $(this).attr("href") === "index.html") {
                sectionUrl = "html/pages/home.html";
            }
            if(sectionUrl){
                // Reset projects initialization flag when loading projects page
                if (sectionUrl.includes('projects.html') && typeof window.projectsInitialized !== 'undefined') {
                    window.projectsInitialized = false;
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
                            // Reinitialize theme after content loads
                            if (typeof window.reinitTheme === 'function') {
                                window.reinitTheme();
                            }
                            // Reinitialize Bootstrap carousel if to ensure its presence
                            if (typeof jQuery.fn.carousel !== 'undefined') {
                                jQuery('#homeCarousel').carousel();
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
                    jQuery("#content").load(sectionUrl, function(){
                        console.log("Loaded " + sectionUrl);
                        // Reinitialize theme after content loads
                        if (typeof window.reinitTheme === 'function') {
                            window.reinitTheme();
                        }
                        // Reinitialize Bootstrap carousel if to ensure its presence
                        if (typeof jQuery.fn.carousel !== 'undefined') {
                            jQuery('#homeCarousel').carousel();
                        }
                        // Re-setup click handlers for newly loaded content
                        setupClickHandlers();
                    });
                }
            }
        });
    }
    
    // Setup click handlers initially
    setupClickHandlers();
});
