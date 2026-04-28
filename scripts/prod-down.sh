#!/usr/bin/env bash
# Stop the production environment
set -euo pipefail
cd "$(dirname "$0")/.."
echo "🛑  Stopping production environment..."
docker compose -f docker-compose.prod.yml down
echo "✅  Production stopped."
