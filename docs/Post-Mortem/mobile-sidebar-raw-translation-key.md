---
title: "Mobile Sidebar Showing Raw Translation Key (sidebar.portfolio)"
date: "2026-03-09"
owner: "Ricky M"
status: "Resolved"
---

# Mobile Sidebar Showing Raw Translation Key (sidebar.portfolio)

## Summary

On the live site, the mobile sidebar header (when the hamburger menu is expanded) displayed the literal string **"sidebar.portfolio"** instead of the translated label **"Portfolio"**. The cause was a missing translation key: the element used `data-translate="sidebar.portfolio"` but the translation files (`en.json` and `es.json`) had no `sidebar` section, so the TranslationManager fell back to showing the key. The bug was not caught by tests because the existing assertion used substring matching (`getByText('Portfolio')`), which still matched when the visible text was "sidebar.portfolio".

## Impact

- Users on mobile saw "sidebar.portfolio" in the sidebar header instead of "Portfolio" (or "Portafolio" in Spanish).
- No functional breakage; purely a copy/UX regression.
- Eroded confidence that tests would catch similar translation-key omissions.

## Root Cause

1. **Missing key in translation files:** The mobile sidebar logo in `index.html` uses `<span class="mobile-logo-text" data-translate="sidebar.portfolio">Portfolio</span>`. The translation module looks up the key `sidebar.portfolio` in the loaded JSON; when the key is absent, `TranslationManager.t()` returns the key itself, so the UI showed "sidebar.portfolio".
2. **No `sidebar` section:** The translation files contained `nav`, `settings`, `home`, `projects`, etc., but no top-level `sidebar` object with a `portfolio` string. The key was never added when the mobile sidebar redesign introduced the attribute.

## Contributing Factors

- **Loose test assertion:** In `tests/navbar.spec.ts`, the test "mobile sidebar opens and closes correctly" asserted `await expect(sidebar.getByText('Portfolio')).toBeVisible()`. Playwright's `getByText('Portfolio')` uses substring matching, so the element text "sidebar.portfolio" still contains "Portfolio" and the assertion passed.
- **No key–JSON consistency check:** There was no test or script that validated that every `data-translate` key referenced in the main app (index + SPA-loaded pages) exists in the translation JSON. Such a check would have failed as soon as `sidebar.portfolio` was introduced without a corresponding entry.
- **No assertion that visible text is not a raw key:** Tests did not assert that no element with `data-translate` has its visible text equal to its key (e.g. that no element shows "sidebar.portfolio" as text).

## Resolution / Fix

1. **Added the missing key:** In `html/js/translations/en.json` and `html/js/translations/es.json`, added a `sidebar` section with `portfolio`: `"Portfolio"` (en) and `"Portafolio"` (es). The mobile sidebar header now displays the correct label.
2. **Planned test improvements (separate PR/branch):** A follow-up plan was created to: (a) tighten the navbar test to assert exact text for the sidebar logo (e.g. `toHaveText('Portfolio')` on the element with `data-translate="sidebar.portfolio"`) so that "sidebar.portfolio" would fail; (b) add a test that no visible `[data-translate]` element has text equal to its key; (c) add a static test that parses index and main pages for `data-translate` values and validates each key exists in `en.json`.

## Why This Approach

Adding the key is the minimal fix to restore correct UX. Tightening tests and adding key validation prevents the same class of bug (missing key → raw key shown) from recurring and ensures the test suite would fail if a new `data-translate` key were added without a corresponding translation entry.

## Prevention

- **Exact-text assertions for critical translated UI:** When asserting translated labels (especially in navigation/sidebar), use exact text matching (e.g. `toHaveText('Portfolio')` on the specific element) rather than substring matching, so that showing the key (e.g. "sidebar.portfolio") fails the test.
- **Translation key validation:** Add a static or E2E check that every `data-translate` key used in the main app exists in the translation JSON. Run it in CI so new keys cannot be added without corresponding entries.
- **Optional: no raw key visible:** Add a test that, after loading the page and opening the mobile sidebar, verifies no element with `data-translate` has its visible text equal to its key. This catches any missing-key regression in one place.

## Action Items

- [ ] Implement the planned test changes: exact sidebar assertion, "no raw key visible" test, and static translation-key validation (see plan / PR).
- [ ] Consider extending key validation to dynamically loaded pages or `data/`/FAQ content if those areas use `data-translate` and are critical.
