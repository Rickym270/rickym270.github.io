import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: path.join(rootDir, 'test-results'),
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server -p 4321 -c-1 .',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    // UI tests (require browsers)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /api.*\.spec\.ts/,
    },
    {
      name: 'chromium-iphone',
      use: { ...devices['iPhone 13 Pro'] }, // iPhone emulation for mobile testing
      testIgnore: /api.*\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /api.*\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // Increased timeouts for WebKit due to slower rendering/translation timing
        // WebKit is excluded from CI but available for local testing: npm test --project=webkit
        actionTimeout: 30_000, // 30 seconds for actions (clicks, fills, etc.)
        navigationTimeout: 60_000, // 60 seconds for navigation
      },
      testIgnore: /api.*\.spec\.ts/,
      timeout: 90_000, // 90 seconds per test (increased from default 60s)
      expect: { timeout: 20_000 }, // 20 seconds for expect assertions (increased from default 10s)
    },
    // API tests (no browser needed)
    {
      name: 'api',
      testMatch: /api.*\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:8080',
      },
      dependencies: ['api-server'],
    },
    // API server startup project
    {
      name: 'api-server',
      testMatch: /$^/, // Match nothing - this is just for server startup
      webServer: {
        command: 'bash scripts/start-api-server.sh',
        url: 'http://localhost:8080/api/health',
        reuseExistingServer: true, // Reuse existing server - user must restart server with new code for status field
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },
  ],
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(rootDir, 'playwright-report') }],
  ],
});


