#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# db-backup-remote.sh — Dump PostgreSQL and push to Hetzner Object Storage.
#
# Usage:
#   ./scripts/db-backup-remote.sh [staging|prod]   (default: staging)
#
# Prerequisites:
#   - AWS CLI installed: https://aws.amazon.com/cli/
#   - HETZNER_STORAGE_* vars set in environment or .env / .env.prod
#   - Hetzner bucket created with versioning enabled
#
# Cron (daily at 2am on VPS):
#   0 2 * * * /path/to/dovetail-works/scripts/db-backup-remote.sh prod >> /var/log/dw-backup.log 2>&1
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# ── Environment ───────────────────────────────────────────────────────────────

ENV="${1:-staging}"

if [ "$ENV" = "prod" ]; then
  ENV_FILE=".env.prod"
  CONTAINER="dovetail-prod-postgres-1"
else
  ENV_FILE=".env"
  CONTAINER="dovetail-postgres-1"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌  $ENV_FILE not found."
  exit 1
fi

# Load env vars
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# ── Validate required vars ────────────────────────────────────────────────────

REQUIRED=(
  HETZNER_STORAGE_ENDPOINT
  HETZNER_STORAGE_BUCKET
  HETZNER_STORAGE_ACCESS_KEY
  HETZNER_STORAGE_SECRET_KEY
  POSTGRES_USER
  POSTGRES_DB
)

for VAR in "${REQUIRED[@]}"; do
  if [ -z "${!VAR:-}" ]; then
    echo "❌  Missing required env var: $VAR"
    exit 1
  fi
done

# ── Backup ────────────────────────────────────────────────────────────────────

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOCAL_DIR="$PROJECT_ROOT/backups"
LOCAL_FILE="$LOCAL_DIR/${ENV}-backup-${TIMESTAMP}.sql.gz"
REMOTE_KEY="${ENV}/backup-${TIMESTAMP}.sql.gz"

mkdir -p "$LOCAL_DIR"

echo ""
echo "📦  Starting remote backup — environment: $ENV"
echo "    Container : $CONTAINER"
echo "    Local     : $LOCAL_FILE"
echo "    Remote    : s3://${HETZNER_STORAGE_BUCKET}/${REMOTE_KEY}"
echo ""

# Dump and compress in one pipe — no uncompressed file on disk
docker exec "$CONTAINER" \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$LOCAL_FILE"

LOCAL_SIZE="$(du -sh "$LOCAL_FILE" | cut -f1)"
echo "    Dump size : $LOCAL_SIZE"

# ── Upload to Hetzner Object Storage ─────────────────────────────────────────

AWS_ACCESS_KEY_ID="$HETZNER_STORAGE_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$HETZNER_STORAGE_SECRET_KEY" \
aws s3 cp "$LOCAL_FILE" "s3://${HETZNER_STORAGE_BUCKET}/${REMOTE_KEY}" \
  --endpoint-url "$HETZNER_STORAGE_ENDPOINT" \
  --no-progress

echo "    Upload    : ✅ Complete"

# ── Prune local backups older than 7 days ────────────────────────────────────

find "$LOCAL_DIR" -name "${ENV}-backup-*.sql.gz" -mtime +7 -delete
echo "    Local prune : kept last 7 days"

echo ""
echo "✅  Remote backup complete"
echo "    Bucket    : ${HETZNER_STORAGE_BUCKET}"
echo "    Key       : ${REMOTE_KEY}"
echo "    Timestamp : $TIMESTAMP"
echo ""
