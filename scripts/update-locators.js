/*
  Minimal locator normalization script.
  - Enforce exact-name regex for common links to avoid strict mode ambiguity
  - Safe, idempotent text replacements across tests/*.ts
*/
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const testsDir = path.join(repoRoot, 'tests');

function listTestFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
    .map((f) => path.join(dir, f));
}

function normalize(content) {
  let updated = content;

  // Enforce exact GitHub link locator
  updated = updated.replace(
    /getByRole\(\s*['"]link['"]\s*,\s*\{\s*name:\s*['"]Github['"]\s*\}\s*\)/g,
    "getByRole('link', { name: /^Github$/ })"
  );

  // Enforce exact LinkedIn link locator
  updated = updated.replace(
    /getByRole\(\s*['"]link['"]\s*,\s*\{\s*name:\s*['"]LinkedIn['"]\s*\}\s*\)/g,
    "getByRole('link', { name: /^LinkedIn$/ })"
  );

  return updated;
}

function run() {
  const files = listTestFiles(testsDir);
  let changed = 0;
  files.forEach((file) => {
    const orig = fs.readFileSync(file, 'utf8');
    const out = normalize(orig);
    if (out !== orig) {
      fs.writeFileSync(file, out, 'utf8');
      changed += 1;
      console.log(`[locators] Updated: ${path.relative(repoRoot, file)}`);
    }
  });
  console.log(`[locators] Completed. Files changed: ${changed}`);
  process.exit(0);
}

run();



