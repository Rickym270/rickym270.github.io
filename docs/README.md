# Documentation Index

Welcome to the documentation for rickym270.github.io. This index provides an overview of all available documentation.

## Quick Start

- **[README.md](../README.md)** - Main project overview and quick start guide
- **[API Testing Guide](TESTING.md)** - How to run and test the Spring Boot API
- **[UI Testing Guide](UI_TESTING.md)** - Playwright end-to-end testing guide

## Setup & Configuration

### Development Environment
- **[Node.js Setup](NODE_SETUP.md)** - Node.js installation and troubleshooting (NVM vs Homebrew)
- **[GitHub Secrets](GITHUB_SECRETS.md)** - Setting up GitHub Actions secrets and environment variables

### Backend Configuration
- **[API Environment Variables](../api/ENV_FILE.md)** - API `.env` file configuration
- **[Email Setup](EMAIL_SETUP.md)** - Configuring SMTP for contact form notifications
- **[Turnstile Setup](TURNSTILE_SETUP.md)** - Cloudflare Turnstile CAPTCHA configuration

### Deployment
- **[API Deployment](../api/DEPLOY.md)** - Deploy the Spring Boot API to Render (free); see [DEPLOY_RENDER.md](../api/DEPLOY_RENDER.md)

## Testing Documentation

### Main Testing Guides
- **[API Testing](TESTING.md)** - Complete guide for testing the Spring Boot API
- **[UI Testing](UI_TESTING.md)** - Complete guide for Playwright E2E tests
- **[Testing Index](testing/README.md)** - Overview of all test documentation

### Test Types
- **Blog Tests** (`tests/blog.spec.ts`) - Blog listing pages (Engineering, Personal), Featured Post, Latest Insights, navigation to post, post detail structure (banner, hero, body)
- **Accessibility Tests** (`tests/accessibility.spec.ts`) - WCAG compliance testing
- **API Contract Tests** (`tests/api-contract.spec.ts`) - OpenAPI contract validation
- **Error Handling Tests** (`tests/error-handling.spec.ts`) - Edge case and error scenarios
- **Load Tests** (`tests/load.spec.ts`) - Stress testing and concurrent requests
- **Performance Tests** (`tests/performance.spec.ts`) - Performance metrics and timing
- **Security Tests** (`tests/security.spec.ts`) - Security headers and vulnerability testing
- **SEO Tests** (`tests/seo.spec.ts`) - Meta tags and SEO validation
- **User Journey Tests** (`tests/user-journey.spec.ts`) - End-to-end user workflows
- **Visual Regression Tests** (`tests/visual-regression.spec.ts`) - Screenshot comparison
- **Footer Tests** (`tests/footer.spec.ts`) - Footer visibility, identity, theme/language/reduced-motion/reset, quick links, Back to top
- **Mobile Sidebar Tests** (`tests/mobile-sidebar.spec.ts`) - Mobile hamburger menu, nav items, Docs/Blog panels, accessibility controls (theme, language, reduce motion, reset preferences)
- **Article listen Tests** (`tests/article-listen.spec.ts`) - Listen on SPA engineering post and AI tutorial, dark-mode toggle contrast, mobile hint, playing/pause, `extractSpeakableText`, Mermaid/code excluded from utterance (mocked `speak`), **SPA back navigation cancels speech** (instrumented `speechSynthesis.cancel`)
- **Mermaid Tests** (`tests/mermaid.spec.ts`) - Diagrams render via SPA and full-page load, three SVGs on AI tutorial, language switch stability, sequence diagram text

### Individual Test Documentation
- **[Contact API Tests](testing/contact.md)** - Testing the contact form API endpoint
- **[Health API Tests](testing/health.md)** - Testing the health check endpoint
- **[Home API Tests](testing/home.md)** - Testing the home page API
- **[Meta API Tests](testing/meta.md)** - Testing the metadata API
- **[Projects API Tests](testing/projects.md)** - Projects API, cold static/localStorage paint plus background `/api/projects` refresh, tab session and TTL caches, SPA behavior (see diagrams in that guide)
- **[Stats API Tests](testing/stats.md)** - Testing the stats API
- **[Tutorials Tests](testing/tutorials.md)** - Testing the tutorials page
- **[Blog Tests](testing/blog.md)** - Engineering and Personal listing pages, Featured Post, Latest Insights, navigation to post, post detail structure (banner, hero, body)

## Project Information

- **[Repository Analysis](REPO_ANALYSIS.md)** - Comprehensive analysis of repository structure, test coverage, and workflows
- **[Accessibility](ACCESSIBILITY.md)** - Skip link, main landmark, focus visibility, and a11y test coverage
- **[Article listen (read aloud)](ARTICLE_LISTEN.md)** - Web Speech “listen” feature for blog posts and tutorials: UX, spoken vs skipped content, i18n, SPA behavior, and tests
- **[Mermaid diagrams (SPA)](MERMAID.md)** - Lazy-loaded Mermaid, theme and i18n re-render, SPA hooks, relation to read-aloud exclusions, and Playwright coverage

## Contributing

- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[SECURITY.md](../SECURITY.md)** - Security policy and vulnerability reporting

## API Documentation

- **[OpenAPI Contract](contracts/openapi.yml)** - API specification in OpenAPI format

## Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
├── TESTING.md                   # API testing guide
├── UI_TESTING.md                # UI testing guide
├── NODE_SETUP.md                # Node.js setup guide
├── GITHUB_SECRETS.md            # GitHub secrets configuration
├── EMAIL_SETUP.md               # Email/SMTP configuration
├── TURNSTILE_SETUP.md           # Turnstile CAPTCHA setup
├── REPO_ANALYSIS.md             # Repository analysis
├── ARTICLE_LISTEN.md            # Read-aloud (Web Speech) feature for posts & tutorials
├── MERMAID.md                   # Mermaid in SPA: init, i18n, tests, troubleshooting
├── testing/                     # Individual test documentation
│   ├── contact.md
│   ├── health.md
│   ├── home.md
│   ├── meta.md
│   ├── projects.md
│   ├── stats.md
│   ├── tutorials.md
│   └── blog.md
└── contracts/                   # API contracts
    └── openapi.yml
```

## Getting Help

If you need help:
1. Check the relevant documentation above
2. Review the [README.md](../README.md) for quick start instructions
3. Check [API Deployment Guide](../api/DEPLOY.md) for deployment issues
4. Review [Node.js Setup](NODE_SETUP.md) for environment issues

## Contributing to Documentation

When adding or updating documentation:
- Follow the existing structure and format
- Update this index if adding new documentation files
- Use clear, concise language
- Include code examples where helpful
- Link to related documentation

