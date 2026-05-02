FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# ── deps ──────────────────────────────────────────────────────────────────────
# npm install is used here instead of npm ci so a package-lock.json is generated
# on first build. Once the lockfile is committed, switch back to: npm ci
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# ── dev ───────────────────────────────────────────────────────────────────────
# Run as root in dev so the bind-mounted project dir and .next volume are writable.
# The non-root user is enforced in the prod stage.
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── migrator ──────────────────────────────────────────────────────────────────
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["node_modules/.bin/tsx", "scripts/migrate.ts"]

# ── builder ───────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── prod ──────────────────────────────────────────────────────────────────────
FROM base AS prod
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
