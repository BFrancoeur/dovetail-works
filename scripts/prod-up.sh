#!/usr/bin/env bash
# Start the production environment (prod build, ports 8090/8453, restart: always)
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f ".env.prod" ]; then
  echo "❌  .env.prod not found. Copy .env.prod.example and fill in production values."
  exit 1
fi

echo "🚀  Starting production environment..."
docker compose -f docker-compose.prod.yml up -d
echo "✅  Production running at http://localhost:8090"
