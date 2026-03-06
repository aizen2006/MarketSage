# api-backend

External API backend for MarketSage that exposes the Quick, Deep, and Auto (Triage) agents over HTTP using API keys.

## Running

From the repo root:

```bash
cd apps/api-backend
bun install
bun run src/index.ts
```

The server listens on `API_PORT` or defaults to `4001`:

- Local development: `http://localhost:4001`
- Deployed (Render): `https://marketsage-eklj.onrender.com`

## Authentication

All endpoints require an API key in the `x-api-key` header.

- API keys are created and managed by the internal backend (`/apikeys`).
- Each key maps to a `userId` and is validated against the `Apikeys` table.
- Disabled or unknown keys return:

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or disabled API key"
  }
}
```

## Endpoints

Base prefix: `/v1/agents`

### JSON (non-streaming)

- **Quick mode**

  - `POST /v1/agents/quick`
  - Headers: `x-api-key: <your-api-key>`
  - Body:

    ```json
    {
      "prompt": "Explain mean reversion in simple terms."
    }
    ```

  - Response:

    ```json
    {
      "response": "text from quick agent",
      "mode": "quick"
    }
    ```

- **Deep mode**

  - `POST /v1/agents/deep`
  - Same shape as quick, `mode` will be `"deep"`.

- **Auto mode (triage agent)**

  - `POST /v1/agents/auto`
  - Same shape as quick, `mode` will be `"auto"`.

### Streaming (SSE)

- **Quick mode stream**

  - `GET /v1/agents/quick/stream?prompt=...`
  - Headers: `x-api-key: <your-api-key>`
  - Response: `text/event-stream` SSE, each chunk is raw text from the agent.

- **Deep mode stream**

  - `GET /v1/agents/deep/stream?prompt=...`

- **Auto mode stream**

  - `GET /v1/agents/auto/stream?prompt=...`

On error (including insufficient credits), the stream yields an event:

```json
{
  "event": "error",
  "data": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Not enough credits to run quick agent"
  }
}
```

## Credits and usage

- Each call currently costs **1 credit** (per mode).
- The backend:
  - Verifies the user has enough credits.
  - Decrements `User.credits`.
  - Writes a `UsageLogs` record with `userId`, `apikeyId`, and `credits` used.
- If credits are insufficient, endpoints return:

```json
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Not enough credits to run <mode> agent"
  }
}
```

## Example usage

### JSON (Node / fetch)

```ts
await fetch("https://marketsage-eklj.onrender.com/v1/agents/quick", {
	method: "POST",
	headers: {
		"content-type": "application/json",
		"x-api-key": process.env.API_KEY!,
	},
	body: JSON.stringify({
		prompt: "Summarize the latest market news.",
	}),
});
```

### Streaming (browser)

```ts
const source = new EventSource(
	`https://marketsage-eklj.onrender.com/v1/agents/quick/stream?prompt=${encodeURIComponent(
		"Stream a quick market overview.",
	)}`,
);

source.onmessage = (event) => {
	// event.data is the latest text chunk
	console.log(event.data);
};

source.addEventListener("error", (event) => {
	console.error("stream error", event);
	source.close();
});
```
