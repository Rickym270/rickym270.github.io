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
            card.style.display = '';
        });
        var noResults = section.querySelector('.blog-search-no-results');
        if (noResults) noResults.style.display = 'none';
    }

    function applySearchResults(section, resultIds, hasQuery) {
        var grid = section.querySelector('.blog-cards-grid');
        var noResultsEl = section.querySelector('.blog-search-no-results');
        if (!grid) return;

        var idSet = new Set(resultIds || []);

        grid.querySelectorAll('.blog-card').forEach(function (card) {
            var id = card.getAttribute('data-article-id');
            if (card.classList.contains('placeholder')) {
                card.style.display = hasQuery ? 'none' : '';
                return;
            }
            if (id != null) {
                card.style.display = idSet.has(id) ? '' : 'none';
            }
        });

        if (noResultsEl) {
            if (hasQuery && (!resultIds || resultIds.length === 0)) {
                noResultsEl.style.display = 'block';
            } else {
                noResultsEl.style.display = 'none';
            }
        }
    }

    window.initBlogSearch = function initBlogSearch() {
        var section = document.querySelector('.blog-insights-section');
        if (!section) return;

        var input = section.querySelector('.blog-search-input') || section.querySelector('#blog-search-input');
        if (!input) return;

        var grid = section.querySelector('.blog-cards-grid');
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
                    applySearchResults(section, ids, true);
                })
                .catch(function (err) {
                    console.error('[blog-search]', err);
                    applySearchResults(section, [], true);
                });
        }

        input.addEventListener('input', function () {
            if (debounceTimer) clearTimeout(debounceTimer);
            var q = (input.value || '').trim();
            if (q === '') {
                showAllCards(section);
                return;
            }
            debounceTimer = setTimeout(doSearch, DEBOUNCE_MS);
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                input.value = '';
                showAllCards(section);
                input.blur();
            }
        });
    };
})();
