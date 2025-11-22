/**
 * Theme Toggle - Dark Mode Support
 * Respects system preference and allows manual override
 * Works with dynamically loaded content (SPA)
 */

(function() {
    const THEME_KEY = 'portfolio-theme';
    let themeToggle = null;
    let themeIcon = null;
    const html = document.documentElement;
    
    // Get initial theme preference
    function getInitialTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            return savedTheme;
        }
        // Fall back to system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // Apply theme
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        // Update icon (find it again in case DOM changed)
        themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Update mobile theme icon
        const mobileThemeIcon = document.getElementById('mobile-theme-icon');
        if (mobileThemeIcon) {
            mobileThemeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // Toggle theme
    function toggleTheme(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const currentTheme = html.getAttribute('data-theme') || getInitialTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }
    
    // Set up toggle button (can be called multiple times for dynamic content)
    function setupToggleButton() {
        // Remove old listeners if any
        if (themeToggle) {
            themeToggle.removeEventListener('click', toggleTheme);
        }
        
        // Find toggle button again
        themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }
    
    // Initialize theme on page load
    function initTheme() {
        const theme = getInitialTheme();
        setTheme(theme);
        setupToggleButton();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            // Remove old listener if exists
            if (window._themeMediaQuery) {
                window._themeMediaQuery.removeEventListener('change', window._themeMediaHandler);
            }
            
            window._themeMediaHandler = (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem(THEME_KEY)) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            };
            mediaQuery.addEventListener('change', window._themeMediaHandler);
            window._themeMediaQuery = mediaQuery;
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Use event delegation for the toggle button (works even if button is dynamically added)
    document.addEventListener('click', function(e) {
        const target = e.target;
        // Check if click is on the desktop button or its children
        if (target && (
            target.id === 'theme-toggle' || 
            target.id === 'theme-icon' ||
            (target.parentElement && target.parentElement.id === 'theme-toggle')
        )) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(e);
        }
        // Check if click is on the mobile button or its children
        if (target && (
            target.id === 'mobile-theme-toggle' || 
            target.id === 'mobile-theme-icon' ||
            (target.parentElement && target.parentElement.id === 'mobile-theme-toggle')
        )) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(e);
        }
    });
    
    // Re-setup toggle button when content is dynamically loaded (for SPA)
    // This is called after jQuery .load() completes
    if (typeof jQuery !== 'undefined') {
        // Also listen for content loaded in #content
        const observer = new MutationObserver(function(mutations) {
            setupToggleButton();
        });
        
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            observer.observe(contentDiv, { childList: true, subtree: true });
        }
        
        // Also setup after jQuery load completes
        const originalLoad = jQuery.fn.load;
        jQuery.fn.load = function(url, data, callback) {
            const self = this;
            const newCallback = function() {
                if (typeof callback === 'function') {
                    callback.apply(this, arguments);
                }
                setTimeout(setupToggleButton, 50);
            };
            return originalLoad.call(self, url, data, newCallback);
        };
    }
    
    // Export for manual re-initialization if needed
    window.reinitTheme = initTheme;
})();

