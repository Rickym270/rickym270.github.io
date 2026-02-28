---
title: "CI Playwright UI Timeouts"
date: "2025-02-14"
owner: "Ricky M"
status: "Resolved"
---

# CI Playwright UI Timeouts

## Summary
Playwright UI tests for the Projects page and Contact visual regression timed out in CI. Debug logs intended to explain the failure did not appear. The root cause was missing SPA navigation/readiness waits in the tests and silent debug logging that depended on an unavailable ingest endpoint. A later CI failure also showed a Firefox-only timeout in the SEO canonical URL test due to fragile navigation waits.

## Impact
- `renders project cards when API returns data` timed out waiting for project cards.
- `contact form matches visual baseline` timed out waiting for the contact form on mobile.
- Debug logging was ineffective in CI, delaying diagnosis.
- `page has canonical URL` timed out in Firefox while waiting for `page.goto('/')` to reach `domcontentloaded`.
- `two-column content: left story, right skills` timed out in Firefox while waiting for `page.goto('/')` to reach `load`.

## Root Cause
1. The projects render test never navigated to the Projects page before asserting `.project-card` elements, so the content was never loaded.
2. The contact visual test did not wait for SPA readiness or mobile menu state before clicking the Contact link, causing the form wait to time out in mobile projects.
3. `logDebug` only posted to a local ingest endpoint and swallowed errors, so CI output contained no diagnostic lines.
4. The canonical URL SEO test used `domcontentloaded` in Firefox, which can be slower or stall in CI for the SPA root navigation.

## Contributing Factors
- SPA navigation relies on DOM insertion timing and data-content-loaded flags, which vary in CI.
- Mobile projects require explicit waits for the sidebar toggle and active state.
- Debug logging did not fall back to console output.
- Firefox is more sensitive to navigation timing on CI runners for SPA roots.

## Resolution / Fix
- Added CI console output (and error reporting) to `logDebug` while retaining the ingest POST.
- Updated the projects render test to navigate to the Projects page and wait for section attachment before asserting cards.
- Strengthened the contact visual test with SPA readiness waits and mobile navigation waits before asserting the form.
- Updated the canonical URL test to use Firefox `networkidle` with explicit timeouts and readiness waits.
- Applied Firefox `networkidle` for all remaining `page.goto('/')` calls in home-page.spec.ts (hero buttons, two-column content, hero portrait, View All Skills, Quick Stats displays).

## Why This Approach
The fixes align tests with the real SPA navigation flow, which removes reliance on implicit timing. Adding console logs to `logDebug` provides immediate visibility in CI regardless of external services.

## Prevention
- Standardize a shared SPA navigation helper for page transitions and readiness waits.
- Require tests to navigate to target pages explicitly before content assertions.
- Ensure diagnostic logging always emits console output in CI with clear tags.
- Add a CI check for missing debug output on known failure paths.
- Align SEO tests on a shared navigation helper and Firefox-safe wait strategy.

## Action Items
- Create reusable navigation helpers for SPA tests.
- Add a lightweight logging utility that always logs to console in CI.
- Review other visual tests for explicit SPA readiness waits.
