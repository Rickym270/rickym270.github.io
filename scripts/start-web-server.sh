#!/bin/bash
# Start http-server with proper directory handling
# This script ensures the server runs from the correct directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Log for debugging
LOG_FILE="$REPO_ROOT/.cursor/debug.log"
echo "{\"sessionId\":\"debug-session\",\"runId\":\"webServer-start\",\"hypothesisId\":\"B\",\"location\":\"start-web-server.sh:8\",\"message\":\"webServer script starting\",\"data\":{\"scriptDir\":\"$SCRIPT_DIR\",\"repoRoot\":\"$REPO_ROOT\",\"indexHtmlExists\":$(test -f "$REPO_ROOT/index.html" && echo "true" || echo "false"),\"cwd\":\"$(pwd)\"},\"timestamp\":$(date +%s)000}" >> "$LOG_FILE"

# Change to repo root and start server
cd "$REPO_ROOT"
exec npx http-server -p 4321 -c-1 -d false -i false .

