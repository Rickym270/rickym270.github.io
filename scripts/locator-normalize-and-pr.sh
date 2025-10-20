#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/locator-normalize-and-pr.sh [--no-pr]
#
# Behavior:
# - Creates/uses branch chore/locator-update-<RUN_ID or timestamp>
# - Runs locator normalization script
# - Restores lockfile/node_modules noise
# - Stages only tests/, scripts/update-locators.js, and package.json
# - Skips cleanly if no staged changes
# - Optionally opens a PR with gh

NO_PR=false
for arg in "$@"; do
  case "$arg" in
    --no-pr) NO_PR=true ;;
  esac
done

BRANCH="chore/locator-update-${GITHUB_RUN_ID:-$(date +%s)}"

git config user.name "github-actions[bot]" || true
git config user.email "41898282+github-actions[bot]@users.noreply.github.com" || true

git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

# Run locator normalization (uses only Node core)
node scripts/update-locators.js

# Revert incidental changes that should not drive a PR
git restore --worktree --staged yarn.lock 2>/dev/null || true
git restore yarn.lock 2>/dev/null || true
git restore --worktree --staged package-lock.json 2>/dev/null || true
git restore package-lock.json 2>/dev/null || true
git restore --worktree --staged node_modules/iconv-lite/.idea/iconv-lite.iml 2>/dev/null || true
git restore node_modules/iconv-lite/.idea/iconv-lite.iml 2>/dev/null || true

# Stage only intended files
git add -A tests 2>/dev/null || true
git add scripts/update-locators.js package.json 2>/dev/null || true

if git diff --cached --quiet; then
  echo "No locator changes to commit; skipping PR."
  exit 0
fi

git commit -m "chore(locators): normalize Playwright locators"
git push -u origin "$BRANCH"

if [ "$NO_PR" = false ]; then
  if command -v gh >/dev/null 2>&1; then
    gh pr create \
      --title "chore(locators): normalize Playwright locators" \
      --body "Automated locator normalization for nav links. Please review changes."
  else
    echo "gh CLI not found; skipping PR creation."
  fi
fi

echo "Done on branch $BRANCH"


