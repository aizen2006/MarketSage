#!/bin/sh
# Container entrypoint for the MarketSage core backend.
# Applies pending Prisma migrations, then starts the Elysia server.
set -e

echo "[entrypoint] Applying database migrations..."
cd /app/packages/db
bunx prisma migrate deploy

echo "[entrypoint] Starting MarketSage backend on port ${PORT:-3000}..."
cd /app/apps/backend
exec bun run src/index.ts
