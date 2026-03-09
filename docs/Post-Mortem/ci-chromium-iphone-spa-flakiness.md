---
title: "CI Chromium-iPhone SPA Navigation Flakiness"
date: "2026-03-09"
owner: "Ricky M"
status: "Resolved"
---

# CI Chromium-iPhone SPA Navigation Flakiness

## Summary

Playwright tests on the **chromium-iphone** project intermittently failed in CI (and sometimes on master after merge) when asserting content after SPA navigation. Failures included: "Post detail page shows banner, hero, and article body" (timeout waiting for `#post-body`), "Read Article button has visible text in dark mode" (timeout waiting for `.blog-featured-cta`), and "projects page matches visual baseline" (0 project cards). The root cause was tests relying on a fixed DOM wait timeout without syncing to the SPA's network request; on chromium-iphone, CI timing is more variable, so the DOM sometimes appeared after the timeout.

## Impact

- Intermittent CI failures on `chromium-iphone` for blog post-load, blog dark-mode CTA, translation post content, and visual-regression projects page.
- Failures often appeared on master or scheduled runs after passing on the PR, causing confusion ("passes on PR, fails on master").
- No functional bug in the app; purely test timing and environment sensitivity.

## Root Cause

1. **Blind DOM wait:** Tests clicked a SPA link (e.g. "Read Article", "Engineering", "Projects") and then used `page.waitForFunction(...)` with a fixed timeout (15–20s) for content to appear. They did not wait for the corresponding **network response** (e.g. `post-1.html`, `engineering.html`, `projects.html`) first.
2. **Chromium-iphone timing:** Under the chromium-iphone project (mobile viewport + device emulation), request/response and DOM update timing in CI is more variable. The SPA's `jQuery("#content").load(url)` callback (and any follow-up like `data-content-loaded`) can complete after the test's timeout.
3. **Cache behavior:** When the browser serves from cache, no network response may be emitted, so a strict "wait for response then DOM" could timeout if the predicate only matched 200 responses.

## Contributing Factors

- SPA loads HTML fragments via XHR; completion order (response → DOM update → `data-content-loaded`) can vary by viewport and CI load.
- No shared "wait for SPA navigation" helper that ties to the request URL.
- Previous mitigation was to skip certain tests on chromium-iphone; that hid the flake instead of fixing it.

## Resolution / Fix

1. **Wait-for-response-then-DOM pattern:** For navigations that load a known URL (e.g. `post-1.html`, `engineering.html`, `projects.html`), tests now:
   - Start `page.waitForResponse(predicate, { timeout })` **before** the click.
   - Click the link.
   - Await the response (or catch and ignore timeout when response never fires, e.g. cache).
   - Then run the existing `waitForFunction` for DOM with a reasonable timeout.
2. **Optional response wait:** To avoid failing when the browser serves from cache (no request), the response wait is wrapped in `.catch(() => {})` so a timeout falls back to the DOM wait only. Response predicate accepts both 200 and 304.
3. **Removed chromium-iphone skips:** In `blog.spec.ts` and `translation.spec.ts`, the previous `test.skip(..., 'chromium-iphone', ...)` for post-load and Engineering post tests was removed so those tests run on all projects.
4. **Applied in:** `tests/blog.spec.ts` (Read Article loads post, Post detail banner/hero/body, Read Article dark mode), `tests/translation.spec.ts` (Engineering post translated, Engineering post updates when language switched), `tests/visual-regression.spec.ts` (projects page baseline).

## Why This Approach

Syncing to the network response removes reliance on a fixed timeout and aligns the test with the SPA's actual load event. Making the response wait optional (catch timeout) keeps tests passing when the resource is served from cache and no response is emitted.

## Prevention

- Prefer **wait for response (URL + status) then DOM** for any SPA navigation that loads a distinct URL.
- Accept **200 or 304** in the response predicate when the resource may be cached.
- Use a short response timeout (e.g. 8s) and fall back to DOM-only wait so cache-only loads do not fail.
- Consider a shared helper (e.g. `waitForSpaNavigation(page, urlSubstring)`) for consistency across specs.
- Avoid skipping entire projects (e.g. chromium-iphone) for flakiness; fix the wait strategy instead.

## Action Items

- [ ] Consider adding a shared SPA navigation helper used by blog, translation, visual-regression, and other specs.
- [ ] Remove any remaining debug-only instrumentation (e.g. `debugLog`) from test files once stability is confirmed.
