# syntax=docker/dockerfile:1
#
# MarketSage core backend (Elysia on Bun) — production image.
# Build from the repository root:
#   docker build -f apps/backend/Dockerfile -t marketsage-backend .

FROM oven/bun:1.3 AS base
WORKDIR /app
ENV NODE_ENV=production

# --- Dependencies -------------------------------------------------------------
COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/
COPY packages/db/package.json packages/db/
COPY packages/agents/package.json packages/agents/
RUN bun install

# --- Application source --------------------------------------------------------
COPY packages/db ./packages/db
COPY packages/agents ./packages/agents
COPY apps/backend ./apps/backend

# Generate the Prisma client (driver-adapter / pg — no native engine binary).
RUN cd packages/db && bunx prisma generate

EXPOSE 3000

# Make the entrypoint executable (it arrived with the COPY apps/backend step).
RUN chmod +x /app/apps/backend/entrypoint.sh

# Liveness probe against the /health route using Bun's built-in fetch.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run as the non-root user shipped with the base image.
USER bun

ENTRYPOINT ["/app/apps/backend/entrypoint.sh"]
