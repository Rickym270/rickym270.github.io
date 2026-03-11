/**
 * Latest Insights category pills: auto-generated from card tags and filter-on-click.
 * Call initBlogCategoryPills() when engineering or lifestyle content is in the DOM.
 */
(function () {
    'use strict';

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    window.initBlogCategoryPills = function initBlogCategoryPills() {
        var section = document.querySelector('.blog-insights-section');
        if (!section) return;

        var pillsContainer = section.querySelector('.blog-category-pills');
        var grid = section.querySelector('.blog-cards-grid');
        if (!pillsContainer || !grid) return;

        var cards = grid.querySelectorAll('.blog-card:not(.placeholder)');
        var tagKeys = new Set();

        cards.forEach(function (card) {
            var tags = card.getAttribute('data-tags');
            if (tags) {
                tags.split(/\s+/).forEach(function (k) {
                    if (k) tagKeys.add(k);
                });
            }
        });

        var allPill = '<span class="blog-category-pill active" data-filter-key="all" data-translate="blog.allPosts">All Posts</span>';
        var sortedKeys = Array.from(tagKeys).sort();
        var tagPills = sortedKeys.map(function (k) {
            return '<span class="blog-category-pill" data-filter-key="' + escapeHtml(k) + '" data-translate="' + escapeHtml(k) + '"></span>';
        }).join('');
        pillsContainer.innerHTML = allPill + tagPills;

        if (typeof window.TranslationManager !== 'undefined') {
            window.TranslationManager.applyTranslations();
        }

        pillsContainer.addEventListener('click', function (e) {
            var pill = e.target && e.target.closest ? e.target.closest('.blog-category-pill') : null;
            if (!pill) return;

            var key = pill.getAttribute('data-filter-key');
            pillsContainer.querySelectorAll('.blog-category-pill').forEach(function (p) {
                p.classList.toggle('active', p === pill);
            });

            var allCards = grid.querySelectorAll('.blog-card');
            allCards.forEach(function (card) {
                if (card.classList.contains('placeholder')) {
                    card.style.display = key === 'all' ? '' : 'none';
                    return;
                }
                var cardTags = card.getAttribute('data-tags') || '';
                var tagsList = cardTags.split(/\s+/).filter(Boolean);
                var show = key === 'all' || tagsList.indexOf(key) !== -1;
                card.style.display = show ? '' : 'none';
            });
        });
    };
})();
