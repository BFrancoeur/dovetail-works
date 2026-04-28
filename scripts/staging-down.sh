#!/usr/bin/env bash
# Stop the staging environment
set -euo pipefail
cd "$(dirname "$0")/.."
echo "🛑  Stopping staging environment..."
docker compose down
echo "✅  Staging stopped."
