/**
 * Translation module for the site
 * Handles loading translations and applying them to elements with data-translate attributes
 */

(function() {
    'use strict';

    const TranslationManager = {
        currentLanguage: 'en',
        translations: {},
        loadedLanguages: new Set(),
        isApplying: false,
        observerTimeout: null,

        /**
         * Initialize translation system
         */
        init: function() {
            // Get saved language preference or default to browser language
            const savedLang = localStorage.getItem('siteLanguage');
            const browserLang = navigator.language.split('-')[0];
            const defaultLang = savedLang || (browserLang === 'es' ? 'es' : 'en');
            
            this.currentLanguage = defaultLang;
            this.loadLanguage(defaultLang).then(() => {
                this.applyTranslations();
                this.updateLanguageSwitcher();
                
                // Listen for dynamically loaded content with debouncing
                const observer = new MutationObserver(() => {
                    // Debounce to prevent infinite loops
                    if (this.observerTimeout) {
                        clearTimeout(this.observerTimeout);
                    }
                    this.observerTimeout = setTimeout(() => {
                        if (!this.isApplying) {
                            this.applyTranslations();
                        }
                    }, 100);
                });
                
                // Observe the content area for changes
                const contentArea = document.getElementById('content') || document.body;
                if (contentArea) {
                    observer.observe(contentArea, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        },

        /**
         * Load translation file for a language
         */
        loadLanguage: function(lang) {
            if (this.loadedLanguages.has(lang)) {
                return Promise.resolve();
            }

            return fetch(`/html/js/translations/${lang}.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${lang} translations`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.translations[lang] = data;
                    this.loadedLanguages.add(lang);
                })
                .catch(error => {
                    console.error(`Error loading ${lang} translations:`, error);
                    // Fallback to English if translation fails
                    if (lang !== 'en') {
                        return this.loadLanguage('en');
                    }
                });
        },

        /**
         * Get translation for a key
         */
        t: function(key) {
            const keys = key.split('.');
            let value = this.translations[this.currentLanguage];
            
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    // Fallback to English if key not found
                    if (this.currentLanguage !== 'en' && this.translations.en) {
                        value = this.translations.en;
                        for (const k2 of keys) {
                            if (value && typeof value === 'object' && k2 in value) {
                                value = value[k2];
                            } else {
                                return key; // Return key if translation not found
                            }
                        }
                    } else {
                        return key; // Return key if translation not found
                    }
                    break;
                }
            }
            
            return typeof value === 'string' ? value : key;
        },

        /**
         * Apply translations to all elements with data-translate attribute
         */
        applyTranslations: function() {
            // Prevent recursive calls
            if (this.isApplying) {
                return;
            }
            
            this.isApplying = true;
            // Only select elements with data-translate that don't have data-no-translate
            const elements = document.querySelectorAll('[data-translate]:not([data-no-translate])');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.t(key);
                
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    const placeholder = element.getAttribute('data-translate-placeholder');
                    if (placeholder) {
                        element.placeholder = this.t(placeholder);
                    }
                    // Also translate the text content if it's a button
                    if (element.tagName === 'BUTTON' || element.type === 'submit') {
                        // Don't change text content for inputs/textarea, only placeholders
                    }
                } else if (element.hasAttribute('data-translate-html')) {
                    element.innerHTML = translation;
                } else {
                    // For labels, preserve HTML like <span class="text-danger">*</span>
                    if (element.tagName === 'LABEL' && element.innerHTML.includes('<')) {
                        const htmlContent = element.innerHTML;
                        // Extract text before first HTML tag and the HTML part
                        const parts = htmlContent.split(/(<[^>]*>)/);
                        if (parts.length > 1) {
                            // Find the first text part (before any HTML)
                            const textPart = parts[0].trim();
                            // Reconstruct with translation replacing the text part
                            const htmlPart = parts.slice(1).join(''); // Everything after first text
                            element.innerHTML = translation + ' ' + htmlPart;
                        } else {
                            element.textContent = translation;
                        }
                    } else {
                        element.textContent = translation;
                    }
                }
            });
            
            // Also process elements that only have data-translate-placeholder (inputs/textarea without data-translate)
            const placeholderElements = document.querySelectorAll('[data-translate-placeholder]:not([data-translate])');
            placeholderElements.forEach(element => {
                const placeholderKey = element.getAttribute('data-translate-placeholder');
                if (placeholderKey && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                    element.placeholder = this.t(placeholderKey);
                }
            });

            // Update page title if it has data-translate-title
            const titleElement = document.querySelector('[data-translate-title]');
            if (titleElement) {
                const titleKey = titleElement.getAttribute('data-translate-title');
                document.title = this.t(titleKey);
            }
            
            this.isApplying = false;
        },

        /**
         * Switch to a different language
         */
        switchLanguage: function(lang) {
            if (lang === this.currentLanguage) {
                return Promise.resolve();
            }

            return this.loadLanguage(lang).then(() => {
                this.currentLanguage = lang;
                localStorage.setItem('siteLanguage', lang);
                this.applyTranslations();
                this.updateLanguageSwitcher();
                
                // Dispatch custom event for other scripts to listen to
                document.dispatchEvent(new CustomEvent('languageChanged', { 
                    detail: { language: lang } 
                }));
            });
        },

        /**
         * Update language switcher UI
         */
        updateLanguageSwitcher: function() {
            // Update desktop language switcher
            const switcher = document.getElementById('language-switcher');
            if (switcher) {
                const buttons = switcher.querySelectorAll('button[data-lang]');
                buttons.forEach(btn => {
                    const btnLang = btn.getAttribute('data-lang');
                    if (btnLang === this.currentLanguage) {
                        btn.classList.add('active');
                        btn.setAttribute('aria-pressed', 'true');
                    } else {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    }
                });
            }
            
            // Update mobile language switcher
            const mobileSwitcher = document.getElementById('mobile-language-switcher');
            if (mobileSwitcher) {
                const mobileButtons = mobileSwitcher.querySelectorAll('button[data-lang]');
                mobileButtons.forEach(btn => {
                    const btnLang = btn.getAttribute('data-lang');
                    if (btnLang === this.currentLanguage) {
                        btn.classList.add('active');
                        btn.setAttribute('aria-pressed', 'true');
                    } else {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    }
                });
            }
        }
    };

    // Expose to global scope
    window.TranslationManager = TranslationManager;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TranslationManager.init());
    } else {
        TranslationManager.init();
    }

    // Re-apply translations when SPA content loads
    document.addEventListener('contentLoaded', () => {
        TranslationManager.applyTranslations();
    });
})();

