import { request } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c';

function logEvent(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  const runId = process.env.CI ? 'ci' : 'local';
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),runId,hypothesisId})}).catch(()=>{});
  // #endregion
  if (process.env.CI) {
    console.log(`[global-setup] ${message}`, JSON.stringify(data));
  }
}

export default async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321';
  logEvent('global-setup.ts:23', 'Global setup start', {
    baseURL,
    ci: process.env.CI,
    githubActions: process.env.GITHUB_ACTIONS,
    playwrightBaseUrl: process.env.PLAYWRIGHT_BASE_URL,
    cwd: process.cwd(),
  }, 'A');

  const repoRoot = process.cwd();
  const uiPidPath = path.join(repoRoot, 'ui-server.pid');
  const uiLogPath = path.join(repoRoot, 'ui-server.log');
  const uiPidExists = existsSync(uiPidPath);
  const uiLogExists = existsSync(uiLogPath);
  let uiPid: number | null = null;
  let uiPidAlive: boolean | null = null;
  let uiPidError: string | null = null;
  let uiLogTail: string | null = null;

  if (uiPidExists) {
    try {
      const pidRaw = readFileSync(uiPidPath, 'utf8').trim();
      uiPid = Number(pidRaw);
      if (!Number.isNaN(uiPid)) {
        try {
          process.kill(uiPid, 0);
          uiPidAlive = true;
        } catch (err) {
          uiPidAlive = false;
          uiPidError = err instanceof Error ? err.message : String(err);
        }
      }
    } catch (err) {
      uiPidError = err instanceof Error ? err.message : String(err);
    }
  }

  if (uiLogExists) {
    try {
      const logContent = readFileSync(uiLogPath, 'utf8');
      uiLogTail = logContent.slice(-2000);
    } catch (err) {
      uiPidError = err instanceof Error ? err.message : String(err);
    }
  }

  logEvent('global-setup.ts:74', 'UI server files', {
    uiPidPath,
    uiLogPath,
    uiPidExists,
    uiLogExists,
    uiPid,
    uiPidAlive,
    uiPidError,
    uiLogTail,
  }, 'D');

  const api = await request.newContext();
  const endpoints = [
    baseURL,
    `${baseURL}/index.html`,
    'http://127.0.0.1:4321',
    'http://127.0.0.1:4321/index.html',
    'http://localhost:4321',
    'http://localhost:4321/index.html',
  ];
  for (const url of endpoints) {
    try {
      const response = await api.get(url, { timeout: 5000 });
      logEvent('global-setup.ts:45', 'Base URL check', {
        url,
        status: response.status(),
        ok: response.ok(),
      }, 'B');
    } catch (error) {
      logEvent('global-setup.ts:52', 'Base URL check failed', {
        url,
        error: error instanceof Error ? error.message : String(error),
      }, 'C');
    }
  }

  await api.dispose();
  logEvent('global-setup.ts:60', 'Global setup done', { baseURL }, 'A');
}
