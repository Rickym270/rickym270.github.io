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
        var runnableNodes = Array.prototype.filter.call(nodes, function (node) {
            // Skip nodes that are already rendered (contain SVG output).
            return !node.querySelector('svg');
        });
        // #region agent log
        fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'post-fix-mermaid',hypothesisId:'M2',location:'html/js/mermaid-init.js:initMermaidInContent',message:'initMermaidInContent called',data:{nodeCount:nodes.length,runnableNodeCount:runnableNodes.length,hasGlobalMermaid:typeof window.mermaid!=='undefined'},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (!runnableNodes.length) {
            return Promise.resolve();
        }
        return loadMermaidIfNeeded()
            .then(function () {
                if (typeof window.mermaid === 'undefined') {
                    // #region agent log
                    fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'pre-fix-mermaid',hypothesisId:'M2',location:'html/js/mermaid-init.js:initMermaidInContent',message:'mermaid global missing after load',data:{},timestamp:Date.now()})}).catch(()=>{});
                    // #endregion
                    return;
                }
                Array.prototype.forEach.call(runnableNodes, function (node) {
                    node.removeAttribute('data-processed');
                });
                window.mermaid.initialize({
                    startOnLoad: false,
                    theme: getMermaidTheme(),
                    securityLevel: 'loose'
                });
                return window.mermaid.run({ nodes: runnableNodes });
            })
            .then(function () {
                // #region agent log
                fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'post-fix-mermaid',hypothesisId:'M3',location:'html/js/mermaid-init.js:initMermaidInContent',message:'mermaid run completed',data:{svgCount:root.querySelectorAll('.mermaid svg').length,processedCount:root.querySelectorAll('.mermaid[data-processed=\"true\"]').length},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
            })
            .catch(function (e) {
                console.warn('[Mermaid]', e);
                if (root && root.dataset) {
                    delete root.dataset.mermaidInitRequested;
                }
                // #region agent log
                fetch('http://127.0.0.1:7570/ingest/660eb9fa-1c39-4eb4-b364-3570247d54f6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'174fcc'},body:JSON.stringify({sessionId:'174fcc',runId:'post-fix-mermaid',hypothesisId:'M3',location:'html/js/mermaid-init.js:initMermaidInContent',message:'mermaid run error',data:{errorMessage:e&&e.message?e.message:String(e),clearedInitRequested:true},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
            });
    };
})();
