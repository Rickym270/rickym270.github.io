/**
 * Mermaid: lazy CDN load, theme from data-theme, render .mermaid inside SPA #content or a given root.
 */
(function () {
    var MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
    var loadPromise = null;

    function loadMermaidIfNeeded() {
        if (typeof window.mermaid !== 'undefined') {
            return Promise.resolve();
        }
        if (loadPromise) {
            return loadPromise;
        }
        loadPromise = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = MERMAID_CDN;
            s.async = true;
            s.onload = function () {
                resolve();
            };
            s.onerror = function () {
                loadPromise = null;
                reject(new Error('Failed to load Mermaid'));
            };
            document.head.appendChild(s);
        });
        return loadPromise;
    }

    function getMermaidTheme() {
        var t = document.documentElement.getAttribute('data-theme');
        return t === 'dark' ? 'dark' : 'default';
    }

    /**
     * @param {ParentNode | Document | null} [root]
     * @returns {Promise<void>}
     */
    window.initMermaidInContent = function initMermaidInContent(root) {
        root = root || document.getElementById('content') || document.body;
        if (!root || !root.querySelectorAll) {
            return Promise.resolve();
        }
        var nodes = root.querySelectorAll('.mermaid');
        if (!nodes.length) {
            return Promise.resolve();
        }
        return loadMermaidIfNeeded()
            .then(function () {
                if (typeof window.mermaid === 'undefined') {
                    return;
                }
                window.mermaid.initialize({
                    startOnLoad: false,
                    theme: getMermaidTheme(),
                    securityLevel: 'loose'
                });
                return window.mermaid.run({ nodes: nodes });
            })
            .catch(function (e) {
                console.warn('[Mermaid]', e);
            });
    };
})();
