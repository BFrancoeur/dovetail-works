#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# agent-kill.sh — Activate the agent kill switch immediately.
#
# Usage:
#   ./scripts/agent-kill.sh
#   ./scripts/agent-kill.sh "optional reason"
#
# Effect: Creates .agent-lock in the project root. All guarded agent actions
# will refuse to execute until agent-restore.sh removes the lock file.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOCK_FILE="$PROJECT_ROOT/.agent-lock"
REASON="${1:-Manual kill switch activation}"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "{\"activatedAt\":\"$TIMESTAMP\",\"reason\":\"$REASON\"}" > "$LOCK_FILE"

echo ""
echo "🚨  AGENT KILL SWITCH ACTIVATED"
echo "    Time   : $TIMESTAMP"
echo "    Reason : $REASON"
echo "    Lock   : $LOCK_FILE"
echo ""
echo "    All guarded agent actions are now blocked."
echo "    Run ./scripts/agent-restore.sh to restore after investigation."
echo ""
