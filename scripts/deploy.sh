#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — Promote staging → production.
#
# Workflow:
#   1. Verify we're on the staging branch with a clean working tree
#   2. Back up the production database
#   3. Merge staging → master and push to GitHub
#   4. Rebuild the production app container from the new master
#   5. Restart production with zero downtime (app only, DB/Redis untouched)
#
# Usage:
#   ./scripts/deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# ── 1. Pre-flight checks ──────────────────────────────────────────────────────

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "staging" ]; then
  echo "❌  Must be on the 'staging' branch to deploy. Currently on: $CURRENT_BRANCH"
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌  Working tree has uncommitted changes. Commit or stash before deploying."
  git status --short
  exit 1
fi

if [ ! -f ".env.prod" ]; then
  echo "❌  .env.prod not found. Copy .env.prod.example and fill in production values."
  exit 1
fi

echo ""
echo "🚀  DEPLOY: staging → master → production"
echo "    Branch : $CURRENT_BRANCH"
echo "    Commit : $(git log -1 --oneline)"
echo ""
read -r -p "    Proceed? Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "    Aborted."
  exit 0
fi

# ── 2. Backup production database ─────────────────────────────────────────────

echo ""
echo "📦  Backing up production database..."

BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/prod-pre-deploy-$TIMESTAMP.sql"
mkdir -p "$BACKUP_DIR"

if docker compose -f docker-compose.prod.yml ps postgres | grep -q "running"; then
  docker exec dovetail-prod-postgres-1 \
    pg_dump -U payload payload_db > "$BACKUP_FILE"
  echo "    Saved  : $BACKUP_FILE"
else
  echo "    ⚠️   Production postgres not running — skipping DB backup."
fi

# ── 3. Merge staging → master and push to GitHub ─────────────────────────────

echo ""
echo "🔀  Merging staging → master..."
git checkout master
git merge staging --no-edit
git push origin master
echo "    ✅  Pushed to GitHub."

# ── 4. Rebuild production app container ───────────────────────────────────────

echo ""
echo "🏗️   Building production image..."
docker compose -f docker-compose.prod.yml build app
echo "    ✅  Build complete."

# ── 5. Restart app only (DB and Redis keep running) ──────────────────────────

echo ""
echo "♻️   Restarting production app..."
docker compose -f docker-compose.prod.yml up -d --no-deps app
echo "    ✅  Production updated."

# ── Done ─────────────────────────────────────────────────────────────────────

echo ""
echo "✅  DEPLOY COMPLETE"
echo "    Production : http://localhost:8090"
echo "    GitHub     : master branch updated"
if [ -f "$BACKUP_FILE" ]; then
  echo "    DB backup  : $BACKUP_FILE"
fi
echo ""

# Return to staging branch
git checkout staging
