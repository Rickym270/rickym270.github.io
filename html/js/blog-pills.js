/**
 * Legacy hook: category pills replaced by search bar.
 * initBlogCategoryPills() now delegates to initBlogSearch() so existing callers still work.
 * Call initBlogCategoryPills() or initBlogSearch() when engineering or lifestyle content is in the DOM.
 */
(function () {
    'use strict';

    window.initBlogCategoryPills = function initBlogCategoryPills() {
        if (typeof window.initBlogSearch === 'function') {
            window.initBlogSearch();
        }
    };
})();
