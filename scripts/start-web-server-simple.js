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

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
