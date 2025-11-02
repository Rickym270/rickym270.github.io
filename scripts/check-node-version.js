#!/usr/bin/env node
/**
 * Check if Node.js version matches .nvmrc requirements
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

try {
  const nvmrcVersion = readFileSync(join(rootDir, '.nvmrc'), 'utf-8').trim();
  const nodeVersion = process.version.replace('v', '');
  const nodePath = process.execPath;
  
  // Check if using Homebrew node (which has the simdjson issue)
  if (nodePath.includes('/usr/local/Cellar/node/') || nodePath.includes('/opt/homebrew/Cellar/node/')) {
    console.error(`❌ Detected Homebrew Node.js which may have dependency issues!`);
    console.error(`   Current Node: ${process.version} at ${nodePath}`);
    console.error(`   Required: v${nvmrcVersion} from nvm`);
    console.error(`\n   Please run: nvm use`);
    console.error(`   Or restart your terminal to load nvm.`);
    process.exit(1);
  }
  
  // Check version matches
  const requiredMajorMinor = nvmrcVersion.split('.').slice(0, 2).join('.');
  const currentMajorMinor = nodeVersion.split('.').slice(0, 2).join('.');
  
  if (currentMajorMinor !== requiredMajorMinor) {
    console.error(`❌ Node version mismatch!`);
    console.error(`   Current: ${process.version}`);
    console.error(`   Required: v${nvmrcVersion}`);
    console.error(`   Run: nvm use`);
    process.exit(1);
  }
} catch (error) {
  // If .nvmrc doesn't exist, just continue
  if (error.code !== 'ENOENT') {
    console.warn('⚠️  Error reading .nvmrc:', error.message);
  }
}

