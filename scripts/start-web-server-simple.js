#!/usr/bin/env node
// Simple HTTP server that explicitly serves index.html for root path
// This avoids http-server's issue with not serving index.html for /

import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

const PORT = 4321;
const LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c';

function logEvent(location, message, data, hypothesisId) {
  const runId = process.env.CI ? 'ci' : 'local';
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6a51373e-0e77-47ee-bede-f80eb24e3f5c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),runId,hypothesisId})}).catch(()=>{});
  // #endregion
}
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = createServer((req, res) => {
  // Parse URL to get pathname (handles query strings and fragments)
  // Handle edge cases where req.url might be malformed or missing
  let pathname = '/';
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1:4321'}`);
    pathname = url.pathname;
  } catch (err) {
    // If URL parsing fails, use req.url directly (fallback)
    pathname = req.url || '/';
  }
  
  // Map root path to index.html
  let filePath = pathname === '/' ? 'index.html' : pathname;
  // Remove leading slash for path.join
  filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = join(repoRoot, filePath);

  // Security: prevent directory traversal
  if (!fullPath.startsWith(repoRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  if (!existsSync(fullPath) || !statSync(fullPath).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  try {
    const content = readFileSync(fullPath);
    const ext = extname(fullPath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(500);
    res.end('Internal server error');
  }
});

logEvent('start-web-server-simple.js:81', 'Server init', {
  port: PORT,
  host: '127.0.0.1',
  repoRoot,
  nodeVersion: process.version,
}, 'H1');

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  const address = server.address();
  logEvent('start-web-server-simple.js:90', 'Server listening', { address }, 'H1');
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
  logEvent('start-web-server-simple.js:97', 'Server error', {
    message: err?.message,
    code: err?.code,
    name: err?.name,
  }, 'H2');
  process.exit(1);
});

process.on('SIGTERM', () => {
  logEvent('start-web-server-simple.js:106', 'Server SIGTERM', {}, 'H3');
  process.exit(0);
});

process.on('SIGINT', () => {
  logEvent('start-web-server-simple.js:111', 'Server SIGINT', {}, 'H3');
  process.exit(0);
});

process.on('exit', (code) => {
  logEvent('start-web-server-simple.js:116', 'Server exit', { code }, 'H3');
});
