Playwright E2E tests

Prerequisites

- Node.js 18+ installed (check with `node -v`)

Install dependencies

```bash
npm i -D @playwright/test http-server
npx playwright install
```

Run tests

```bash
# Headless (default)
npx playwright test

# Headed
npx playwright test --headed

# UI mode
npx playwright test --ui
```

What this config does

- Serves the static site from the repo root on `http://localhost:4321` before tests using `http-server`.
- Tests live in `tests/`.
- Base URL is `http://localhost:4321` so tests can `page.goto('/')`.

Common issues

- Connection failed: ensure port 4321 is free and not blocked by a firewall/VPN/proxy.
- First run is slow: `npx` may download `http-server`; installing it locally speeds it up.


