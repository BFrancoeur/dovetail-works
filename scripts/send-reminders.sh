#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# send-reminders.sh — Trigger the SMS reminder processor.
#
# Add to crontab on VPS for every-minute checks:
#   * * * * * /path/to/dovetail-works/scripts/send-reminders.sh >> /var/log/dw-reminders.log 2>&1
#
# Or run manually to test:
#   ./scripts/send-reminders.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load env
ENV_FILE="$PROJECT_ROOT/.env.prod"
[ ! -f "$ENV_FILE" ] && ENV_FILE="$PROJECT_ROOT/.env"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

BASE_URL="${NEXT_PUBLIC_SERVER_URL:-http://localhost:3000}"

RESPONSE=$(curl -s -X POST "${BASE_URL}/api/crm/reminders" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json")

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $RESPONSE"
