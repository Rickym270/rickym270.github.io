/**
 * Blog semantic search: debounced input, GET /api/search, show/hide cards by data-article-id.
 * Call initBlogSearch() when .blog-insights-section is in the DOM (e.g. after SPA load of engineering.html).
 */
(function () {
    'use strict';

    var DEBOUNCE_MS = 300;

    function getApiBaseUrl() {
        if (typeof window !== 'undefined' && window.API_BASE_URL) {
            return window.API_BASE_URL;
        }
        try {
            var isLocal = window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            return isLocal ? 'http://localhost:8080' : 'https://rickym270-github-io.onrender.com';
        } catch (e) {
            return 'http://localhost:8080';
        }
    }

    function showAllCards(section) {
        var grid = section.querySelector('.blog-cards-grid');
        if (!grid) return;
        var cards = grid.querySelectorAll('.blog-card');
        cards.forEach(function (card) {
            card.style.removeProperty('display');
        });
        var noResults = section.querySelector('.blog-search-no-results');
        if (noResults) noResults.style.setProperty('display', 'none');
    }

    function applySearchResults(section, resultIds, hasQuery) {
        var grid = section ? section.querySelector('.blog-cards-grid') : null;
        var noResultsEl = section ? section.querySelector('.blog-search-no-results') : null;
        if (!grid) return;

        var idSet = new Set(resultIds || []);

        grid.querySelectorAll('.blog-card').forEach(function (card) {
            var id = card.getAttribute('data-article-id');
            if (card.classList.contains('placeholder')) {
                if (hasQuery) {
                    card.style.setProperty('display', 'none');
                } else {
                    card.style.removeProperty('display');
                }
                return;
            }
            if (id != null) {
                if (idSet.has(id)) {
                    card.style.removeProperty('display');
                } else {
                    card.style.setProperty('display', 'none');
                }
            }
        });

        if (noResultsEl) {
            if (hasQuery && (!resultIds || resultIds.length === 0)) {
                noResultsEl.style.setProperty('display', 'block');
            } else {
                noResultsEl.style.setProperty('display', 'none');
            }
        }
    }

    window.initBlogSearch = function initBlogSearch() {
        var content = document.getElementById('content');
        var section = content ? content.querySelector('.blog-insights-section') : document.querySelector('.blog-insights-section');
        var input = section ? (section.querySelector('.blog-search-input') || section.querySelector('#blog-search-input')) : null;
        var grid = section ? section.querySelector('.blog-cards-grid') : null;
        if (!section) return;
        if (!input) return;
        if (!grid) return;

        var debounceTimer = null;

        function doSearch() {
            var q = (input.value || '').trim();
            if (q === '') {
                showAllCards(section);
                return;
            }

            var baseUrl = getApiBaseUrl();
            var url = baseUrl + '/api/search?q=' + encodeURIComponent(q);

            fetch(url)
                .then(function (res) {
                    if (!res.ok) throw new Error('Search failed: ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    var ids = Array.isArray(data) ? data.map(function (item) { return item && item.id; }).filter(Boolean) : [];
                    var contentEl = document.getElementById('content');
                    var sectionToUpdate = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                    applySearchResults(sectionToUpdate || section, ids, true);
                })
                .catch(function (err) {
                    console.error('[blog-search]', err);
                    var contentEl = document.getElementById('content');
                    var sectionToUpdate = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                    applySearchResults(sectionToUpdate || section, [], true);
                });
        }

        input.addEventListener('input', function () {
            if (debounceTimer) clearTimeout(debounceTimer);
            var q = (input.value || '').trim();
            if (q === '') {
                var contentEl = document.getElementById('content');
                var sectionToShow = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                showAllCards(sectionToShow || section);
                return;
            }
            debounceTimer = setTimeout(doSearch, DEBOUNCE_MS);
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                input.value = '';
                var contentEl = document.getElementById('content');
                var sectionToShow = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                showAllCards(sectionToShow || section);
                input.blur();
            }
        });
    };
})();
