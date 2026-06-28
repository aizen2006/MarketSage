# syntax=docker/dockerfile:1
#
# MarketSage core backend (Elysia on Bun) — production image.
# Build from the repository root:
#   docker build -f apps/backend/Dockerfile -t marketsage-backend .

FROM oven/bun:1.3 AS base
WORKDIR /app
ENV NODE_ENV=production

# --- Dependencies -------------------------------------------------------------
# Copy only the workspace manifests first so `bun install` is cached and only
# re-runs when a dependency changes. Every workspace member's package.json must
# be present for `--frozen-lockfile` to validate against bun.lock.
COPY package.json bun.lock turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend-chat/package.json apps/frontend-chat/
COPY packages/agents/package.json packages/agents/
COPY packages/db/package.json packages/db/
COPY packages/ui/package.json packages/ui/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/

RUN bun install --frozen-lockfile

# --- Application source --------------------------------------------------------
# Only the backend and shared packages are needed at runtime (the Next.js apps
# are intentionally excluded to keep the image small).
COPY packages ./packages
COPY apps/backend ./apps/backend

# Generate the Prisma client (driver-adapter / pg — no native engine binary).
RUN cd packages/db && bunx prisma generate

EXPOSE 3000

# entrypoint.sh already arrived with the `COPY apps/backend` step above; just
# make it executable (no separate file COPY, which is brittle under cached builds).
RUN chmod +x /app/apps/backend/entrypoint.sh

# Liveness probe against the /health route using Bun's built-in fetch.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run as the non-root user shipped with the base image.
USER bun

ENTRYPOINT ["/app/apps/backend/entrypoint.sh"]
