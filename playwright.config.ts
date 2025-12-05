import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: path.join(rootDir, 'test-results'),
  // Enable parallel test execution within each project
  // Use 50% of available CPU cores to balance speed and resource usage
  workers: process.env.CI ? 2 : undefined, // 2 workers in CI, auto-detect locally
  fullyParallel: true, // Run all tests in parallel (within each project)
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
      use: { 
        ...devices['iPhone 13 Pro'], // iPhone emulation for mobile testing
        // Mobile devices need more time for rendering and interactions
        actionTimeout: 20_000, // 20 seconds for actions
        navigationTimeout: 45_000, // 45 seconds for navigation
      },
      testIgnore: /api.*\.spec\.ts/,
      timeout: 90_000, // 90 seconds per test (mobile is slower)
      expect: { timeout: 15_000 }, // 15 seconds for expect assertions
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox sometimes needs more time for navigation
        navigationTimeout: 60_000,
        actionTimeout: 30_000,
      },
      testIgnore: /api.*\.spec\.ts/,
      timeout: 90_000, // 90 seconds per test for Firefox
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
      // Run: bash scripts/start-api-server.sh (or use the CI workflow approach)
    },
  ],
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(rootDir, 'playwright-report') }],
  ],
});


