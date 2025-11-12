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
                
                // Listen for dynamically loaded content
                const observer = new MutationObserver(() => {
                    // Re-apply translations when new content is added
                    this.applyTranslations();
                });
                
                // Observe the content area for changes
                const contentArea = document.getElementById('content') || document.body;
                observer.observe(contentArea, {
                    childList: true,
                    subtree: true
                });
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
            const elements = document.querySelectorAll('[data-translate]');
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
                        const textMatch = htmlContent.match(/^([^<]*)/);
                        if (textMatch) {
                            const beforeTag = textMatch[1];
                            element.innerHTML = htmlContent.replace(beforeTag, translation);
                        } else {
                            element.textContent = translation;
                        }
                    } else {
                        element.textContent = translation;
                    }
                }
            });

            // Update page title if it has data-translate-title
            const titleElement = document.querySelector('[data-translate-title]');
            if (titleElement) {
                const titleKey = titleElement.getAttribute('data-translate-title');
                document.title = this.t(titleKey);
            }
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

