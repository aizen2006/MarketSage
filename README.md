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
  <img src="https://img.shields.io/badge/Cloudflare_KV-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare KV" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

MarketSage is a multi-agent financial research platform. A streaming-style chat experience is backed by a Bun-powered API that coordinates web search, financial data providers, retrieval-augmented memory, and LLM reasoning to help research companies, evaluate fundamentals, and track market events.

The system runs three cooperating agents — Quick, Deep, and a Triage router — over a Pinecone vector store for retrieval-augmented generation (RAG), and ships as a Turborepo monorepo: a **core backend** (Elysia on Bun) and a **chat web app** (Next.js) dressed in the warm **Ember** design system.

---

## Highlights

- **Three agent modes** — Quick for fast lookups, Deep for investment-grade research memos, and Auto, where a Triage agent routes the query to the right one. All run on `gpt-5.4-mini`.
- **Retrieval-augmented generation** — every request runs a Pinecone semantic search *before* the model is invoked and stores the result *after* it responds, so the system accumulates a searchable memory of prior research.
- **Per-user memory** — retrieval is filtered by user, so each user only sees context from their own earlier research.
- **Financial data tools** — Financial Modeling Prep for structured fundamentals, plus an Alpha Vantage MCP server for market data and technical indicators.
- **Web tools** — Tavily-powered search, deep multi-source research, and page extraction.
- **Output guardrails** — a guardrail agent reviews every response for compliance and tone before it reaches the user.
- **Edge response caching** — read-heavy, non-chat endpoints (credits, usage logs, transactions, conversations, insights, API keys) are cached per user in Cloudflare KV with short TTLs and explicit invalidation, so the dashboard loads instantly while staying accurate.
- **Ember design system** — a warm, light-first UI language (orange accent, Geist + Instrument Serif, soft cards, pill controls) shared through `@repo/ui` and applied across the chat app.
- **Monorepo** — two apps and shared packages orchestrated by Turborepo on Bun.

---

## How retrieval works

Retrieval lives in the backend's agent service layer, so it applies the same way to every mode (`auto`, `quick`, `deep`):

1. **Retrieve — before the chat.** The user's message is run through `semantic_search` against the Pinecone `finance` namespace, filtered by `userId`. Matches are formatted into a context block and appended to the prompt.
2. **Run the agent.** The augmented prompt is sent to the selected agent. If retrieval returns nothing or fails, the chat continues anyway — RAG is best-effort and never blocks a response.
3. **Persist — after the chat.** The completed answer is stored back into Pinecone via `upsert_data`, tagged with `userId`, `mode`, and a timestamp, so it can ground future questions.

Pinecone uses **integrated embedding**: the index embeds the `text` field server-side through `upsertRecords` and `searchRecords`, so the application performs no separate embedding step.

> [!NOTE]
> The `finance` namespace starts empty, so early conversations retrieve little until results accumulate. The same `upsert_data` path can be used to seed it with primary-source data such as filings and news.

---

## How response caching works

The backend's non-chat `GET` endpoints are read often but change rarely, so their responses are cached per user in **Cloudflare KV**. Chat/agent endpoints are never cached (LLM output is non-deterministic), but because a chat spends credits and writes a usage log, it invalidates the affected caches.

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
5. The backend returns the completed answer as JSON to the chat app.

---

## Design system — Ember

The UI is built on **Ember**, a warm, light-first design language defined once as tokens and shared through `@repo/ui`:

- **Color** — a warm orange accent (`#F26A1F`) over warm-gray ("stone") neutrals, with `positive`/`danger` semantic colors. A derived warm-dark palette keeps the theme toggle working.
- **Type** — **Geist** for UI/body, **Instrument Serif** for editorial italic accents, and **Material Symbols Rounded** for icons.
- **Foundations** — an 8-pt spacing grid, soft radii (with a `pill` step), and three low-spread shadow steps.

Tokens live in [`packages/ui/src/tokens/tokens.css`](packages/ui/src/tokens/tokens.css) and map to Tailwind v4 utilities via `@theme inline` in the app's `globals.css`. Components consume the tokens, so re-skinning is a single edit. The chat app is light-first with a working dark toggle.

---

## Architecture

```mermaid
graph TD
    subgraph Client
        Chat[Chat UI - Next.js :3001]
    end

    subgraph Backend
        Core[Core Backend - Elysia :3000]
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
        KV[(Cloudflare KV - Cache)]
    end

    Chat -->|JWT cookie| Core
    Core --> PG
    Core --> KV
    Core --> PC
    Core --> Triage
    Triage -->|routes to| Quick
    Triage -->|routes to| Deep

    Quick --> Web
    Deep --> Web
    Deep --> FMP
    Deep --> AV

    Quick --> Guard
    Deep --> Guard
    Guard --> PC
```

---

## Project structure

```
marketSage/
├── apps/
│   ├── backend/            # Core API: auth, agents (RAG), conversations, API keys, payments, user
│   │   ├── Dockerfile          # Production image (Bun) — migrates then starts
│   │   ├── entrypoint.sh        # prisma migrate deploy → start server
│   │   └── src/
│   │       ├── app.ts               # Elysia app: CORS, /health, module mounts
│   │       ├── modules/             # auth, agents, user, apikeys, payments
│   │       │   └── agents/service.ts    # RAG flow + agent orchestration
│   │       └── utils/
│   │           ├── pinecone.ts          # Pinecone upsert + semantic search
│   │           ├── cloudflare.ts        # Cloudflare KV bulk helpers
│   │           └── cache.ts             # Per-user response cache (read-through + invalidation)
│   └── frontend-chat/      # Chat web app (Ember UI) + API-key management page
│       └── src/
│           ├── app/                 # /signin, /signup, /chat, /api-keys
│           ├── components/          # Chat, Composer, Sidebar, Insights, modals
│           └── context/             # Auth + Theme providers
├── packages/
│   ├── agents/             # Agent definitions and tools
│   │   ├── triage_agent.ts     # Router
│   │   ├── quick_agent.ts      # Fast-response analyst
│   │   ├── deep_agent.ts       # Investment-grade analyst (+ Alpha Vantage MCP)
│   │   ├── tools/              # web_search.ts (search/research/extract), fin_research.ts
│   │   └── utils/tavily.ts     # Tavily client
│   ├── db/                 # Prisma schema, migrations, generated client
│   ├── ui/                 # Shared React UI library (@repo/ui) + Ember tokens
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configurations
├── turbo.json              # Turborepo pipeline
└── package.json            # Workspace root
```

---

## Tech stack

| Area | Technologies |
|---|---|
| Language & runtime | TypeScript, Bun 1.3 |
| Frontend | Next.js 16 (App Router, React 19), Tailwind CSS v4, motion.dev, React Markdown, shared `@repo/ui` (Ember design system) |
| Backend | ElysiaJS on Bun, Prisma 7 (pg driver adapter), `@elysiajs/jwt` (cookie auth), `@elysiajs/cors` |
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
bunx prisma migrate dev      # use `prisma migrate deploy` in production
cd ../..
```

### Environment variables

Create `.env` files in the relevant apps and packages.

#### Backend & agents (`apps/backend/.env`)

```env
# Auth, database & networking
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/marketsage?schema=public
PORT=3000
CORS_ORIGIN=http://localhost:3001

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
```

#### Chat app (`apps/frontend-chat/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000          # core backend
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:3000  # base shown in API-key code examples
```

### Running the project

```bash
bun dev                                  # all apps in parallel
```

Or per app:

```bash
bun turbo dev --filter backend           # Core API on :3000
bun turbo dev --filter frontend-chat     # Chat UI on :3001
```

| App | Default URL |
|---|---|
| Core backend | `http://localhost:3000` |
| Chat UI | `http://localhost:3001` |

---

## API reference

The backend uses cookie-based auth. Agent and dashboard routes require the JWT cookie set by `/auth/signin`. RAG retrieval and persistence run transparently on every agent call.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Create an account |
| `POST` | `/auth/signin` | Sign in and set the `auth` cookie |
| `POST` | `/agents/quick/json` | Quick agent (JSON) |
| `POST` | `/agents/deep/json` | Deep agent (JSON) |
| `POST` | `/agents/auto/json` | Auto-routed response (JSON) |
| `POST` | `/agents/title` | Generate a short conversation title |
| `GET` | `/user/credits` | Remaining credit balance *(cached)* |
| `GET` | `/user/usageLog` | Per-call usage history *(cached)* |
| `GET` | `/user/transactions` | Credit transactions *(cached)* |
| `GET` | `/user/conversations` | List conversations *(cached)* |
| `POST` / `PATCH` | `/user/conversations` | Create / rename a conversation |
| `GET` | `/user/insights` | Signals + insight stream *(cached)* |
| `POST` | `/payments/onramp` | Top up credits |
| `POST` | `/apikeys/create` | Create an API key |
| `GET` | `/apikeys/` | List the user's API keys *(cached)* |
| `PUT` | `/apikeys/` | Enable or disable an API key |
| `GET` | `/health` | Liveness probe |

`GET` responses marked *(cached)* are served per user from Cloudflare KV — see [How response caching works](#how-response-caching-works).

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

### Backend (Docker)

The backend ships a production [`apps/backend/Dockerfile`](apps/backend/Dockerfile). Build it **from the repository root** (it needs the whole workspace):

```bash
docker build -f apps/backend/Dockerfile -t marketsage-backend .
docker run -p 3000:3000 --env-file apps/backend/.env marketsage-backend
```

The image (`oven/bun:1.3`) installs the monorepo, generates the Prisma client, runs as a non-root user, and exposes a `/health` check. On start, [`entrypoint.sh`](apps/backend/entrypoint.sh) applies migrations (`prisma migrate deploy`) and then launches the server. Provide every secret through the environment: `JWT_SECRET`, `DATABASE_URL`, `OPENAI_API_KEY`, `TAVILY_API_KEY`, `FMP_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`, `CLOUDFLARE_API_KEY`, `ACCOUNT_ID`, `NAMESPACE_ID` (and `CORS_ORIGIN`).

On a PaaS such as Render or Fly.io, point the service at the repo root with this Dockerfile; the platform-provided `PORT` is honored automatically.

### Chat app (Vercel)

Deploy the Next.js chat app as its own project:

```
Root Directory: apps/frontend-chat
Build Command:  bun run build
Output:         .next
```

Set `NEXT_PUBLIC_API_URL` (and `NEXT_PUBLIC_API_BACKEND_URL`) to your deployed backend URL.

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
- **Add a UI primitive** — add a component in `packages/ui/src/`, export it, and consume it as `@repo/ui` in the chat app.
- **Re-skin the UI** — edit the Ember tokens in `packages/ui/src/tokens/tokens.css`; components pick the changes up automatically.
- **Change the database** — edit `packages/db/prisma/schema.prisma`, run `bunx prisma migrate dev`, and update affected services.

---

## Roadmap

- Ingestion pipeline to seed the Pinecone `finance` namespace with filings, news, and transcripts
- Real-time SSE streaming on the backend's agent endpoints
- Portfolio and valuation tooling (backtesting, scenario modeling)
- Per-agent latency and quality metrics
- A dedicated programmatic API surface for the managed API keys

---

## Acknowledgements

- [ElysiaJS](https://elysiajs.com) — type-safe HTTP framework for Bun
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) — agent orchestration
- [Next.js](https://nextjs.org) — React framework
- [Prisma](https://prisma.io) — database ORM
- [Pinecone](https://pinecone.io) — vector database
- [Cloudflare KV](https://developers.cloudflare.com/kv/) — edge key-value cache
- [Financial Modeling Prep](https://financialmodelingprep.com) — financial data
- [Alpha Vantage](https://www.alphavantage.co) — market data and indicators
- [Tavily](https://tavily.com) — web search and research
