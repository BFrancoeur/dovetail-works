#!/usr/bin/env bash
# Start the staging environment (current branch, dev build, ports 8080/8443)
set -euo pipefail
cd "$(dirname "$0")/.."
echo "🔧  Starting staging environment..."
docker compose up -d
echo "✅  Staging running at http://localhost:8080"
