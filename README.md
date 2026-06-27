

<h1 align="center">MarketSage</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Bun-1.3-000000?logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Elysia-0F172A?logo=elysia&logoColor=white" alt="Elysia" />
  <img src="https://img.shields.io/badge/OpenAI_Agents_SDK-412991?logo=openai&logoColor=white" alt="OpenAI Agents SDK" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Pinecone-000000?logo=pinecone&logoColor=white" alt="Pinecone" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

MarketSage is a multi-agent financial research platform. It pairs a streaming chat experience with a programmatic REST API, and coordinates web search, financial data providers, retrieval-augmented memory, and LLM reasoning to help research companies, evaluate fundamentals, and track market events.

The system runs three cooperating agents — Quick, Deep, and a Triage router — backed by retrieval-augmented generation (RAG) over a Pinecone vector store, and ships as a Bun-powered Turborepo monorepo.

---

## Highlights

- **Three agent modes** — Quick for fast lookups, Deep for investment-grade research memos, and Auto, where a Triage agent routes the query to the right one. All run on `gpt-5.4-mini`.
- **Retrieval-augmented generation** — every request runs a Pinecone semantic search *before* the model is invoked and stores the result *after* it responds, so the system accumulates a searchable memory of prior research.
- **Per-user memory** — retrieval is filtered by user, so each user only sees context from their own earlier research.
- **Financial data tools** — Financial Modeling Prep for structured fundamentals, plus an Alpha Vantage MCP server for market data and technical indicators.
- **Web tools** — Tavily-powered search, deep multi-source research, and page extraction.
- **Output guardrails** — a guardrail agent reviews every response for compliance and tone before it reaches the user.
- **Edge response caching** — read-heavy, non-chat endpoints (credits, usage logs, transactions, conversations, insights, API keys) are cached per user in Cloudflare KV with short TTLs and explicit invalidation, so the dashboard loads instantly while staying accurate.
- **Programmatic API** — an API-key-authenticated backend with usage tracking, credit billing, and both JSON and SSE streaming endpoints.
- **Monorepo** — five apps and shared packages orchestrated by Turborepo on Bun.

---

## How retrieval works

Retrieval lives in the agent service layer of both backends, so it applies the same way to every mode (`auto`, `quick`, `deep`):

1. **Retrieve — before the chat.** The user's message is run through `semantic_search` against the Pinecone `finance` namespace, filtered by `userId`. Matches are formatted into a context block and appended to the prompt.
2. **Run the agent.** The augmented prompt is sent to the selected agent. If retrieval returns nothing or fails, the chat continues anyway — RAG is best-effort and never blocks a response.
3. **Persist — after the chat.** The completed answer is stored back into Pinecone via `upsert_data`, tagged with `userId`, `mode`, and a timestamp, so it can ground future questions.

Pinecone uses **integrated embedding**: the index embeds the `text` field server-side through `upsertRecords` and `searchRecords`, so the application performs no separate embedding step.

> [!NOTE]
> The `finance` namespace starts empty, so early conversations retrieve little until results accumulate. The same `upsert_data` path can be used to seed it with primary-source data such as filings and news.

---

## How response caching works

The core backend's non-chat `GET` endpoints are read often but change rarely, so their responses are cached per user in **Cloudflare KV**. Chat/agent endpoints are never cached (LLM output is non-deterministic), but because a chat spends credits and writes a usage log, it invalidates the affected caches.

1. **Read-through.** A cached endpoint first checks KV under a per-user key (`user:{userId}:{resource}`). On a hit it returns the stored value; on a miss it runs the database query, writes the result with a TTL, and returns it.
2. **TTL + explicit invalidation.** Each resource has a short TTL *and* its key is deleted whenever the underlying data changes — so the UI is always fresh, never just eventually consistent.
3. **Best-effort.** Every KV call is wrapped so that any cache failure logs and falls back to the database. Caching can never break a route.

The helper lives in `apps/backend/src/utils/cache.ts` (`cached`, `invalidate`, `cacheKey`, `TTL`), built on the Cloudflare KV bulk helpers in `apps/backend/src/utils/cloudflare.ts`.

| Cached endpoint | TTL | Invalidated by |
|---|---|---|
| `GET /user/credits` | 60s | chat (auto/quick/deep), `POST /payments/onramp` |
| `GET /user/usageLog` | 120s | chat |
| `GET /user/transactions` | 300s | `POST /payments/onramp` |
| `GET /user/conversations` | 60s | `POST` / `PATCH /user/conversations*` |
| `GET /user/insights` | 120s | chat, `POST /payments/onramp` |
| `GET /apikeys/` | 300s | `POST /apikeys/create`, `PUT /apikeys` |

---

## How the agent system works

1. **Triage agent** handles every "Auto" query and returns a routing decision (`quick` or `deep`) based on the query's complexity and intent.
2. **Quick agent** answers fast lookups — single metrics, summaries, recent figures — using web search and financial data, with structured output and confidence scores.
3. **Deep agent** produces institutional-quality memos: executive summary, evidence-backed analysis, assumptions, and cross-source verification, drawing on financial data, web research, and the Alpha Vantage MCP server.
4. **Guardrail agent** validates each response — rejecting guaranteed returns, fabricated figures, or promotional language, and softening overconfident claims into probabilistic language.
5. Responses stream to the client over Server-Sent Events.

---

## Architecture

```mermaid
graph TD
    subgraph Clients
        Chat[Chat UI - Next.js]
        Landing[Landing - Next.js]
        Docs[API Docs - Next.js]
        ExtAPI[External Client - curl / SDK]
    end

    subgraph Backends
        Core[Core Backend - Elysia :3000]
        API[API Backend - Elysia :4001]
    end

    subgraph RAG
        Search[semantic_search]
        Store[upsert_data]
    end

    subgraph Agents
        Triage[Triage - gpt-5.4-mini]
        Quick[Quick - gpt-5.4-mini]
        Deep[Deep - gpt-5.4-mini]
        Guard[Guardrail]
    end

    subgraph Tools
        FMP[Financial data - FMP]
        AV[Alpha Vantage - MCP]
        Web[Web search / research / extract - Tavily]
    end

    subgraph Data
        PG[(PostgreSQL - Prisma)]
        PC[(Pinecone - Vector DB)]
    end

    Chat -->|SSE, JWT cookie| Core
    ExtAPI -->|x-api-key| API
    Core --> PG
    API --> PG

    Core --> Search
    API --> Search
    Search --> PC
    Search --> Triage
    Triage -->|routes to| Quick
    Triage -->|routes to| Deep

    Quick --> Web
    Deep --> Web
    Deep --> FMP
    Deep --> AV

    Quick --> Guard
    Deep --> Guard
    Guard --> Store
    Store --> PC
```

---

## Project structure

```
marketSage/
├── apps/
│   ├── backend/            # Core API: auth, agents (RAG), conversations, API keys, payments, user
│   │   └── src/
│   │       ├── modules/agents/service.ts   # RAG flow + agent orchestration
│   │       ├── utils/pinecone.ts           # Pinecone upsert + semantic search
│   │       ├── utils/cloudflare.ts         # Cloudflare KV bulk helpers
│   │       └── utils/cache.ts              # Per-user response cache (read-through + invalidation)
│   ├── api-backend/        # External API: API-key auth, billing, JSON + SSE endpoints
│   │   └── src/
│   │       ├── modules/agents/service.ts   # RAG flow (runOnce + stream)
│   │       └── utils/pinecone.ts           # Pinecone upsert + semantic search
│   ├── frontend-chat/      # Chat UI with API-key management page
│   ├── landing/            # Marketing site
│   └── docs/               # API documentation site
├── packages/
│   ├── agents/             # Agent definitions and tools
│   │   ├── triage_agent.ts     # Router
│   │   ├── quick_agent.ts      # Fast-response analyst
│   │   ├── deep_agent.ts       # Investment-grade analyst (+ Alpha Vantage MCP)
│   │   ├── tools/              # web_search.ts (search/research/extract), fin_research.ts
│   │   └── utils/tavily.ts     # Tavily client
│   ├── db/                 # Prisma schema, migrations, generated client
│   ├── ui/                 # Shared React UI library (@repo/ui)
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configurations
├── docker-compose.yml      # PostgreSQL + backend + api-backend
├── turbo.json              # Turborepo pipeline
└── package.json            # Workspace root
```

---

## Tech stack

| Area | Technologies |
|---|---|
| Language & runtime | TypeScript, Bun 1.3 |
| Frontend | Next.js 16 (App Router, React 19), Tailwind CSS v4, motion.dev, React Markdown, shared `@repo/ui` primitives |
| Backend | ElysiaJS on Bun, Prisma 7, `@elysiajs/jwt` (cookie auth), `@elysiajs/cors` |
| Agents | OpenAI Agents SDK, `gpt-5.4-mini` for the Triage, Quick, Deep, and Title agents, output guardrails |
| Tools & data APIs | Tavily (search, research, extract), Financial Modeling Prep (fundamentals), Alpha Vantage MCP server (market data and indicators) |
| Data stores | PostgreSQL 16, Pinecone (integrated-embedding vector store for RAG), Cloudflare KV (per-user response cache) |
| Tooling | Turborepo, Docker, Prettier, ESLint |

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- A PostgreSQL instance (local, Docker, or managed)
- A Pinecone index created with an **integrated embedding model**, configured so the embedded field is named `text`
- A Cloudflare account with a **Workers KV namespace** and an API token scoped to Workers KV (for the response cache)

### Installation

```bash
git clone https://github.com/your-org/marketsage.git
cd marketsage
bun install
```

### Database setup

```bash
cd packages/db
bunx prisma generate
bunx prisma migrate dev
cd ../..
```

### Environment variables

Create `.env` files in the relevant apps and packages.

#### Backend & agents

```env
# Auth & database
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/marketsage?schema=public

# LLM and tools
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
FMP_API_KEY=your-fmp-key

# Vector store (RAG)
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX=your-index-name

# Response cache (Cloudflare KV)
CLOUDFLARE_API_KEY=your-cloudflare-api-token
ACCOUNT_ID=your-cloudflare-account-id
NAMESPACE_ID=your-kv-namespace-id

# Networking
CORS_ORIGIN=http://localhost:3001
API_PORT=4001   # api-backend only
```

#### Frontend apps

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:4001
NEXT_PUBLIC_CHAT_URL=http://localhost:3001/chat
NEXT_PUBLIC_CHAT_SIGNIN_URL=http://localhost:3001/signin
NEXT_PUBLIC_DOCS_URL=http://localhost:3002
NEXT_PUBLIC_LANDING_URL=http://localhost:3001
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org/marketsage
```

### Running the project

```bash
bun dev                                  # all apps in parallel
```

Or per app:

```bash
bun turbo dev --filter backend           # Core API on :3000
bun turbo dev --filter api_backend       # External API on :4001
bun turbo dev --filter frontend-chat     # Chat UI
bun turbo dev --filter landing           # Marketing site
bun turbo dev --filter docs              # Documentation
```

| App | Default URL |
|---|---|
| Core backend | `http://localhost:3000` |
| API backend | `http://localhost:4001` |
| Chat UI | `http://localhost:3001` |
| Landing | `http://localhost:3002` |
| Docs | `http://localhost:3003` |

---

## API reference

RAG retrieval and persistence run transparently on every agent call.

### Core backend — cookie auth

Used by the chat UI. Agent routes require the JWT cookie set by `/auth/signin`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Create an account |
| `POST` | `/auth/signin` | Sign in and set the `auth` cookie |
| `POST` | `/agents/quick/json` | Quick agent (JSON) |
| `POST` | `/agents/deep/json` | Deep agent (JSON) |
| `POST` | `/agents/auto/json` | Auto-routed response (JSON) |
| `POST` | `/agents/title` | Generate a short conversation title |
| `POST` | `/apikeys/create` | Create an API key |
| `GET` | `/apikeys/` | List the user's API keys |
| `PUT` | `/apikeys/` | Enable or disable an API key |

The backend also exposes user dashboard routes (`/user/credits`, `/user/usageLog`, `/user/transactions`, `/user/conversations`, `/user/insights`). Their `GET` responses are cached per user in Cloudflare KV — see [How response caching works](#how-response-caching-works).

### API backend — API-key auth

Used by external clients. Requires an `x-api-key` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/agents/quick` | Quick agent (JSON) |
| `POST` | `/v1/agents/deep` | Deep agent (JSON) |
| `POST` | `/v1/agents/auto` | Auto-routed agent (JSON) |
| `GET` | `/v1/agents/quick/stream?prompt=...` | Quick agent (SSE) |
| `GET` | `/v1/agents/deep/stream?prompt=...` | Deep agent (SSE) |
| `GET` | `/v1/agents/auto/stream?prompt=...` | Auto-routed agent (SSE) |

### Example request

```bash
curl -X POST "http://localhost:4001/v1/agents/quick" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"prompt": "Summarize AAPL earnings"}'
```

---

## Agent tools

| Tool | Description | Used by |
|---|---|---|
| `web_search` | Tavily web search returning ranked pages with titles, URLs, and snippets | Quick, Deep |
| `web_research` | Tavily multi-source deep research (`auto` / `mini` / `pro`) that synthesizes a structured report | Quick, Deep |
| `web_extract` | Tavily page-content extraction for known URLs (`basic` / `advanced`, markdown or text) | Quick, Deep |
| `fin_research` | Financial Modeling Prep data — quotes, profiles, statements, ratios, DCF, analyst estimates | Deep |
| Alpha Vantage MCP | Hosted MCP server for market data and technical indicators | Deep |

---

## Database

MarketSage uses PostgreSQL through Prisma ORM. The schema lives in `packages/db/prisma/schema.prisma`.

| Model | Purpose |
|---|---|
| `User` | Accounts with email/password auth and a credit balance |
| `Conversation` | Chat sessions belonging to a user |
| `Message` | Individual messages (USER, ASSISTANT, SYSTEM) |
| `Apikeys` | API keys for programmatic access, with an enable/disable toggle |
| `Transactions` | Credit purchase and top-up records |
| `UsageLogs` | Per-call usage tied to a user and API key |

```
User 1──* Conversation 1──* Message
User 1──* Apikeys 1──* UsageLogs
User 1──* Transactions
```

---

## Deployment

### Docker Compose

```bash
docker compose up -d
```

| Service | Port | Image |
|---|---|---|
| `db` | 5432 | `postgres:16-alpine` |
| `backend` | 3000 | Built from `apps/backend/Dockerfile` |
| `api-backend` | 4001 | Built from `apps/api-backend/Dockerfile` |

Both backend images use `oven/bun:1`, install the monorepo, generate the Prisma client, and run migrations on startup. Provide the agent, vector-store, and cache secrets (`OPENAI_API_KEY`, `FMP_API_KEY`, `TAVILY_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`, `CLOUDFLARE_API_KEY`, `ACCOUNT_ID`, `NAMESPACE_ID`) through the environment.

### Vercel (frontend apps)

Deploy each Next.js app as its own project:

```
Root Directory: apps/frontend-chat   (or apps/landing, apps/docs)
Build Command:  bun run build
Output:         .next
```

Set the relevant `NEXT_PUBLIC_*` variables in the Vercel dashboard.

### Render (backends)

Deploy each backend as a Docker web service pointing at the repo root with the matching Dockerfile (`apps/backend/Dockerfile` on port 3000, `apps/api-backend/Dockerfile` on port 4001).

---

## Development

```bash
bun lint            # ESLint across all packages
bun run format      # Prettier
bun run check-types # TypeScript type checking
```

### Extending the project

- **Add an agent tool** — create a tool in `packages/agents/tools/` and add it to the relevant agent's `tools` array.
- **Add a backend module** — create a folder under `apps/backend/src/modules/`, define its model/service/route files, and mount it with `.use()` in `app.ts`.
- **Add a UI primitive** — add a component in `packages/ui/src/`, export it, and consume it as `@repo/ui` across the frontends.
- **Change the database** — edit `packages/db/prisma/schema.prisma`, run `bunx prisma migrate dev`, and update affected services.

---

## Roadmap

- Ingestion pipeline to seed the Pinecone `finance` namespace with filings, news, and transcripts
- Real-time streaming on the core backend's agent endpoints
- Portfolio and valuation tooling (backtesting, scenario modeling)
- Per-agent latency and quality metrics
- Fine-grained API-key scoping and rate limits

---

## Acknowledgements

- [ElysiaJS](https://elysiajs.com) — type-safe HTTP framework for Bun
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) — agent orchestration
- [Next.js](https://nextjs.org) — React framework
- [Prisma](https://prisma.io) — database ORM
- [Pinecone](https://pinecone.io) — vector database
- [Financial Modeling Prep](https://financialmodelingprep.com) — financial data
- [Alpha Vantage](https://www.alphavantage.co) — market data and indicators
- [Tavily](https://tavily.com) — web search and research
