# UI Testing Guide

This repo uses Playwright for end-to-end UI testing of the portfolio site.

## Quick Start

```bash
# Install dependencies
npm i

# Install Playwright browsers
npx playwright install --with-deps

# Run all UI tests
npm test

# Run with UI mode (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed
```

## Prerequisites

- Node.js 18.x (LTS recommended)
- npm (comes with Node.js)
- Port `4321` available locally (for test server)

Verify Node.js version:
```bash
node -v  # should show v18.x.x
npm -v
```

## Running Tests

### Basic Commands

```bash
# Run all tests headless (default)
npm test

# Run with Playwright UI (interactive test runner)
npm run test:ui

# Run in headed mode (see browser windows)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# Run only E2E tests (excludes API tests)
npm run test:e2e
```

### Running Specific Test Files

```bash
# Run a specific test file
npx playwright test tests/navbar.spec.ts
npx playwright test tests/blog.spec.ts

# Run tests matching a pattern
npx playwright test navbar

# Run tests in a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=chromium-iphone
```

### Running Tests in CI

There are two GitHub Actions workflows for testing:

**Playwright Tests** (`playwright.yml`) - Tiered strategy so master stays source of truth:

- **On pull requests**: Two jobs run in parallel; both must pass before merge.
  - **Sanity (PR)**: Runs only `[sanity]` tests (6 simple GET 200 API checks). No browser install. ~5–10 min.
  - **Full suite (sharded)**: Runs `[regression]` and `[integration]` tests in 5 parallel shards. Requires Node, Java, browser install, API + UI servers. ~10–13 min total (slowest shard).
- **On push to master / schedule / workflow_dispatch**: The full-suite job runs only when the ref is **master** (i.e. push to master, scheduled run on default branch, or manual dispatch from master). Sanity does not run on push (PR-only).
- Skip keywords: `[skip ci]`, `[skip ui]`, `[skip api]`, etc. (see [Skipping Tests in CI](#skipping-tests-in-ci)).

**Locator Maintenance** (`locator-maintenance.yml`) - Test maintenance workflow:
- Runs on: Daily schedule (10:00 UTC), manual dispatch only
- Note: Does NOT run on pull requests to avoid duplicate test runs
- Purpose: Run all tests and normalize locators if tests fail

Per-job steps (simplified): checkout, setup Node/Java, install deps, (sanity: no browsers; full-suite: install Playwright browsers), build/start API (and UI for full-suite), run tests, upload artifacts (reports, traces, screenshots).

## Test Structure

Tests are located in the `tests/` directory:

- `navbar.spec.ts` - Navigation bar functionality
- `blog.spec.ts` - Blog listing pages (Engineering, Personal), Featured Post, Latest Insights, navigation to post, post detail (banner, hero, body)
- `home-page.spec.ts` - Home page content and layout
- `home.spec.ts` - Home page navigation and interactions
- `skills.spec.ts` - Skills page display and categorization
- `projects.spec.ts` - Projects page and project cards
- `docs.spec.ts` - Documentation/Notes page navigation
- `tutorials.spec.ts` - Tutorials page and cards
- `translation.spec.ts` - Language switching (EN/ES)
- `theme.spec.ts` - Dark/light theme switching
- `footer.spec.ts` - Footer visibility, identity, theme/language/reduced-motion/reset controls, quick links, Back to top
- `mobile-sidebar.spec.ts` - Mobile sidebar open/close, Portfolio header, nav order (Home, Projects, Blog, Docs, Skills, Contact), Docs/Blog panels, PREFERENCES (Language + Dark Mode), footer icons (contact, reset)
- `responsive.spec.ts` - Responsive design across screen sizes
- `spa-navigation.spec.ts` - Single Page Application navigation

## Test Configuration

Configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:4321`
- **Test timeout**: 60 seconds
- **Expect timeout**: 10 seconds
- **Web server**: Automatically starts `http-server` on port 4321
- **Browsers**: Chromium, Firefox, Chromium-iPhone (mobile emulation)
- **Workers**: 2 in CI (reduced from 4 to minimize resource contention and improve test stability)
- **Parallel execution**: Enabled within each browser project
- **Trace**: Enabled on first retry for debugging

## Test Suites

### Navbar Tests (`navbar.spec.ts`)

Tests navigation bar functionality:
- Navbar visibility and expected links
- Docs dropdown menu behavior
- Mobile sidebar functionality
- Brand name navigation
- Language switcher and theme toggle

**Example:**
```bash
npx playwright test tests/navbar.spec.ts
```

### Home Page Tests (`home-page.spec.ts`)

Tests home page content and layout:
- Hero banner with portrait image
- Hero headline text
- Button links (LinkedIn, GitHub)
- Two-column layout (story and skills)
- Skills preview section
- "View All Skills" button styling and navigation

**Example:**
```bash
npx playwright test tests/home-page.spec.ts
```

### Skills Page Tests (`skills.spec.ts`)

Tests skills page display:
- Skills page loads with categorized skills
- Skills are properly spaced and readable
- Skill categories are displayed correctly

**Example:**
```bash
npx playwright test tests/skills.spec.ts
```

### Projects Page Tests (`projects.spec.ts`)

Tests projects page:
- Projects page loads
- Project cards display correctly
- Project filtering and categorization

**Example:**
```bash
npx playwright test tests/projects.spec.ts
```

### Translation Tests (`translation.spec.ts`)

Tests language switching:
- English/Spanish language switching
- Translation persistence across navigation
- Mobile and desktop language switchers
- All pages translate correctly

If the mobile sidebar or other UI shows a raw key (e.g. `sidebar.portfolio`) instead of translated text, the translation JSON is missing that key. See [Post-Mortem: Mobile Sidebar Raw Translation Key](Post-Mortem/mobile-sidebar-raw-translation-key.md) for cause and prevention.

**Example:**
```bash
npx playwright test tests/translation.spec.ts
```

### Theme Tests (`theme.spec.ts`)

Tests dark/light theme:
- Theme toggle functionality
- Theme persistence
- Theme switching on mobile and desktop

**Example:**
```bash
npx playwright test tests/theme.spec.ts
```

### Footer Tests (`footer.spec.ts`)

Tests the desktop-first site footer:
- Footer visibility on desktop and hidden on mobile
- Identity section (name, role, tagline)
- Theme and language toggles in sync with nav
- Reduced motion toggle and persistence
- Reset preferences button
- Quick links (GitHub, LinkedIn, Contact, Engineering) and Back to top

**Example:**
```bash
npx playwright test tests/footer.spec.ts
```

### Mobile Sidebar Tests (`mobile-sidebar.spec.ts`)

Tests the mobile hamburger menu and sidebar (Portfolio header, PREFERENCES section, footer icons):
- Sidebar opens and shows main nav items (Home, Projects, Blog, Docs, Skills, Contact) and Portfolio header
- PREFERENCES section with two controls: Language (icon + EN/ES pills) and Dark Mode (icon + toggle)
- Footer icons: contact (@) and reset preferences (circular arrow)
- Reset preferences (footer icon) restores theme, language, and reduced motion to defaults

**Example:**
```bash
npx playwright test tests/mobile-sidebar.spec.ts
```

### Responsive Tests (`responsive.spec.ts`)

Tests responsive design:
- Mobile layout (≤768px)
- Desktop layout (≥992px)
- Medium screen layout (769px-991px)
- Navigation adapts to screen size

**Example:**
```bash
npx playwright test tests/responsive.spec.ts
```

### SPA Navigation Tests (`spa-navigation.spec.ts`)

Tests Single Page Application navigation:
- Content loads via SPA without full page reload
- Navigation between pages
- URL updates correctly
- Back button functionality

**Example:**
```bash
npx playwright test tests/spa-navigation.spec.ts
```

## Common Test Patterns

### Waiting for Content to Load

Since the site uses SPA (Single Page Application) loading:

```typescript
// Wait for content to be loaded
await page.waitForFunction(() => {
  const c = document.querySelector('#content');
  return c?.getAttribute('data-content-loaded') === 'true' || !!c?.querySelector('#homeBanner');
}, { timeout: 15000 });
```

### SPA navigation: wait for response then DOM (CI / chromium-iphone)

For SPA navigations that load a specific URL (e.g. blog post, engineering page, projects page), tests are more reliable in CI—especially on the **chromium-iphone** project—when they wait for the **network response** before waiting for DOM. This avoids timeouts when the request or DOM update is slow.

1. Start `page.waitForResponse(predicate, { timeout })` **before** the click.
2. Click the link that triggers the SPA load.
3. Await the response (or catch and ignore timeout when the resource is served from cache).
4. Then run `page.waitForFunction(...)` or other DOM assertions.

Accept both 200 and 304 in the response predicate when the resource may be cached. See [Post-Mortem: CI Chromium-iPhone SPA Flakiness](Post-Mortem/ci-chromium-iphone-spa-flakiness.md) for details.

### Mobile vs Desktop Detection

```typescript
// Check if we're on mobile
const isMobile = await page.evaluate(() => window.innerWidth <= 768);

if (isMobile) {
  // Mobile-specific test logic
} else {
  // Desktop-specific test logic
}
```

### Language Setup

```typescript
// Set language to English before tests
await page.evaluate(() => {
  localStorage.setItem('siteLanguage', 'en');
  if (typeof window.TranslationManager !== 'undefined') {
    window.TranslationManager.switchLanguage('en');
  }
});
```

### Navigation

```typescript
// Navigate to a page via SPA
await page.locator('#navbar-links').getByRole('link', { name: 'Skills' }).click();

// Wait for content to load
await page.waitForFunction(() => {
  const c = document.querySelector('#content');
  return c?.getAttribute('data-content-loaded') === 'true';
}, { timeout: 15000 });
```

## Debugging Tests

### View Test Report

After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Debug Mode

Run tests in debug mode to step through:
```bash
npm run test:debug
```

### UI Mode

Use Playwright UI for interactive debugging:
```bash
npm run test:ui
```

### Trace Viewer

When a test fails, traces are automatically generated. View them:
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots (in `test-results/`)
- Videos (if configured)
- Traces (on first retry)

## Troubleshooting

### Tests Fail with "Navigation timeout"

- Ensure the local server is running on port 4321
- Check that `http-server` is installed: `npm i`
- Try running the server manually: `npm run serve`

### Tests Fail on Mobile Emulation

- Mobile tests have longer timeouts (90 seconds)
- Some interactions may need more time on mobile
- Check `playwright.config.ts` for mobile-specific timeouts
- For SPA navigation timeouts on **chromium-iphone**, use the wait-for-response-then-DOM pattern; see [Post-Mortem: CI Chromium-iPhone SPA Flakiness](Post-Mortem/ci-chromium-iphone-spa-flakiness.md)

### Translation Tests Fail

- Ensure TranslationManager is loaded
- Check that translation files exist in `html/js/translations/`
- Verify localStorage is accessible

### Theme Tests Fail

- Check that theme toggle buttons exist
- Verify theme is persisted in localStorage
- Ensure CSS variables are properly set

### Port Already in Use

If port 4321 is already in use:
```bash
# Find and kill the process
lsof -ti:4321 | xargs kill -9

# Or use a different port (update playwright.config.ts)
```

### Browser Installation Issues

If browsers fail to install:
```bash
# Reinstall browsers
npx playwright install --with-deps

# Install specific browser
npx playwright install chromium
npx playwright install firefox
```

## Best Practices

1. **Use data attributes**: Prefer `data-translate`, `data-url` over class names for selectors
2. **Wait for content**: Always wait for SPA content to load before assertions
3. **Mobile testing**: Test on both desktop and mobile emulation
4. **Language setup**: Set language before tests that depend on translations
5. **Isolation**: Each test should be independent and not rely on previous test state
6. **Timeouts**: Use appropriate timeouts for slow operations (15-30 seconds for SPA loads)

## CI/CD Integration

Tests run automatically in GitHub Actions. The Playwright workflow uses a tiered strategy: on PRs, both the sanity job and the full-suite (regression + integration, 5 shards) run and must pass before merge, so master remains the source of truth. On push/schedule/dispatch, the full suite runs only when the ref is master. See [Running Tests in CI](#running-tests-in-ci) for details.

### Skipping Tests in CI

You can skip tests by including special keywords in your commit messages or PR titles:

- `[skip ci]` - Skip all tests (UI and API)
- `[skip ui]` - Skip all UI tests (Chromium, Firefox, iPhone emulation)
- `[skip api]` - Skip all API tests
- `[skip perf]` - Skip all performance tests (reserved for future use)
- `[skip ada]` - Skip all accessibility tests (reserved for future use)
- `[skip load]` - Skip all load tests (reserved for future use)

**Examples:**
```
git commit -m "Update README [skip ci]"
git commit -m "Fix typo in docs [skip ui]"
git commit -m "Update API documentation [skip api]"
```

**Notes:**
- Keywords are case-insensitive
- Keywords can appear in commit messages or PR titles/bodies
- Multiple skip keywords can be used together (e.g., `[skip ui] [skip api]`)
- When `[skip ci]` is used, the entire test job is skipped
- When specific test types are skipped, only those tests are skipped (other tests still run)

The workflow:
- On PR: runs sanity and full-suite (both required to pass); merge is blocked until both pass.
- On push/schedule/dispatch: full-suite runs only when ref is master.
- Uploads test artifacts (reports, traces, screenshots) per job/shard; retains for 7 days.

View test results in the Actions tab on GitHub.

