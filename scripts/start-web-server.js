#!/usr/bin/env node
// Start http-server with proper directory handling
// This script ensures the server runs from the correct directory

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate repo root (this script is in scripts/, repo root is parent)
const scriptDir = __dirname;
const repoRoot = path.resolve(scriptDir, '..');

// Change to repo root
process.chdir(repoRoot);

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
  console.error('http-server spawn error:', err);
  process.exit(1);
});

// Forward exit code
server.on('exit', (code) => {
  process.exit(code || 0);
});
