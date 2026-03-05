FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies for the whole monorepo
COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile

# Generate Prisma client for the db package
RUN cd /app/packages/db && bunx prisma generate

WORKDIR /app/apps/api-backend

ENV NODE_ENV=production
EXPOSE 4001

# Entrypoint runs migrations then starts the server
COPY apps/api-backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

