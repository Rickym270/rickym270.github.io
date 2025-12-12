import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// #region agent log
// Debug: Log rootDir and verify index.html exists
const logPath = path.join(rootDir, '.cursor', 'debug.log');
const logData = {
  sessionId: 'debug-session',
  runId: 'config-init',
  hypothesisId: 'A',
  location: 'playwright.config.ts:8',
  message: 'webServer configuration debug',
  data: {
    rootDir: rootDir,
    rootDirExists: fs.existsSync(rootDir),
    indexHtmlPath: path.join(rootDir, 'index.html'),
    indexHtmlExists: fs.existsSync(path.join(rootDir, 'index.html')),
    cwd: process.cwd(),
  },
  timestamp: Date.now()
};
try {
  fs.appendFileSync(logPath, JSON.stringify(logData) + '\n');
} catch (e) {
  // Ignore if log file can't be written
}
// #endregion

export default defineConfig({
  testDir: 'tests',
  timeout: process.env.CI ? 45_000 : 60_000, // Reduce timeout in CI to fail faster and allow more tests to run
  expect: { timeout: 10_000 },
  outputDir: path.join(rootDir, 'test-results'),
  // Enable parallel test execution within each project
  // Use 2 workers in CI to avoid resource contention and ensure webServer stability
  // With 3 browser projects running in parallel, 2 workers per project = 6 concurrent test executions
  workers: process.env.CI ? 2 : undefined, // 2 workers in CI, auto-detect locally
  fullyParallel: true, // Run all tests in parallel (within each project)
  use: {
    baseURL: 'http://127.0.0.1:4321', // Use 127.0.0.1 instead of localhost for better CI reliability
    trace: 'on-first-retry',
  },
  webServer: {
    // Use simple Node.js HTTP server that explicitly serves index.html for root path
    // This avoids http-server's issue with not serving index.html for / (returns 404)
    // The simple server explicitly handles / -> index.html mapping
    command: `node "${path.join(rootDir, 'scripts', 'start-web-server-simple.js')}"`,
    url: 'http://127.0.0.1:4321/index.html', // Use 127.0.0.1 for consistency
    reuseExistingServer: !process.env.CI, // Don't reuse in CI to ensure clean state
    timeout: 60_000,
    stdout: 'pipe', // Capture stdout to see server logs
    stderr: 'pipe', // Capture stderr to see server errors
    // Ensure server is actually ready before tests start
    // Playwright will wait for the URL to respond with 200 status
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
      timeout: process.env.CI ? 60_000 : 90_000, // Reduced in CI to allow more tests to complete
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
      timeout: process.env.CI ? 60_000 : 90_000, // Reduced in CI to allow more tests to complete
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


