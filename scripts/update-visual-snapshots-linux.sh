#!/usr/bin/env bash
# Regenerate Playwright visual regression snapshots on Linux (Docker).
# Run from repo root: ./scripts/update-visual-snapshots-linux.sh
# Requires Docker. Updates only navbar and mobile-sidebar *-linux.png snapshots.

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "Running Playwright visual snapshot update in Linux container..."
docker run --rm \
  -v "$REPO_ROOT:/work" \
  -w /work \
  -e CI=1 \
  -e DEBIAN_FRONTEND=noninteractive \
  mcr.microsoft.com/playwright:v1.56.1-noble \
  bash -c '
    set -e
    npm ci
    node scripts/start-web-server-simple.js &
    SERVER_PID=$!
    for i in $(seq 1 15); do
      curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4321/ | grep -q 200 && break
      sleep 1
    done
    npx playwright test tests/visual-regression.spec.ts \
      -g "navbar matches visual baseline|mobile sidebar matches visual baseline" \
      --project=chromium --project=chromium-iphone --project=firefox \
      --update-snapshots
    kill $SERVER_PID 2>/dev/null || true
  '
echo "Done. Updated *-linux.png snapshots in tests/visual-regression.spec.ts-snapshots/"
