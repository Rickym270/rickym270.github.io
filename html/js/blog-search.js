/**
 * Blog semantic search: debounced input, GET /api/search, show/hide cards by data-article-id.
 * Call initBlogSearch() when .blog-insights-section is in the DOM (e.g. after SPA load of engineering.html).
 */
(function () {
    'use strict';

    var DEBOUNCE_MS = 300;
    var engineeringFeaturedLangListenerBound = false;

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

        // Back-compat: production API may still return legacy ids (post-1/post-2).
        // Map those to current slug ids so filtering continues to work after renames.
        var legacyIdMap = {
            'post-1': 'how-living-with-ms-changed-the-way-i-engineer-software',
            'post-2': 'accessibility-is-not-just-a-feature'
        };

        var normalizedIds = (resultIds || []).map(function (id) { return legacyIdMap[id] || id; });
        var idSet = new Set(normalizedIds);
        var shownRealCards = 0;

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
                    shownRealCards++;
                } else {
                    card.style.setProperty('display', 'none');
                }
            }
        });

        if (noResultsEl) {
            // Show "no results" if query is present and either the API returned no ids,
            // or none of the returned ids matched any visible cards (e.g. stale API ids).
            if (hasQuery && ((!resultIds || resultIds.length === 0) || shownRealCards === 0)) {
                noResultsEl.style.setProperty('display', 'block');
            } else {
                noResultsEl.style.setProperty('display', 'none');
            }
        }
    }

    /**
     * Featured block mirrors the first real card in the grid (newest post). Keeps i18n keys in sync.
     */
    window.syncEngineeringFeaturedFromNewestCard = function syncEngineeringFeaturedFromNewestCard() {
        var root = document.getElementById('content') || document;
        var featured = root.querySelector('.blog-featured');
        var grid = root.querySelector('.blog-cards-grid');
        if (!featured || !grid) return;
        if (featured.classList.contains('blog-featured-placeholder')) return;

        var card = grid.querySelector('.blog-card:not(.placeholder)');
        if (!card) return;

        var link = card.querySelector('.blog-card-link');
        var titleEl = card.querySelector('.blog-card-title');
        var descEl = card.querySelector('.blog-card-description');
        var dateEl = card.querySelector('.blog-card-date');
        var cta = featured.querySelector('.blog-featured-cta');
        var featTitle = featured.querySelector('#featured-title') || featured.querySelector('.blog-featured-title');
        var featDesc = featured.querySelector('.blog-featured-description');
        var featMeta = featured.querySelector('.blog-featured-meta');
        if (!link || !titleEl || !descEl || !cta || !featTitle || !featDesc || !featMeta) return;

        var postUrl = link.getAttribute('data-url');
        if (postUrl) cta.setAttribute('data-url', postUrl);

        var thumb = link.querySelector('.blog-card-image');
        if (thumb) {
            var src = thumb.getAttribute('src');
            if (src) {
                var safe = src.replace(/"/g, '\\"');
                featured.style.backgroundImage = 'url("' + safe + '")';
            }
        }

        var titleKey = titleEl.getAttribute('data-translate');
        if (titleKey) {
            featTitle.setAttribute('data-translate', titleKey);
        } else {
            featTitle.removeAttribute('data-translate');
            featTitle.textContent = titleEl.textContent;
        }

        var descKey = descEl.getAttribute('data-translate');
        if (descKey) {
            featDesc.setAttribute('data-translate', descKey);
        } else {
            featDesc.removeAttribute('data-translate');
            featDesc.textContent = descEl.textContent;
        }

        var dateText = dateEl ? dateEl.textContent.trim() : '';
        var readMins = card.getAttribute('data-read-mins');
        var suffixKey = null;
        if (titleKey && /^engineering\.post[0-9]+\.title$/.test(titleKey)) {
            suffixKey = titleKey.replace(/\.title$/, '.readTimeSuffix');
        }
        if (!suffixKey) suffixKey = 'engineering.post1.readTimeSuffix';

        featMeta.textContent = '';
        if (dateText) {
            featMeta.appendChild(document.createTextNode(dateText + ' • '));
        }
        if (readMins && /^\d+$/.test(readMins)) {
            featMeta.appendChild(document.createTextNode(readMins + ' '));
        }
        var spanSuffix = document.createElement('span');
        spanSuffix.setAttribute('data-translate', suffixKey);
        spanSuffix.textContent = 'min read';
        featMeta.appendChild(spanSuffix);

        if (typeof window.TranslationManager !== 'undefined') {
            window.TranslationManager.applyTranslations();
        }
    };

    window.initBlogSearch = function initBlogSearch() {
        var content = document.getElementById('content');
        var section = content ? content.querySelector('.blog-insights-section') : document.querySelector('.blog-insights-section');
        var input = section ? (section.querySelector('.blog-search-input') || section.querySelector('#blog-search-input')) : null;
        var grid = section ? section.querySelector('.blog-cards-grid') : null;
        if (!section) return;
        if (!input) return;
        if (!grid) return;

        if (typeof window.syncEngineeringFeaturedFromNewestCard === 'function') {
            window.syncEngineeringFeaturedFromNewestCard();
        }

        if (grid.getAttribute('data-blog-search-bound') === '1') {
            return;
        }
        grid.setAttribute('data-blog-search-bound', '1');

        var debounceTimer = null;
        var requestSeq = 0;

        function doSearch() {
            var q = (input.value || '').trim();
            if (q === '') {
                showAllCards(section);
                return;
            }

            var seq = ++requestSeq;
            var baseUrl = getApiBaseUrl();
            var url = baseUrl + '/api/search?q=' + encodeURIComponent(q);

            fetch(url)
                .then(function (res) {
                    if (!res.ok) throw new Error('Search failed: ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    // Ignore stale responses if the query changed/cleared since the request started.
                    if (seq !== requestSeq) return;
                    var now = (input.value || '').trim();
                    if (now !== q || now === '') return;
                    var ids = Array.isArray(data) ? data.map(function (item) { return item && item.id; }).filter(Boolean) : [];
                    var contentEl = document.getElementById('content');
                    var sectionToUpdate = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                    applySearchResults(sectionToUpdate || section, ids, true);
                })
                .catch(function (err) {
                    console.error('[blog-search]', err);
                    if (seq !== requestSeq) return;
                    var now = (input.value || '').trim();
                    if (now !== q || now === '') return;
                    var contentEl = document.getElementById('content');
                    var sectionToUpdate = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                    applySearchResults(sectionToUpdate || section, [], true);
                });
        }

        input.addEventListener('input', function () {
            if (debounceTimer) clearTimeout(debounceTimer);
            var q = (input.value || '').trim();
            if (q === '') {
                requestSeq++;
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
                requestSeq++;
                var contentEl = document.getElementById('content');
                var sectionToShow = contentEl ? contentEl.querySelector('.blog-insights-section') : section;
                showAllCards(sectionToShow || section);
                input.blur();
            }
        });

        if (!engineeringFeaturedLangListenerBound) {
            engineeringFeaturedLangListenerBound = true;
            document.addEventListener('languageChanged', function () {
                if (typeof window.syncEngineeringFeaturedFromNewestCard === 'function') {
                    window.syncEngineeringFeaturedFromNewestCard();
                }
            });
        }
    };
})();
