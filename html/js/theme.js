/**
 * Theme Toggle - Dark Mode Support
 * Respects system preference and allows manual override
 * Works with dynamically loaded content (SPA)
 */

(function() {
    const THEME_KEY = 'portfolio-theme';
    let themeToggle = null;
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
        
        // Update highlight.js theme
        const hljsThemeLight = document.getElementById('hljs-theme-light');
        const hljsThemeDark = document.getElementById('hljs-theme-dark');
        if (hljsThemeLight && hljsThemeDark) {
            if (theme === 'dark') {
                hljsThemeLight.media = 'none';
                hljsThemeDark.media = 'all';
            } else {
                hljsThemeLight.media = 'all';
                hljsThemeDark.media = 'none';
            }
        }
        
        // Update icons: light mode = sun (light_mode), dark mode = yellow sun (wb_sunny) per reference
        const themeIconSun = document.getElementById('theme-icon-sun');
        const themeIconSunny = document.getElementById('theme-icon-sunny');
        const themeIconSunMedium = document.getElementById('theme-icon-sun-medium');
        const themeIconSunnyMedium = document.getElementById('theme-icon-sunny-medium');
        const showSun = theme === 'light';
        const showSunny = theme === 'dark';
        if (themeIconSun) {
            themeIconSun.classList.toggle('hidden', !showSun);
        }
        if (themeIconSunny) {
            themeIconSunny.classList.toggle('hidden', !showSunny);
        }
        if (themeIconSunMedium) {
            themeIconSunMedium.classList.toggle('hidden', !showSun);
        }
        if (themeIconSunnyMedium) {
            themeIconSunnyMedium.classList.toggle('hidden', !showSunny);
        }
        
        // Update mobile theme toggle switch (aria-checked: dark = on)
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
        }
        // Update footer theme icons
        const themeIconSunFooter = document.getElementById('theme-icon-sun-footer');
        const themeIconSunnyFooter = document.getElementById('theme-icon-sunny-footer');
        if (themeIconSunFooter) themeIconSunFooter.classList.toggle('hidden', !showSun);
        if (themeIconSunnyFooter) themeIconSunnyFooter.classList.toggle('hidden', !showSunny);
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
        const themeToggleMedium = document.getElementById('theme-toggle-medium');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        if (themeToggleMedium) {
            themeToggleMedium.addEventListener('click', toggleTheme);
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
            target.id === 'theme-icon-sun' ||
            target.id === 'theme-icon-sunny' ||
            (target.parentElement && target.parentElement.id === 'theme-toggle')
        )) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(e);
        }
        // Check if click is on the medium screen button or its children
        if (target && (
            target.id === 'theme-toggle-medium' || 
            target.id === 'theme-icon-sun-medium' ||
            target.id === 'theme-icon-sunny-medium' ||
            target.classList.contains('theme-icon-medium') ||
            (target.parentElement && target.parentElement.id === 'theme-toggle-medium')
        )) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(e);
        }
        // Check if click is on the mobile theme switch or its children (track/knob)
        const mobileThemeEl = target && target.closest ? target.closest('#mobile-theme-toggle') : null;
        if (mobileThemeEl) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(e);
        }
        // Check if click is on the footer theme button or its children
        if (target && (
            target.id === 'theme-toggle-footer' ||
            target.id === 'theme-icon-sun-footer' ||
            target.id === 'theme-icon-sunny-footer' ||
            (target.parentElement && target.parentElement.id === 'theme-toggle-footer')
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

    // --- Reduced motion & reset preferences (footer) ---
    const REDUCED_MOTION_KEY = 'portfolio-reduced-motion';

    function getReducedMotionPreference() {
        const saved = localStorage.getItem(REDUCED_MOTION_KEY);
        if (saved === 'true' || saved === 'false') return saved === 'true';
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
        return false;
    }

    function setReducedMotion(value) {
        localStorage.setItem(REDUCED_MOTION_KEY, value ? 'true' : 'false');
        html.setAttribute('data-reduced-motion', value ? 'true' : 'false');
        const btn = document.getElementById('reduced-motion-toggle');
        if (btn) {
            btn.setAttribute('aria-pressed', value ? 'true' : 'false');
            btn.textContent = value ? 'Motion on' : 'Reduce motion';
        }
        const mobileBtn = document.getElementById('mobile-reduced-motion-toggle');
        if (mobileBtn) {
            mobileBtn.setAttribute('aria-pressed', value ? 'true' : 'false');
        }
    }

    function initReducedMotion() {
        const value = getReducedMotionPreference();
        html.setAttribute('data-reduced-motion', value ? 'true' : 'false');
        const btn = document.getElementById('reduced-motion-toggle');
        if (btn) {
            btn.setAttribute('aria-pressed', value ? 'true' : 'false');
            btn.textContent = value ? 'Motion on' : 'Reduce motion';
        }
        const mobileBtn = document.getElementById('mobile-reduced-motion-toggle');
        if (mobileBtn) {
            mobileBtn.setAttribute('aria-pressed', value ? 'true' : 'false');
        }
    }

    function runResetPreferences() {
        localStorage.removeItem(THEME_KEY);
        localStorage.removeItem('siteLanguage');
        localStorage.removeItem(REDUCED_MOTION_KEY);
        setTheme('light');
        setReducedMotion(false);
        if (typeof window.TranslationManager !== 'undefined' && window.TranslationManager.switchLanguage) {
            window.TranslationManager.switchLanguage('en');
        }
    }

    function initResetPreferences() {
        const btn = document.getElementById('reset-preferences');
        if (btn) {
            btn.addEventListener('click', runResetPreferences);
        }
        const mobileBtn = document.getElementById('mobile-reset-preferences');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', runResetPreferences);
        }
    }

    function initBackToTop() {
        const link = document.getElementById('footer-back-to-top');
        if (!link) return;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.addEventListener('click', function(e) {
        const target = e.target.closest ? e.target.closest('#reduced-motion-toggle, #mobile-reduced-motion-toggle') : (e.target.id === 'reduced-motion-toggle' || e.target.id === 'mobile-reduced-motion-toggle' ? e.target : null);
        if (target) {
            e.preventDefault();
            const current = html.getAttribute('data-reduced-motion') === 'true';
            setReducedMotion(!current);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initReducedMotion();
            initResetPreferences();
            initBackToTop();
        });
    } else {
        initReducedMotion();
        initResetPreferences();
        initBackToTop();
    }
})();

