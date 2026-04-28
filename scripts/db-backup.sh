#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# db-backup.sh — Dump the PostgreSQL database to a local backup file.
#
# Usage:
#   ./scripts/db-backup.sh
#
# Output: backups/backup-YYYYMMDD-HHMMSS.sql
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/backup-$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo ""
echo "📦  Starting database backup..."
echo "    Target : $BACKUP_FILE"

docker exec dovetail-postgres-1 \
  pg_dump -U payload payload_db > "$BACKUP_FILE"

SIZE="$(du -sh "$BACKUP_FILE" | cut -f1)"

echo "    Size   : $SIZE"
echo "    Status : ✅ Complete"
echo ""
echo "    To restore: ./scripts/db-restore.sh $BACKUP_FILE"
echo ""
