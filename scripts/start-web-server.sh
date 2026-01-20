#!/bin/bash
# Start http-server with proper directory handling
# This script ensures the server runs from the correct directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to repo root and start server
cd "$REPO_ROOT"
exec npx http-server -p 4321 -c-1 -d false -i false .

