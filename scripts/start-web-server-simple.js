#!/usr/bin/env node
// Simple HTTP server that explicitly serves index.html for root path
// This avoids http-server's issue with not serving index.html for /

import { createServer } from 'http';
import { readFileSync, existsSync, statSync, appendFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

// #region agent log
// Ensure .cursor directory exists for logging (create if needed)
const logDir = join(repoRoot, '.cursor');
const logPath = join(logDir, 'debug.log');
try {
  if (!existsSync(logDir)) {
    // Create directory if it doesn't exist (for CI environments)
    mkdirSync(logDir, { recursive: true });
  }
} catch (e) {
  // Ignore if directory creation fails
}

const logData = {
  sessionId: 'debug-session',
  runId: 'webServer-simple-start',
  hypothesisId: 'D',
  location: 'start-web-server-simple.js:15',
  message: 'Simple HTTP server starting',
  data: {
    repoRoot: repoRoot,
    indexHtmlPath: join(repoRoot, 'index.html'),
    indexHtmlExists: existsSync(join(repoRoot, 'index.html')),
    port: 4321,
  },
  timestamp: Date.now()
};
try {
  appendFileSync(logPath, JSON.stringify(logData) + '\n');
} catch (e) {
  // Ignore if log file can't be written (e.g., in CI without .cursor directory)
}
// #endregion

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
  // #region agent log
  const requestLog = {
    sessionId: 'debug-session',
    runId: 'webServer-simple-request',
    hypothesisId: 'D',
    location: 'start-web-server-simple.js:45',
    message: 'HTTP request received',
    data: {
      method: req.method,
      url: req.url,
      pathname: new URL(req.url, `http://${req.headers.host}`).pathname,
    },
    timestamp: Date.now()
  };
  try {
    appendFileSync(logPath, JSON.stringify(requestLog) + '\n');
  } catch (e) {
    // Ignore
  }
  // #endregion

  // Parse URL to get pathname (handles query strings and fragments)
  // Handle edge cases where req.url might be malformed or missing
  let pathname = '/';
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1:4321'}`);
    pathname = url.pathname;
  } catch (err) {
    // If URL parsing fails, use req.url directly (fallback)
    pathname = req.url || '/';
    // #region agent log
    const urlParseError = {
      sessionId: 'debug-session',
      runId: 'webServer-simple-url-parse-error',
      hypothesisId: 'D',
      location: 'start-web-server-simple.js:80',
      message: 'URL parsing failed, using fallback',
      data: {
        requestedUrl: req.url,
        error: err.message,
        fallbackPathname: pathname,
      },
      timestamp: Date.now()
    };
    try {
      appendFileSync(logPath, JSON.stringify(urlParseError) + '\n');
    } catch (e) {
      // Ignore
    }
    // #endregion
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
    // #region agent log
    const notFoundLog = {
      sessionId: 'debug-session',
      runId: 'webServer-simple-404',
      hypothesisId: 'D',
      location: 'start-web-server-simple.js:70',
      message: 'File not found',
      data: {
        requestedPath: req.url,
        resolvedPath: fullPath,
        exists: existsSync(fullPath),
      },
      timestamp: Date.now()
    };
    try {
      appendFileSync(logPath, JSON.stringify(notFoundLog) + '\n');
    } catch (e) {
      // Ignore
    }
    // #endregion

    res.writeHead(404);
    res.end('Not found');
    return;
  }

  try {
    const content = readFileSync(fullPath);
    const ext = extname(fullPath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // #region agent log
    const successLog = {
      sessionId: 'debug-session',
      runId: 'webServer-simple-200',
      hypothesisId: 'D',
      location: 'start-web-server-simple.js:115',
      message: 'File served successfully',
      data: {
        requestedPath: req.url,
        resolvedPath: fullPath,
        contentType: contentType,
        contentLength: content.length,
      },
      timestamp: Date.now()
    };
    try {
      appendFileSync(logPath, JSON.stringify(successLog) + '\n');
    } catch (e) {
      // Ignore
    }
    // #endregion
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    // #region agent log
    const errorLog = {
      sessionId: 'debug-session',
      runId: 'webServer-simple-500',
      hypothesisId: 'D',
      location: 'start-web-server-simple.js:135',
      message: 'Error reading file',
      data: {
        requestedPath: req.url,
        resolvedPath: fullPath,
        error: err.message,
        stack: err.stack,
      },
      timestamp: Date.now()
    };
    try {
      appendFileSync(logPath, JSON.stringify(errorLog) + '\n');
    } catch (e) {
      // Ignore
    }
    // #endregion
    
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  // #region agent log
  const startedLog = {
    sessionId: 'debug-session',
    runId: 'webServer-simple-started',
    hypothesisId: 'D',
    location: 'start-web-server-simple.js:95',
    message: 'Simple HTTP server started',
    data: {
      port: PORT,
      host: '127.0.0.1',
      repoRoot: repoRoot,
    },
    timestamp: Date.now()
  };
  try {
    appendFileSync(logPath, JSON.stringify(startedLog) + '\n');
  } catch (e) {
    // Ignore
  }
  // #endregion

  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
