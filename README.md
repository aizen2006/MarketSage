# MarketSage

Multi-agent financial research system for quick analysis, deep research, and streaming chat experiences.

## Overview

MarketSage combines agentic workflows, structured financial data, and a modern chat interface to help users research companies, portfolios, and market events. It abstracts away the complexity of coordinating tools like vector search, web search, and document ingestion into a single API and UI. This is useful for building internal research tools, analyst copilots, or end-user finance products that need trustworthy, explainable outputs.

## Features

- **Multi-mode agents** — Quick, Deep, and Auto modes for fast answers or full research memos.
- **Streaming chat interface** — Modern Next.js chat UI with typing indicators and message streaming.
- **Deep research pipeline** — Multi-step agents that call web search, financial data APIs, and vector memory.
- **Document ingestion** — Store and search documents via Qdrant-backed semantic memory.
- **Usage & billing ready** — API key management, per-user usage logging, and payments hooks.
- **API & UI bundle** — Production chat client, API docs app, and shared UI library.
- **Dark-first design system** — Premium dark mode with consistent design tokens across apps.
- **Monorepo with shared packages** — Reusable UI, agents, and DB layer via Turborepo.

## Tech Stack

**Frontend**

- Next.js (App Router, React 19)
- TypeScript
- Tailwind CSS v4
- motion.dev for animations
- Shared UI library (`@repo/ui`)

**Backend**

- ElysiaJS (end-to-end type-safe HTTP framework)
- OpenAI Agents SDK (agent orchestration)
- Qdrant (vector search / semantic memory)
- PostgreSQL
- Prisma ORM
- Server-Sent Events (SSE) for streaming responses

**Tooling**

- Turborepo (monorepo orchestration)
- Bun (package manager & runtime)
- ESLint + Prettier

## Architecture

MarketSage is a Turborepo monorepo with four primary apps and several shared packages.

**`apps/backend`** — ElysiaJS core API. Auth & user endpoints (JWT), agent endpoints (`/agents/quick`, `/agents/deep`, `/agents/auto`), conversation endpoints backed by PostgreSQL, and streaming responses via SSE.

**`apps/api-backend`** — Optional thin API facade/proxy for edge deployments.

**`apps/frontend-chat`** — Next.js chat client. Handles auth (signin/signup), protected `/chat` route, sidebar, message list, composer, and streams responses from backend SSE endpoints.

**`apps/landing`** — Public marketing site with hero, features, pricing, and code examples. Uses shared `@repo/ui` primitives and design tokens.

**`apps/docs`** — API documentation site with sidebar nav, code blocks, callouts, and endpoint cards.

**`packages/agents`** — Core agent logic. Agent definitions (`quick_agent`, `deep_agent`, `triage_agent`), tools for web search, financial data (FMP), SEC filings, contradiction detection, memo generation, and integrations with Qdrant and caching layers.

**`packages/db`** — Prisma schema, migrations, and generated client. Encapsulates all PostgreSQL interaction.

**`packages/ui`** — Reusable UI primitives (`Button`, `Input`, `Card`, `IconButton`, `Dialog`, `ChatMessageBubble`), `ThemeProvider`, and motion presets. Used by all frontend apps.

## Project Structure

```text
marketSage
 ├── apps
 │   ├── backend            # ElysiaJS backend (auth, agents, billing)
 │   ├── api-backend        # Optional API facade / proxy
 │   ├── frontend-chat      # Next.js chat interface
 │   ├── landing            # Marketing site
 │   └── docs               # API documentation site
 ├── packages
 │   ├── agents             # Agent definitions, tools, and services
 │   ├── db                 # Prisma schema, migrations, DB client
 │   ├── ui                 # Shared React UI library (@repo/ui)
 │   ├── eslint-config      # Shared ESLint config
 │   └── typescript-config  # Shared TS configs
 ├── turbo.json
 ├── package.json
 └── README.md
```

## Installation

### Prerequisites

- Node.js `>= 18`
- [Bun](https://bun.sh) (package manager & runtime)
- PostgreSQL instance
- Qdrant instance (cloud or self-hosted)

### Setup

```bash
git clone <repo-url>
cd marketSage
bun install
```

Set up your database and run migrations:

```bash
cd packages/db
bunx prisma migrate dev
cd ../..
```

Start all development servers:

```bash
bun dev
```

To run individual apps:

```bash
bun turbo dev --filter frontend-chat
bun turbo dev --filter backend
bun turbo dev --filter landing
bun turbo dev --filter docs
```

## Environment Variables

Create `.env` files per package/app as needed. Common variables:

### Backend / Agents

```bash
PORT=3000
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@host:5432/marketsage
QDRANT_URL=https://your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key
FMP_API_KEY=your-financialmodelingprep-key
TAVILY_API_KEY=your-tavily-api-key
OPENAI_API_KEY=your-openai-api-key
API_PORT=4001
```

### Frontend / Next.js Apps

```bash
NEXT_PUBLIC_CHAT_URL=http://localhost:3000/chat
NEXT_PUBLIC_CHAT_SIGNIN_URL=http://localhost:3000/signin
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
NEXT_PUBLIC_DOCS_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_GETTING_STARTED_URL=http://localhost:3002/getting-started
NEXT_PUBLIC_LANDING_URL=http://localhost:3001
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org/marketsage
```

## Usage

### Development

```bash
bun dev
```

This starts all apps in parallel via Turborepo:

| App | URL |
|---|---|
| Backend (Elysia) | `http://localhost:3000` |
| Landing | `http://localhost:3001` |
| Docs | `http://localhost:3002` |
| Chat UI | Configured via Next.js port |

### API Example

```bash
curl -X POST "https://api.marketsage.ai/v1/agents/auto" \
  -H "x-api-key: sk_live_***" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain today'\''s move in NVDA in 4 bullets."}'
```

### Linting & Formatting

```bash
bun lint
bun run format
bun run check-types
```

## Development Guide

**Adding a new app** — Create a folder under `apps/`, add `package.json` and `tsconfig.json` using existing apps as templates.

**Extending agents** — Add tools or agents in `packages/agents`, wire them into agent definitions, and expose routes in `apps/backend`.

**Extending the database** — Modify `packages/db/prisma/schema.prisma`, run `prisma migrate`, and update affected services.

**Extending UI** — Add primitives in `packages/ui/src/primitives`, export from `src/index.ts`, and reuse across all frontend apps.

## Roadmap

- Multi-tenant support (organizations, workspaces, roles)
- Richer analytics (per-agent latency, quality metrics, dashboards)
- More tools (options pricing, portfolio backtesting, custom data connectors)
- Document ingestion UI (drag-and-drop, pipelines, status views)
- Fine-grained RBAC for API keys and users
- Deployment templates (Docker, Fly.io, Vercel + managed Postgres/Qdrant)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make your changes and add tests where applicable
4. Run `bun lint` and `bun dev` locally to verify
5. Open a pull request with a clear description

Please keep PRs focused and small where possible.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

## Acknowledgements

- [ElysiaJS](https://elysiajs.com) — Type-safe backend framework
- [Next.js](https://nextjs.org) — React framework
- [Prisma](https://prisma.io) — Database ORM
- [Qdrant](https://qdrant.tech) — Vector search engine
- [motion.dev](https://motion.dev) — Animation library
- Design inspiration from Vercel, Linear, Stripe, and Notion
