<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=fff" alt="Next.js" />
  <img src="https://img.shields.io/badge/Elysia-8B5CF6?logo=bun&logoColor=fff" alt="Elysia" />
  <img src="https://img.shields.io/badge/OpenAI_Agents_SDK-412991?logo=openai&logoColor=fff" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Qdrant-DC382D?logo=qdrant&logoColor=fff" alt="Qdrant" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=fff" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff" alt="Bun" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff" alt="Docker" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

# MarketSage

**Multi-agent financial research system** that combines agentic AI workflows, structured financial data, and a modern streaming chat interface to help analysts, developers, and investors research companies, evaluate portfolios, and monitor market events. MarketSage abstracts the complexity of coordinating web search, vector memory, financial APIs, and LLM reasoning into a single platform — accessible through a chat UI or a programmatic REST API.

---

## Preview

| Chat Interface | API Keys Management |
|---|---|
| `/apps/frontend-chat` — streaming chat with Quick, Deep, and Auto agent modes | `/apps/frontend-chat/api-keys` — create, manage, and test API keys |

| Landing Page | Documentation |
|---|---|
| `/apps/landing` — marketing site with hero, features, pricing, and code examples | `/apps/docs` — interactive API documentation with endpoint cards |

> Screenshots coming soon. Run `bun dev` to see the full UI locally.

---

## Features

- **Multi-mode AI agents** — Quick (fast lookups), Deep (investment-grade research memos), and Auto (intelligent triage routing)
- **Streaming chat interface** — Next.js 16 chat UI with SSE streaming, typing indicators, and markdown rendering
- **Deep research pipeline** — multi-step agents that call web search, financial data APIs, SEC filings, and vector memory to produce structured memos with bull/bear cases, scenario analysis, and contradiction detection
- **Semantic memory** — Qdrant-backed vector search for document ingestion, analysis caching, and user preference retrieval
- **Output guardrails** — dedicated guardrail agent that validates every response for compliance, accuracy, and tone before delivery
- **Programmatic API** — external REST API with API key auth, usage tracking, credit billing, and both JSON and SSE streaming endpoints
- **API key management** — in-app UI to create, copy, toggle, and test API keys with live code examples
- **Usage and billing** — per-user credit system with transaction logging and usage tracking per API key
- **Dark-first design system** — premium dark mode with consistent design tokens, shared UI primitives, and motion animations across all apps
- **Monorepo architecture** — five apps and five shared packages orchestrated by Turborepo with shared TypeScript, ESLint, and UI configurations

---

## Architecture

```mermaid
graph TD
    subgraph Clients
        Chat[Chat UI<br/>Next.js]
        Landing[Landing Page<br/>Next.js]
        Docs[API Docs<br/>Next.js]
        ExtAPI[External Client<br/>curl / SDK]
    end

    subgraph Backend Services
        Core[Core Backend<br/>ElysiaJS :3000]
        API[API Backend<br/>ElysiaJS :4001]
    end

    subgraph Agent Layer
        Triage[Triage Agent<br/>gpt-5-mini]
        Quick[Quick Agent<br/>gpt-4o-mini]
        Deep[Deep Agent<br/>gpt-5-mini]
        Guard[Guardrail Agent]
    end

    subgraph Tools
        FMP[Financial Data<br/>FMP API]
        Tavily[Web Search<br/>Tavily]
        Extract[Webpage Extractor]
        Memo[Memo Generator]
        Contra[Contradiction Detector]
        Cache[Cache Store]
    end

    subgraph Data
        PG[(PostgreSQL<br/>Prisma ORM)]
        QD[(Qdrant<br/>Vector DB)]
    end

    Chat -->|SSE stream| Core
    ExtAPI -->|x-api-key| API
    Core -->|JWT cookie auth| PG
    API -->|API key auth| PG
    Core --> Triage
    Core --> Quick
    Core --> Deep
    API --> Quick
    API --> Deep
    API --> Triage
    Triage -->|routes to| Quick
    Triage -->|routes to| Deep
    Quick --> Guard
    Deep --> Guard
    Quick --> FMP
    Quick --> Tavily
    Quick --> Extract
    Deep --> FMP
    Deep --> Tavily
    Deep --> Extract
    Deep --> Memo
    Deep --> Contra
    Deep --> Cache
    Deep --> QD
    Cache --> QD
```

### How the agent system works

1. **Triage Agent** receives every "Auto" mode query and produces a structured JSON routing decision (`quick` or `deep`) based on query complexity, intent classification, and ticker extraction.
2. **Quick Agent** handles fast lookups — single metrics, earnings summaries, price data — using financial data APIs and web search. Responses follow a strict structured format with confidence scores.
3. **Deep Agent** produces investment-grade research memos with executive summaries, bull/bear cases, scenario analysis, peer benchmarking, and contradiction detection across sources. It orchestrates a 10-step tool sequence.
4. **Guardrail Agent** validates every output for compliance — rejecting guaranteed returns, fabricated data, or promotional language, and rewriting overconfident predictions into probabilistic language.
5. Results stream to the client via **Server-Sent Events** for real-time display.

---

## Project Structure

```
marketSage/
├── apps/
│   ├── backend/            # Core API server (auth, agents, conversations, API keys, payments)
│   ├── api-backend/        # External API (API key auth, billing, JSON + SSE endpoints)
│   ├── frontend-chat/      # Chat interface with API key management page
│   ├── landing/            # Marketing site (hero, features, pricing, code examples)
│   └── docs/               # API documentation site
├── packages/
│   ├── agents/             # Agent definitions, tools, and services
│   │   ├── quick_agent.ts      # Fast-response financial analyst
│   │   ├── deep_agent.ts       # Investment-grade research analyst
│   │   ├── triage_agent.ts     # Intelligent query router
│   │   ├── tools/              # 10 agent tools (financial data, web search, memory, etc.)
│   │   └── service/            # Qdrant and caching services
│   ├── db/                 # Prisma schema, migrations, and generated client
│   ├── ui/                 # Shared React UI library (@repo/ui)
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configurations
├── .github/workflows/      # CI pipeline (lint, typecheck, build)
├── docker-compose.yml      # PostgreSQL + backend + API backend
├── turbo.json              # Turborepo pipeline configuration
└── package.json            # Workspace root
```

---

## Tech Stack

### Languages & Runtime

| | |
|---|---|
| TypeScript | End-to-end type safety across all apps and packages |
| Bun 1.3 | Package manager, runtime, and test runner |

### Frontend

| | |
|---|---|
| Next.js 16 | App Router, React 19, server and client components |
| Tailwind CSS v4 | CSS-first configuration with design tokens |
| motion.dev | Declarative animations and micro-interactions |
| React Markdown | GFM-flavored markdown rendering for agent responses |
| `@repo/ui` | Shared primitives: Button, Card, Input, IconButton, Dialog, ThemeProvider |

### Backend

| | |
|---|---|
| ElysiaJS | End-to-end type-safe HTTP framework on Bun |
| Prisma 7 | Type-safe ORM with PostgreSQL adapter |
| `@elysiajs/jwt` | JWT authentication via httpOnly cookies |
| `@elysiajs/cors` | Cross-origin request handling |
| `@elysiajs/stream` | Server-Sent Events for real-time streaming |

### AI & Agents

| | |
|---|---|
| OpenAI Agents SDK | Agent orchestration, tool calling, structured output, guardrails |
| GPT-4o-mini | Quick Agent model |
| GPT-5-mini | Deep Agent and Triage Agent model |
| Tavily | Web search tool for real-time information |
| FMP API | Structured financial data (quotes, statements, ratios, DCF, estimates) |
| fastembed | Local embedding generation for vector search |

### Data

| | |
|---|---|
| PostgreSQL 16 | Primary database for users, conversations, API keys, billing |
| Qdrant | Vector database for semantic search, document storage, and analysis caching |

### Infrastructure

| | |
|---|---|
| Turborepo | Monorepo build orchestration with caching |
| Docker | Containerized deployment (Bun-based images) |
| GitHub Actions | CI pipeline: lint → typecheck → build |
| Vercel | Frontend deployment (chat, landing, docs) |
| Render | Backend deployment (core API, API backend) |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- Node.js >= 18
- PostgreSQL instance (local, Docker, or managed)
- Qdrant instance (cloud or self-hosted) — optional, agents degrade gracefully

### Installation

```bash
git clone https://github.com/your-org/marketsage.git
cd marketsage
bun install
```

### Database Setup

```bash
cd packages/db
bunx prisma generate
bunx prisma migrate dev
cd ../..
```

### Environment Variables

Create `.env` files in the relevant app/package directories. All variables:

#### Backend & Agents

```env
# Authentication
JWT_SECRET=your-jwt-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/marketsage?schema=public

# AI providers
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
FMP_API_KEY=your-fmp-key

# Vector database (optional — agents degrade gracefully without it)
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key

# CORS
CORS_ORIGIN=http://localhost:3001

# API backend port (api-backend only)
API_PORT=4001
```

#### Frontend Apps

```env
# Core backend URL (used by chat app for auth and agent calls)
NEXT_PUBLIC_API_URL=http://localhost:3000

# API backend URL (used in API keys page code examples)
NEXT_PUBLIC_API_BACKEND_URL=https://marketsage-eklj.onrender.com

# Cross-app navigation URLs
NEXT_PUBLIC_CHAT_URL=http://localhost:3001/chat
NEXT_PUBLIC_CHAT_SIGNIN_URL=http://localhost:3001/signin
NEXT_PUBLIC_DOCS_URL=http://localhost:3002
NEXT_PUBLIC_LANDING_URL=http://localhost:3001
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org/marketsage
```

### Running the Project

Start all apps in parallel:

```bash
bun dev
```

Or run individual apps:

```bash
bun turbo dev --filter backend         # Core API on :3000
bun turbo dev --filter api_backend     # External API on :4001
bun turbo dev --filter frontend-chat   # Chat UI
bun turbo dev --filter landing         # Marketing site
bun turbo dev --filter docs            # Documentation
```

| App | Default URL |
|---|---|
| Core Backend | `http://localhost:3000` |
| API Backend | `http://localhost:4001` |
| Chat UI | `http://localhost:3001` |
| Landing Page | `http://localhost:3002` |
| Docs | `http://localhost:3003` |

---

## API Reference

### Core Backend (`/agents`) — Cookie Auth (SSE)

Used by the chat UI. Requires JWT cookie from `/auth/signin`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Create account |
| `POST` | `/auth/signin` | Sign in, sets `auth` cookie |
| `GET` | `/agents/quick?message=...` | Stream Quick Agent response (SSE) |
| `GET` | `/agents/deep?message=...` | Stream Deep Agent response (SSE) |
| `GET` | `/agents/auto?message=...` | Stream Auto-routed response (SSE) |
| `POST` | `/apikeys/create` | Create a new API key |
| `GET` | `/apikeys/` | List user's API keys |
| `PUT` | `/apikeys/` | Enable/disable an API key |

### API Backend (`/v1/agents`) — API Key Auth

Used by external clients. Requires `x-api-key` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/agents/quick` | Quick Agent (JSON response) |
| `POST` | `/v1/agents/deep` | Deep Agent (JSON response) |
| `POST` | `/v1/agents/auto` | Auto-routed Agent (JSON response) |
| `GET` | `/v1/agents/quick/stream?prompt=...` | Quick Agent (SSE stream) |
| `GET` | `/v1/agents/deep/stream?prompt=...` | Deep Agent (SSE stream) |
| `GET` | `/v1/agents/auto/stream?prompt=...` | Auto-routed Agent (SSE stream) |

### Example Request

```bash
curl -X POST "https://marketsage-eklj.onrender.com/v1/agents/quick" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-or-v1-your-key" \
  -d '{"prompt": "Summarize AAPL earnings"}'
```

---

## Agent Tools

The Deep Agent has access to all 10 tools. The Quick Agent uses a focused subset.

| Tool | Description | Used by |
|---|---|---|
| `fin_research` | Financial data from FMP — quotes, profiles, income statements, balance sheets, cash flow, ratios, DCF, analyst estimates | Quick, Deep |
| `web_search` | Real-time web search via Tavily | Quick, Deep |
| `extract_webpage` | Extract and parse content from a URL | Quick, Deep |
| `qdrant_search` | Semantic search across vector collections | Deep |
| `qdrant_document_search` | Search indexed financial documents | Deep |
| `qdrant_retrieve` | Retrieve user memories and preferences | Deep |
| `qdrant_store` | Embed and store text into vector collections | Deep |
| `cache_store` | Cache completed analyses for future retrieval | Deep |
| `generate_memo` | Generate structured investment research memos | Deep |
| `contradiction_detector` | Detect contradictions across multiple data sources | Deep |

---

## Database

MarketSage uses **PostgreSQL** via **Prisma ORM**. The schema lives in `packages/db/prisma/schema.prisma`.

| Model | Purpose |
|---|---|
| `User` | Accounts with email/password auth and credit balance |
| `Conversation` | Chat sessions tied to a user |
| `Message` | Individual messages (USER, ASSISTANT, SYSTEM roles) |
| `Apikeys` | API keys for programmatic access with enable/disable toggle |
| `Transactions` | Credit purchase/top-up records |
| `UsageLogs` | Per-call usage tracking linked to user and API key |

```
User 1──* Conversation 1──* Message
User 1──* Apikeys 1──* UsageLogs
User 1──* Transactions
```

---

## Deployment

### Docker Compose (recommended for self-hosting)

```bash
docker compose up -d
```

This starts three services:

| Service | Port | Image |
|---|---|---|
| `db` | 5432 | `postgres:16-alpine` |
| `backend` | 3000 | Built from `apps/backend/Dockerfile` |
| `api-backend` | 4001 | Built from `apps/api-backend/Dockerfile` |

Both backend Dockerfiles use `oven/bun:1`, install the full monorepo, generate the Prisma client, and run migrations on startup via an entrypoint script.

### Vercel (frontend apps)

Deploy each Next.js app as a separate Vercel project:

```
Root Directory: apps/frontend-chat   (or apps/landing, apps/docs)
Build Command:  bun run build
Output:         .next
```

Set the appropriate `NEXT_PUBLIC_*` environment variables in Vercel's dashboard.

### Render (backend services)

Deploy each backend as a **Docker** web service pointing to the repo root with the appropriate Dockerfile path.

| Service | Dockerfile | Port |
|---|---|---|
| Core Backend | `apps/backend/Dockerfile` | 3000 |
| API Backend | `apps/api-backend/Dockerfile` | 4001 |

---

## Development

### Linting & Formatting

```bash
bun lint                  # ESLint across all packages
bun run format            # Prettier formatting
bun run check-types       # TypeScript type checking
```

### CI Pipeline

GitHub Actions runs on every push to `main`/`develop` and every PR:

1. **Lint & Typecheck** — installs deps, generates Prisma client, runs `bun lint` and `bun check-types`
2. **Build** — runs `bun build` via Turborepo (on `main` only)

### Extending the Project

**Add a new agent tool** — create a file in `packages/agents/tools/`, export from `tools/index.ts`, and add to the relevant agent's `tools` array.

**Add a new backend module** — create a folder in `apps/backend/src/modules/`, define model/service/route files, and mount with `.use()` in `app.ts`.

**Add a UI primitive** — create a component in `packages/ui/src/primitives/`, export from `src/index.ts`, and use across all frontend apps as `@repo/ui`.

**Modify the database** — edit `packages/db/prisma/schema.prisma`, run `bunx prisma migrate dev`, and update affected services.

---

## Roadmap

- [ ] Multi-tenant workspaces with organization-level billing and RBAC
- [ ] Real-time streaming in the API backend (currently JSON + SSE)
- [ ] Document ingestion UI with drag-and-drop upload and processing pipelines
- [ ] Portfolio backtesting and options pricing tools
- [ ] Per-agent latency and quality metrics dashboard
- [ ] Mobile-responsive chat interface improvements
- [ ] Fine-grained API key scoping (per-agent, rate limits)
- [ ] Deployment templates for Fly.io, Railway, and managed Postgres/Qdrant

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Make changes and verify locally: `bun lint && bun dev`
4. Open a pull request with a clear description

Please keep PRs focused and small where possible.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [ElysiaJS](https://elysiajs.com) — type-safe HTTP framework for Bun
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) — agent orchestration
- [Next.js](https://nextjs.org) — React framework
- [Prisma](https://prisma.io) — database ORM
- [Qdrant](https://qdrant.tech) — vector search engine
- [Financial Modeling Prep](https://financialmodelingprep.com) — financial data API
- [Tavily](https://tavily.com) — web search API
- [motion.dev](https://motion.dev) — animation library
- Design inspiration from Vercel, Linear, Stripe, and Notion
