#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# agent-restore.sh — Deactivate the agent kill switch after investigation.
#
# Usage:
#   ./scripts/agent-restore.sh
#
# Effect: Removes .agent-lock from the project root. Guarded agent actions
# will resume. Only run this after you have investigated why the kill switch
# was triggered and confirmed it is safe to proceed.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOCK_FILE="$PROJECT_ROOT/.agent-lock"

if [ ! -f "$LOCK_FILE" ]; then
  echo ""
  echo "ℹ️   Kill switch is not active — nothing to restore."
  echo ""
  exit 0
fi

# Show what was locked and why before removing
echo ""
echo "📋  Kill switch status before restore:"
cat "$LOCK_FILE" | python3 -m json.tool 2>/dev/null || cat "$LOCK_FILE"
echo ""

rm "$LOCK_FILE"

echo "✅  AGENT KILL SWITCH DEACTIVATED"
echo "    Removed : $LOCK_FILE"
echo "    Time    : $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""
echo "    Agent actions are restored. Monitor Slack for any unexpected activity."
echo ""
