#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# vault-unseal.sh — Unseal Vault after a container restart.
#
# Run this any time the production Vault container restarts.
# Vault always starts sealed after a restart — secrets are inaccessible
# until unsealed. The app will fail to fetch secrets until this is run.
#
# Usage:
#   ./scripts/vault-unseal.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

VAULT_CONTAINER="dovetail-prod-vault-1"

echo ""
echo "🔓  Vault Unseal"
echo ""

# Check if already unsealed
STATUS=$(docker exec "$VAULT_CONTAINER" vault status -format=json 2>/dev/null || echo '{"sealed":true}')
SEALED=$(echo "$STATUS" | python3 -c "import sys,json; print(json.load(sys.stdin).get('sealed', True))" 2>/dev/null || echo "True")

if [ "$SEALED" = "False" ]; then
  echo "    ✅  Vault is already unsealed."
  exit 0
fi

read -r -s -p "    Enter unseal key: " UNSEAL_KEY
echo ""

docker exec "$VAULT_CONTAINER" vault operator unseal "$UNSEAL_KEY"

echo ""
echo "    ✅  Vault unsealed. App secrets are now accessible."
echo ""
