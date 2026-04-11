/**
 * NYT-style "Listen to this article" using Web Speech API.
 * Mounts on blog posts (#post-body) and tutorials (.lesson-body). Skips Mermaid/code pre blocks.
 */
(function () {
    var DEBOUNCE_MS = 150;
    var debounceTimer = null;
    var activeUtterance = null;
    var activeState = 'idle'; // idle | playing | paused
    /** @type {HTMLElement | null} */
    var lastMountedListenBody = null;

    function supported() {
        return typeof window !== 'undefined' && window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined';
    }

    /**
     * @param {HTMLElement} root
     * @returns {string}
     */
    function extractSpeakableText(root) {
        if (!root || !root.cloneNode) return '';
        var clone = root.cloneNode(true);
        clone.querySelectorAll('script, style, nav').forEach(function (n) {
            n.remove();
        });
        clone.querySelectorAll('.d-none').forEach(function (n) {
            n.remove();
        });
        clone.querySelectorAll('[aria-hidden="true"]').forEach(function (n) {
            n.remove();
        });
        // All pre blocks: Mermaid source, rendered diagrams, code samples, prompt templates
        clone.querySelectorAll('pre').forEach(function (n) {
            n.remove();
        });
        clone.querySelectorAll('code').forEach(function (n) {
            n.remove();
        });
        clone.querySelectorAll('svg').forEach(function (n) {
            n.remove();
        });
        var text = (clone.innerText || clone.textContent || '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        return text;
    }

    function getSpeakLang() {
        if (window.TranslationManager && window.TranslationManager.currentLanguage) {
            return window.TranslationManager.currentLanguage === 'es' ? 'es' : 'en';
        }
        var htmlLang = document.documentElement.getAttribute('lang');
        if (htmlLang && htmlLang.length >= 2) return htmlLang.slice(0, 2);
        return 'en';
    }

    /**
     * @returns {{ container: HTMLElement, body: HTMLElement, insertBefore: HTMLElement } | null}
     */
    function findListenContext() {
        var content = document.getElementById('content');
        if (!content) return null;
        var postBody = content.querySelector('article#post-body') || content.querySelector('.post-content #post-body');
        if (postBody) {
            var postContainer = postBody.closest('.post-content');
            if (postContainer) {
                return { container: postContainer, body: postBody, insertBefore: postBody };
            }
        }
        var lessonBody = content.querySelector('.lesson-content .lesson-body');
        if (lessonBody) {
            var lessonContainer = lessonBody.closest('.lesson-content');
            if (lessonContainer) {
                return { container: lessonContainer, body: lessonBody, insertBefore: lessonBody };
            }
        }
        return null;
    }

    function cancelSpeech() {
        try {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        } catch (e) {}
        activeUtterance = null;
        activeState = 'idle';
    }

    function mountBar(ctx) {
        var container = ctx.container;
        var insertBefore = ctx.insertBefore;
        var body = ctx.body;

        // SPA: new article = new body node; there may be no prior bar in this container, so we must
        // stop any speech tied to the previous article.
        var navigatedToNewBody =
            lastMountedListenBody !== null && lastMountedListenBody !== body;
        if (navigatedToNewBody) {
            cancelSpeech();
        }
        lastMountedListenBody = body;

        var text = extractSpeakableText(body);
        if (!text || text.length < 20) {
            return;
        }

        var existing = container.querySelector('[data-article-listen-root]');
        if (existing) {
            cancelSpeech();
            existing.remove();
        }

        if (!supported()) {
            var fallback = document.createElement('div');
            fallback.className = 'article-listen-bar article-listen-bar--unsupported';
            fallback.setAttribute('data-article-listen-root', '');
            fallback.setAttribute('data-testid', 'article-listen');
            fallback.innerHTML =
                '<p class="article-listen-unsupported mb-0" data-translate="articleListen.unsupported"></p>';
            container.insertBefore(fallback, insertBefore);
            if (typeof window.TranslationManager !== 'undefined') {
                window.TranslationManager.applyTranslations();
            }
            return;
        }

        var bar = document.createElement('div');
        bar.className = 'article-listen-bar';
        bar.setAttribute('data-article-listen-root', '');
        bar.setAttribute('data-testid', 'article-listen');
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', '');
        bar.innerHTML =
            '<div class="article-listen-inner">' +
            '<span class="material-symbols-outlined article-listen-icon" aria-hidden="true">graphic_eq</span>' +
            '<span class="article-listen-label" data-translate="articleListen.label"></span>' +
            '<button type="button" class="btn article-listen-toggle" data-action="toggle" aria-pressed="false">' +
            '<span class="article-listen-toggle-icons" aria-hidden="true">' +
            '<span class="material-symbols-outlined article-listen-icon-play">play_arrow</span>' +
            '<span class="material-symbols-outlined article-listen-icon-pause">pause</span>' +
            '</span>' +
            '<span data-translate="articleListen.listen" class="article-listen-toggle-label">Listen</span>' +
            '</button>' +
            '<span class="article-listen-mobile-hint" data-translate="articleListen.mobileHint" aria-hidden="true"></span>' +
            '<button type="button" class="btn btn-link article-listen-stop text-muted" data-action="stop" hidden>' +
            '<span data-translate="articleListen.stop">Stop</span>' +
            '</button>' +
            '<span class="article-listen-status sr-only" aria-live="polite" data-article-listen-status></span>' +
            '</div>';

        container.insertBefore(bar, insertBefore);

        if (typeof window.TranslationManager !== 'undefined') {
            window.TranslationManager.applyTranslations();
        }

        var toggleBtn = bar.querySelector('[data-action="toggle"]');
        var stopBtn = bar.querySelector('[data-action="stop"]');
        var statusEl = bar.querySelector('[data-article-listen-status]');
        var labelSpan = toggleBtn.querySelector('.article-listen-toggle-label');

        function setStatus(msg) {
            if (statusEl) statusEl.textContent = msg || '';
        }

        function refreshToggleLabel() {
            var tm = window.TranslationManager;
            var key =
                activeState === 'playing'
                    ? 'articleListen.pause'
                    : activeState === 'paused'
                      ? 'articleListen.resume'
                      : 'articleListen.listen';
            if (tm && labelSpan) {
                labelSpan.setAttribute('data-translate', key);
                labelSpan.textContent = tm.t(key);
            }
            if (tm) {
                toggleBtn.setAttribute('aria-label', tm.t(key));
            } else {
                toggleBtn.setAttribute(
                    'aria-label',
                    activeState === 'playing' ? 'Pause' : activeState === 'paused' ? 'Resume' : 'Listen'
                );
            }
            toggleBtn.classList.remove('article-listen-toggle--playing', 'article-listen-toggle--paused');
            if (activeState === 'playing') {
                toggleBtn.classList.add('article-listen-toggle--playing');
            } else if (activeState === 'paused') {
                toggleBtn.classList.add('article-listen-toggle--paused');
            }
        }

        function speakFromStart() {
            cancelSpeech();
            var ut = new SpeechSynthesisUtterance(text);
            ut.lang = getSpeakLang() === 'es' ? 'es-ES' : 'en-US';
            ut.rate = 1;
            // Headless / CI engines may invoke onend or onerror synchronously inside speak().
            // A lone setTimeout(0) can still run before automation observes the "Pause" state.
            // Defer reset until after paint: double rAF, then a macrotask.
            function scheduleUtteranceFinished(utRef) {
                function runFinish() {
                    if (activeUtterance !== utRef) return;
                    activeState = 'idle';
                    activeUtterance = null;
                    toggleBtn.setAttribute('aria-pressed', 'false');
                    if (stopBtn) stopBtn.hidden = true;
                    refreshToggleLabel();
                    setStatus('');
                }
                function afterPaintThenMacrotask() {
                    window.setTimeout(runFinish, 0);
                }
                if (typeof window.requestAnimationFrame === 'function') {
                    window.requestAnimationFrame(function () {
                        window.requestAnimationFrame(afterPaintThenMacrotask);
                    });
                } else {
                    window.setTimeout(runFinish, 0);
                }
            }

            ut.onend = function () {
                scheduleUtteranceFinished(ut);
            };
            ut.onerror = function () {
                scheduleUtteranceFinished(ut);
            };
            activeUtterance = ut;
            activeState = 'playing';
            toggleBtn.setAttribute('aria-pressed', 'true');
            if (stopBtn) stopBtn.hidden = false;
            refreshToggleLabel();
            setStatus(window.TranslationManager ? window.TranslationManager.t('articleListen.playing') : 'Playing');
            window.speechSynthesis.speak(ut);
        }

        toggleBtn.addEventListener('click', function () {
            if (!supported()) return;
            if (activeState === 'idle') {
                speakFromStart();
                return;
            }
            if (activeState === 'playing') {
                try {
                    window.speechSynthesis.pause();
                } catch (e) {}
                activeState = 'paused';
                toggleBtn.setAttribute('aria-pressed', 'false');
                refreshToggleLabel();
                setStatus(window.TranslationManager ? window.TranslationManager.t('articleListen.paused') : 'Paused');
                return;
            }
            if (activeState === 'paused') {
                try {
                    window.speechSynthesis.resume();
                } catch (e) {}
                activeState = 'playing';
                toggleBtn.setAttribute('aria-pressed', 'true');
                refreshToggleLabel();
                setStatus(window.TranslationManager ? window.TranslationManager.t('articleListen.playing') : 'Playing');
            }
        });

        stopBtn.addEventListener('click', function () {
            cancelSpeech();
            toggleBtn.setAttribute('aria-pressed', 'false');
            stopBtn.hidden = true;
            refreshToggleLabel();
            setStatus('');
        });

        refreshToggleLabel();
    }

    function scanAndMount() {
        var ctx = findListenContext();
        if (!ctx) {
            if (lastMountedListenBody !== null) {
                cancelSpeech();
                lastMountedListenBody = null;
            }
            return;
        }
        mountBar(ctx);
    }

    /**
     * Call after SPA replaces #content (SPAHack .load / .html). Ensures speech stops and the listen
     * bar rebinds even if MutationObserver misses the swap or races with jQuery.
     */
    function afterSpaContentReplaced() {
        cancelSpeech();
        lastMountedListenBody = null;
        scanAndMount();
    }

    function scheduleScan() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            debounceTimer = null;
            scanAndMount();
        }, DEBOUNCE_MS);
    }

    function initObserver() {
        var content = document.getElementById('content');
        if (!content) return;
        var obs = new MutationObserver(function () {
            // #content direct children changed (typical SPA shell swap). Stop speech immediately so we
            // do not rely only on debounced mountBar; also clear body tracking for the next scan.
            cancelSpeech();
            lastMountedListenBody = null;
            scheduleScan();
        });
        // childList only: avoid remounting when Mermaid or translations mutate inside the article.
        obs.observe(content, { childList: true, subtree: false });
    }

    document.addEventListener('languageChanged', function () {
        cancelSpeech();
        // Re-mount after translations mutate the article DOM
        scheduleScan();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            scanAndMount();
            initObserver();
        });
    } else {
        scanAndMount();
        initObserver();
    }

    window.ArticleListen = {
        extractSpeakableText: extractSpeakableText,
        scanAndMount: scanAndMount,
        findListenContext: findListenContext,
        afterSpaContentReplaced: afterSpaContentReplaced,
    };
})();
