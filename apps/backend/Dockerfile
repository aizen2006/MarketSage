FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies for the whole monorepo
COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile

WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "start"]

