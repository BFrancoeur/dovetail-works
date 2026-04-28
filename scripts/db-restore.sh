#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# db-restore.sh — Restore the PostgreSQL database from a backup file.
#
# Usage:
#   ./scripts/db-restore.sh backups/backup-YYYYMMDD-HHMMSS.sql
#
# ⚠️  WARNING: This will DROP and recreate the database. All current data
#     will be permanently replaced with the backup contents.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./scripts/db-restore.sh <backup-file>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌  Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo ""
echo "⚠️   DATABASE RESTORE"
echo "    Source : $BACKUP_FILE"
echo ""
read -r -p "    This will REPLACE all current data. Type 'yes' to continue: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "    Aborted."
  exit 0
fi

echo ""
echo "🔄  Restoring..."

docker exec -i dovetail-postgres-1 \
  psql -U payload -c "DROP DATABASE IF EXISTS payload_db;" postgres

docker exec -i dovetail-postgres-1 \
  psql -U payload -c "CREATE DATABASE payload_db;" postgres

docker exec -i dovetail-postgres-1 \
  psql -U payload payload_db < "$BACKUP_FILE"

echo "    Status : ✅ Restore complete"
echo ""
