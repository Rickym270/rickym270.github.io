#!/usr/bin/env node
// Start http-server with proper directory handling
// This script ensures the server runs from the correct directory

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate repo root (this script is in scripts/, repo root is parent)
const scriptDir = __dirname;
const repoRoot = path.resolve(scriptDir, '..');

// Log for debugging
const logPath = path.join(repoRoot, '.cursor', 'debug.log');
const logData = {
  sessionId: 'debug-session',
  runId: 'webServer-start-js',
  hypothesisId: 'C',
  location: 'start-web-server.js:15',
  message: 'webServer Node.js script starting',
  data: {
    scriptDir: scriptDir,
    repoRoot: repoRoot,
    indexHtmlPath: path.join(repoRoot, 'index.html'),
    indexHtmlExists: fs.existsSync(path.join(repoRoot, 'index.html')),
    cwd: process.cwd(),
  },
  timestamp: Date.now()
};

try {
  fs.appendFileSync(logPath, JSON.stringify(logData) + '\n');
} catch (e) {
  // Ignore if log file can't be written
}

// Change to repo root
process.chdir(repoRoot);

// Log after chdir
const logData2 = {
  sessionId: 'debug-session',
  runId: 'webServer-start-js',
  hypothesisId: 'C',
  location: 'start-web-server.js:35',
  message: 'Changed to repo root, starting http-server',
  data: {
    cwdAfterChdir: process.cwd(),
    indexHtmlExists: fs.existsSync('index.html'),
  },
  timestamp: Date.now()
};

try {
  fs.appendFileSync(logPath, JSON.stringify(logData2) + '\n');
} catch (e) {
  // Ignore if log file can't be written
}

// Start http-server with absolute path to ensure correct directory
// http-server should serve index.html for / automatically when serving a directory
// Using absolute path instead of '.' to avoid any path resolution issues
const server = spawn('npx', [
  'http-server',
  '-p', '4321',
  '-c-1',
  '-d', 'false',
  '-i', 'false',
  repoRoot  // Use absolute path instead of '.' to ensure correct directory
], {
  cwd: repoRoot,
  stdio: 'inherit', // Pass through stdout/stderr to Playwright
  shell: false
});

server.on('error', (err) => {
  const errorLog = {
    sessionId: 'debug-session',
    runId: 'webServer-start-js',
    hypothesisId: 'C',
    location: 'start-web-server.js:60',
    message: 'http-server spawn error',
    data: { error: err.message, stack: err.stack },
    timestamp: Date.now()
  };
  try {
    fs.appendFileSync(logPath, JSON.stringify(errorLog) + '\n');
  } catch (e) {
    // Ignore
  }
  process.exit(1);
});

// Forward exit code
server.on('exit', (code) => {
  process.exit(code || 0);
});
