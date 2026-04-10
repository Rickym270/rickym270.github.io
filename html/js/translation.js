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
            
            var beforeScrollY = window.scrollY;
            this.isApplying = true;
            var mermaidNeedsRerender = false;
            // Only select elements with data-translate that don't have data-no-translate
            const elements = document.querySelectorAll('[data-translate]:not([data-no-translate])');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.t(key);
                const isMermaidPre = element.tagName === 'PRE' && element.classList.contains('mermaid');

                if (isMermaidPre) {
                    const hasRenderedSvg = !!element.querySelector('svg');
                    const nextSource = (translation || '').replace(/\\n/g, '\n');
                    const currentSource = element.dataset.mermaidSource || '';
                    const sourceChanged = currentSource !== nextSource;
                    if (sourceChanged || !hasRenderedSvg) {
                        if (element.textContent !== nextSource) {
                            element.textContent = nextSource;
                        }
                        element.dataset.mermaidSource = nextSource;
                        if (element.hasAttribute('data-processed')) {
                            element.removeAttribute('data-processed');
                        }
                        mermaidNeedsRerender = true;
                    }
                    return;
                }
                
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
                    if (element.innerHTML !== translation) {
                        element.innerHTML = translation;
                    }
                } else {
                    if (element.tagName === 'CODE' && element.closest('pre')) {
                        const codeTranslation = (translation || '').replace(/\\n/g, '\n');
                        if (element.textContent !== codeTranslation) {
                            element.textContent = codeTranslation;
                        }
                    }
                    else
                    // For mobile nav items, preserve icon spans
                    if (element.classList.contains('mobile-nav-item')) {
                        const iconSpan = element.querySelector('.mobile-nav-icon');
                        const labelSpan = element.querySelector('.mobile-nav-label');
                        if (iconSpan && labelSpan) {
                            // Only update the label, preserve the icon
                            labelSpan.textContent = translation;
                        } else {
                            if (element.textContent !== translation) {
                                element.textContent = translation;
                            }
                        }
                    }
                    // For labels, preserve HTML like <span class="text-danger">*</span>
                    else if (element.tagName === 'LABEL' && element.innerHTML.includes('<')) {
                        const htmlContent = element.innerHTML;
                        // Extract text before first HTML tag and the HTML part
                        const parts = htmlContent.split(/(<[^>]*>)/);
                        if (parts.length > 1) {
                            // Find the first text part (before any HTML)
                            const textPart = parts[0].trim();
                            // Reconstruct with translation replacing the text part
                            const htmlPart = parts.slice(1).join(''); // Everything after first text
                            const nextHtml = translation + ' ' + htmlPart;
                            if (element.innerHTML !== nextHtml) {
                                element.innerHTML = nextHtml;
                            }
                        } else {
                            if (element.textContent !== translation) {
                                element.textContent = translation;
                            }
                        }
                    } else {
                        if (element.textContent !== translation) {
                            element.textContent = translation;
                        }
                    }
                }
            });

            const aiGuide = document.querySelector('[data-testid="ai-tutorial-guide"]');
            if (aiGuide) {
                const hasRenderedMermaid = aiGuide.querySelectorAll('.mermaid svg').length > 0;
                // #region agent log
                fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'pre-fix-mermaid',hypothesisId:'M1',location:'html/js/translation.js:applyTranslations',message:'mermaid gate state in translation pass',data:{hasRenderedMermaid:hasRenderedMermaid,initRequested:!!aiGuide.dataset.mermaidInitRequested,mermaidPreCount:aiGuide.querySelectorAll('.mermaid').length,svgCount:aiGuide.querySelectorAll('.mermaid svg').length},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                // #region agent log
                fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'post-fix-mermaid',hypothesisId:'M4',location:'html/js/translation.js:applyTranslations',message:'mermaid translation mutation state',data:{mermaidNeedsRerender:mermaidNeedsRerender,initRequested:!!aiGuide.dataset.mermaidInitRequested},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                if (hasRenderedMermaid) {
                    delete aiGuide.dataset.mermaidInitRequested;
                }
                if ((!aiGuide.dataset.mermaidInitRequested || mermaidNeedsRerender) && typeof window.initMermaidInContent === 'function') {
                    aiGuide.dataset.mermaidInitRequested = 'true';
                    // #region agent log
                    fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'pre-fix-mermaid',hypothesisId:'M1',location:'html/js/translation.js:applyTranslations',message:'triggering initMermaidInContent from translation pass',data:{initRequestedNow:true},timestamp:Date.now()})}).catch(()=>{});
                    // #endregion
                    window.initMermaidInContent(aiGuide);
                }
            }
            
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
                const translatedTitle = this.t(titleKey);
                if (document.title !== translatedTitle) {
                    document.title = translatedTitle;
                }
            }
            
            // Update element title attributes (tooltips) with data-translate-title
            const tooltipElements = document.querySelectorAll('[data-translate-title]:not(html):not(head):not(title)');
            tooltipElements.forEach(element => {
                const titleKey = element.getAttribute('data-translate-title');
                if (titleKey) {
                    const translation = this.t(titleKey);
                    if (element.getAttribute('title') !== translation) {
                        element.setAttribute('title', translation);
                    }
                }
            });
            // #region agent log
            fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'pre-fix',hypothesisId:'H4',location:'html/js/translation.js:applyTranslations',message:'translation pass scroll delta',data:{beforeScrollY:beforeScrollY,afterScrollY:window.scrollY,language:this.currentLanguage,elementsCount:elements.length},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            
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
            const switcherMedium = document.getElementById('language-switcher-medium');
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
            
            // Update medium screen language switcher
            if (switcherMedium) {
                const buttonsMedium = switcherMedium.querySelectorAll('button[data-lang]');
                buttonsMedium.forEach(btn => {
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

            // Update footer language switcher
            const footerSwitcher = document.getElementById('language-switcher-footer');
            if (footerSwitcher) {
                const footerButtons = footerSwitcher.querySelectorAll('button[data-lang]');
                footerButtons.forEach(btn => {
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

