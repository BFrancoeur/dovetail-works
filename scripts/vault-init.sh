#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# vault-init.sh — Initialize Vault, load all secrets from .env.prod
#
# Run ONCE on first production deployment. Never run again on an
# already-initialized Vault — it will fail safely.
#
# Usage:
#   ./scripts/vault-init.sh
#
# Prerequisites:
#   - Production containers running: ./scripts/prod-up.sh
#   - .env.prod present with all secrets filled in
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VAULT_CONTAINER="dovetail-prod-vault-1"
VAULT_ADDR="http://localhost:8200"
ENV_FILE="$PROJECT_ROOT/.env.prod"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌  .env.prod not found."
  exit 1
fi

echo ""
echo "🔐  Vault Initialization"
echo "    Container : $VAULT_CONTAINER"
echo ""

# ── Wait for Vault to be ready ────────────────────────────────────────────────

echo "⏳  Waiting for Vault to start..."
for i in {1..30}; do
  STATUS=$(docker exec "$VAULT_CONTAINER" vault status -format=json 2>/dev/null || echo '{}')
  INITIALIZED=$(echo "$STATUS" | python3 -c "import sys,json; print(json.load(sys.stdin).get('initialized','false'))" 2>/dev/null || echo "false")
  if [ "$INITIALIZED" != "false" ] || docker exec "$VAULT_CONTAINER" vault status 2>/dev/null | grep -q "Sealed\|Initialized"; then
    break
  fi
  sleep 2
done

# ── Initialize ────────────────────────────────────────────────────────────────

echo "🔑  Initializing Vault (1 key share, threshold 1)..."
INIT_OUTPUT=$(docker exec "$VAULT_CONTAINER" \
  vault operator init -key-shares=1 -key-threshold=1 -format=json)

UNSEAL_KEY=$(echo "$INIT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['unseal_keys_b64'][0])")
ROOT_TOKEN=$(echo "$INIT_OUTPUT" | python3 -c "import sys,json; print(json.load(sys.stdin)['root_token'])")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⚠️  SAVE THESE NOW — they will never be shown again"
echo ""
echo "  Unseal Key : $UNSEAL_KEY"
echo "  Root Token : $ROOT_TOKEN"
echo ""
echo "  Store both in your password manager immediately."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -r -p "  Have you saved them? Type 'yes' to continue: " CONFIRM
[ "$CONFIRM" != "yes" ] && echo "Aborted." && exit 1

# ── Unseal ────────────────────────────────────────────────────────────────────

echo ""
echo "🔓  Unsealing Vault..."
docker exec "$VAULT_CONTAINER" vault operator unseal "$UNSEAL_KEY"

# ── Authenticate ──────────────────────────────────────────────────────────────

docker exec "$VAULT_CONTAINER" sh -c "VAULT_TOKEN=$ROOT_TOKEN vault auth -method=token $ROOT_TOKEN" 2>/dev/null || true

# ── Enable KV v2 ─────────────────────────────────────────────────────────────

echo "📂  Enabling KV v2 secret engine..."
docker exec -e "VAULT_TOKEN=$ROOT_TOKEN" "$VAULT_CONTAINER" \
  vault secrets enable -path=secret kv-v2 2>/dev/null || echo "    KV engine already enabled."

# ── Load secrets from .env.prod ───────────────────────────────────────────────

echo "📥  Loading secrets from .env.prod..."

# Read .env.prod and build vault kv put arguments
VAULT_ARGS=""
while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines and NEXT_PUBLIC_ vars (not secrets)
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue
  [[ "$line" =~ ^NEXT_PUBLIC_ ]] && continue

  KEY="${line%%=*}"
  VALUE="${line#*=}"

  # Skip empty values
  [ -z "$VALUE" ] && continue

  VAULT_ARGS="$VAULT_ARGS $KEY=$(printf '%q' "$VALUE")"
done < "$ENV_FILE"

# Write all secrets to a single KV path
eval docker exec -e "VAULT_TOKEN=$ROOT_TOKEN" "$VAULT_CONTAINER" \
  vault kv put secret/dovetail/production $VAULT_ARGS

echo "    ✅  Secrets loaded."

# ── Create app policy ─────────────────────────────────────────────────────────

echo "📋  Creating app policy..."
docker exec -e "VAULT_TOKEN=$ROOT_TOKEN" "$VAULT_CONTAINER" sh -c "
cat <<'POLICY' | vault policy write dovetail-app -
path \"secret/data/dovetail/production\" {
  capabilities = [\"read\"]
}
POLICY
"

# ── Create app token ──────────────────────────────────────────────────────────

echo "🎫  Creating app token..."
APP_TOKEN=$(docker exec -e "VAULT_TOKEN=$ROOT_TOKEN" "$VAULT_CONTAINER" \
  vault token create -policy=dovetail-app -format=json | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['auth']['client_token'])")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  App Token (add to .env.prod as VAULT_TOKEN):"
echo ""
echo "  VAULT_TOKEN=$APP_TOKEN"
echo "  VAULT_ADDR=http://vault:8200"
echo ""
echo "  Add these two lines to .env.prod, then restart the app container."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅  Vault initialization complete."
echo ""
