# Testing Documentation Index

This directory contains detailed documentation for testing individual API endpoints and UI components.

## API Testing

### Endpoint-Specific Guides

- **[Contact API](contact.md)** - Testing the contact form submission endpoint
  - POST `/api/contact` - Submit contact messages
  - GET `/api/contact` - Admin endpoint to view messages
  - Rate limiting and spam protection

- **[Health API](health.md)** - Testing health check endpoints
  - GET `/api` - Basic health check
  - GET `/api/health` - Detailed health information

- **[Home API](home.md)** - Testing the home page content endpoint
  - GET `/api/home` - Home page text content

- **[Meta API](meta.md)** - Testing metadata endpoint
  - GET `/api/meta` - Profile metadata (name, title, location, languages, links)

- **[Projects API](projects.md)** - Testing the projects endpoint
  - GET `/api/projects` - Merged GitHub + curated projects list
  - Cache-first loading (static file / localStorage first), background API refresh, silent UI update; Mermaid diagrams for runtime flow and browser vs CI wiring
  - GitHub API integration and fallback behavior

- **[Stats API](stats.md)** - Testing statistics endpoint
  - GET `/api/stats` - Rollup statistics (project count, languages, last updated)

## UI Testing

- **[Blog Tests](blog.md)** - Blog listing pages (Engineering, Personal), post detail structure (banner, hero, body)
  - Featured Post, Latest Insights, category pills, cards
  - SPA navigation to post, dark mode CTA visibility
  - CI stability: wait-for-response-then-DOM pattern for chromium-iphone (see [Post-Mortem: CI Chromium-iPhone SPA Flakiness](../Post-Mortem/ci-chromium-iphone-spa-flakiness.md))

- **[Tutorials Tests](tutorials.md)** - Testing the tutorials page
  - Tutorial card display
  - Lesson navigation
  - Back button functionality

## General Testing Guides

For comprehensive testing documentation, see:

- **[API Testing Guide](../TESTING.md)** - Complete API testing guide with all endpoints
- **[UI Testing Guide](../UI_TESTING.md)** - Complete Playwright E2E testing guide
- For Firefox CI timeouts on `page.goto` with `networkidle`, see [Post-Mortem: CI Firefox page.goto networkidle Timeout](../Post-Mortem/ci-firefox-page-goto-networkidle-timeout.md).

## Test Structure

```
tests/
├── api-*.spec.ts          # API endpoint tests
├── accessibility.spec.ts  # Accessibility tests
├── blog.spec.ts           # Blog listing, post navigation, post detail (banner, hero, body)
├── contact.spec.ts        # Contact form tests
├── docs.spec.ts           # Documentation page tests
├── error-handling.spec.ts # Error scenario tests
├── home-page.spec.ts      # Home page tests
├── navbar.spec.ts         # Navigation tests
├── projects.spec.ts       # Projects page tests
├── responsive.spec.ts     # Responsive design tests
├── seo.spec.ts            # SEO and meta tag tests
├── skills.spec.ts         # Skills page tests
├── spa-navigation.spec.ts # SPA navigation tests
├── theme.spec.ts          # Theme toggle tests
└── translation.spec.ts    # Language switching tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test tests/contact.spec.ts
```

### Run Tests for Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=chromium-iphone
```

### Run API Tests Only
```bash
npx playwright test --grep "API"
```

### Test classification (sanity, regression, integration)

Tests are tagged in their titles so you can run a subset by class:

- **Sanity** – Simple GET 200 OK only (no body/contract checks). Run:  
  `npx playwright test --project=api --grep "\[sanity\]"`
- **Regression** – Negative cases (4xx/5xx) and any test that asserts more than status (body, contract, headers). Run:  
  `npx playwright test --project=api --grep "\[regression\]"`
- **Integration** – Multi-endpoint or stateful API tests (e.g. load, POST contact) and full user-flow tests (user-journey, load frontend). Run:  
  `npx playwright test --grep "\[integration\]"`

## Test Documentation by Feature

### Contact Form
- [Contact API Tests](contact.md)
- `tests/contact.spec.ts` - UI tests for contact form

### Projects
- [Projects API Tests](projects.md)
- `tests/projects.spec.ts` - UI tests for projects page

### Navigation
- `tests/navbar.spec.ts` - Navigation bar tests
- `tests/spa-navigation.spec.ts` - SPA routing tests

### Accessibility
- `tests/accessibility.spec.ts` - WCAG compliance tests

### SEO
- `tests/seo.spec.ts` - Meta tags and SEO validation

### Error Handling
- `tests/error-handling.spec.ts` - Error scenario tests

### Blog
- [Blog Tests](blog.md)
- `tests/blog.spec.ts` - Blog listing pages (Engineering, Personal), Featured Post, Latest Insights, SPA navigation to post, post detail structure (banner, hero, body)

## CI/CD Testing

Playwright tests use a **tiered strategy** so master stays the source of truth (no merge until the full suite passes).

- **Pull requests**  
  Two jobs run in parallel; **both must pass** before merge:
  - **Sanity**: Fast gate (~5–10 min). Runs only `[sanity]` tests (6 simple GET 200 API checks, no browser install).
  - **Full suite**: Regression and integration tests tagged `[regression]` and `[integration]`, run in **5 shards** in parallel. Total PR time is typically ~10–13 min (dominated by the full suite).
- **Push to master / schedule / workflow_dispatch**  
  The full-suite job runs only when the ref is **master** (push to master, scheduled run on the default branch, or manual dispatch from master). This keeps post-merge and scheduled runs aligned with the main branch.

Merge is only allowed when sanity and all full-suite shards have passed on the PR, so master is not broken by a merge.

See [UI Testing Guide](../UI_TESTING.md#cicd-integration) for skip keywords and artifact details.

## Need Help?

- Check the [Documentation Index](../README.md)
- Review [API Testing Guide](../TESTING.md)
- Review [UI Testing Guide](../UI_TESTING.md)
- Open an issue for questions

