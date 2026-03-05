FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies for the whole monorepo
COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile

WORKDIR /app/apps/frontend-chat

ENV NODE_ENV=production

RUN bun x next build

EXPOSE 3001

CMD ["bun", "x", "next", "start", "-p", "3001"]

