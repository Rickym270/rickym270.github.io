/*
  Locator normalization helper
  - Makes Playwright link locators more reliable by enforcing exact, case-sensitive matches
  - Applies safe, idempotent text replacements across tests/**.{ts,js}
*/
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const testsDir = path.join(repoRoot, 'tests');

function listTestFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.js')))
        out.push(fullPath);
    }
  }
  return out;
}

function normalize(content) {
  let updated = content;

  // Enforce exact GitHub link locator (avoid partial/ambiguous matches)
  updated = updated.replace(
    /getByRole\(\s*['"]link['"]\s*,\s*\{\s*name:\s*['"]Github['"]\s*\}\s*\)/g,
    "getByRole('link', { name: /^Github$/ })"
  );

  // Enforce exact LinkedIn link locator (avoid partial/ambiguous matches)
  updated = updated.replace(
    /getByRole\(\s*['"]link['"]\s*,\s*\{\s*name:\s*['"]LinkedIn['"]\s*\}\s*\)/g,
    "getByRole('link', { name: /^LinkedIn$/ })"
  );

  return updated;
}

function run() {
  if (!fs.existsSync(testsDir)) {
    console.log('[locators] No tests directory found. Skipping.');
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=0\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_changes=false\n`);
    }
    process.exit(0);
  }

  const files = listTestFilesRecursive(testsDir);
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
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_changes=${changed > 0 ? 'true' : 'false'}\n`);
  }
  process.exit(0);
}

run();



