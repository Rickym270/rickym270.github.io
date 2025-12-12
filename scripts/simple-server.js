#!/usr/bin/env node
// Simple HTTP server that serves index.html for root path
// This ensures / always serves index.html

const http = require('http');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

// #region agent log
const logPath = path.join(__dirname, '..', '.cursor', 'debug.log');
const logData = {
  sessionId: 'debug-session',
  runId: 'simple-server-start',
  hypothesisId: 'C',
  location: 'simple-server.js:12',
  message: 'simple server starting',
  data: {
    __dirname: __dirname,
    repoRoot: path.join(__dirname, '..'),
    indexHtmlPath: path.join(__dirname, '..', 'index.html'),
    indexHtmlExists: fs.existsSync(path.join(__dirname, '..', 'index.html')),
    cwd: process.cwd(),
  },
  timestamp: Date.now()
};
try {
  fs.appendFileSync(logPath, JSON.stringify(logData) + '\n');
} catch (e) {
  // Ignore
}
// #endregion

const PORT = 4321;
const REPO_ROOT = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
  // #region agent log
  const requestLog = {
    sessionId: 'debug-session',
    runId: 'simple-server-request',
    hypothesisId: 'C',
    location: 'simple-server.js:35',
    message: 'request received',
    data: { url: req.url, method: req.method },
    timestamp: Date.now()
  };
  try {
    fs.appendFileSync(logPath, JSON.stringify(requestLog) + '\n');
  } catch (e) {
    // Ignore
  }
  // #endregion

  let filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(REPO_ROOT, filePath);
  
  // #region agent log
  const pathLog = {
    sessionId: 'debug-session',
    runId: 'simple-server-path',
    hypothesisId: 'C',
    location: 'simple-server.js:50',
    message: 'file path resolution',
    data: { 
      requestedUrl: req.url,
      resolvedPath: filePath,
      fullPath: fullPath,
      fileExists: fs.existsSync(fullPath),
    },
    timestamp: Date.now()
  };
  try {
    fs.appendFileSync(logPath, JSON.stringify(pathLog) + '\n');
  } catch (e) {
    // Ignore
  }
  // #endregion

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    
    const ext = path.extname(fullPath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
    }[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  // #region agent log
  const startLog = {
    sessionId: 'debug-session',
    runId: 'simple-server-started',
    hypothesisId: 'C',
    location: 'simple-server.js:85',
    message: 'server started successfully',
    data: { port: PORT },
    timestamp: Date.now()
  };
  try {
    fs.appendFileSync(logPath, JSON.stringify(startLog) + '\n');
  } catch (e) {
    // Ignore
  }
  // #endregion
});
