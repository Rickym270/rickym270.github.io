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
  - GitHub API integration
  - Fallback behavior

- **[Stats API](stats.md)** - Testing statistics endpoint
  - GET `/api/stats` - Rollup statistics (project count, languages, last updated)

## UI Testing

- **[Tutorials Tests](tutorials.md)** - Testing the tutorials page
  - Tutorial card display
  - Lesson navigation
  - Back button functionality

## General Testing Guides

For comprehensive testing documentation, see:

- **[API Testing Guide](../TESTING.md)** - Complete API testing guide with all endpoints
- **[UI Testing Guide](../UI_TESTING.md)** - Complete Playwright E2E testing guide

## Test Structure

```
tests/
├── api-*.spec.ts          # API endpoint tests
├── accessibility.spec.ts  # Accessibility tests
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

## CI/CD Testing

Tests run automatically in GitHub Actions on:
- Pull requests
- Pushes to main
- Daily schedule (6:00 UTC)

See [UI Testing Guide](../UI_TESTING.md#cicd-integration) for details on CI/CD integration.

## Need Help?

- Check the [Documentation Index](../README.md)
- Review [API Testing Guide](../TESTING.md)
- Review [UI Testing Guide](../UI_TESTING.md)
- Open an issue for questions

