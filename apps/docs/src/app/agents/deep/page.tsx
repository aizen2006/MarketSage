import { EndpointCard } from "../../../components/EndpointCard";
import { ParamTable } from "../../../components/ParamTable";
import { RequestResponse } from "../../../components/RequestResponse";
import { Callout } from "../../../components/Callout";

const BASE_URL = "https://api.marketsage.ai/v1";

const bodyParams = [
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "Open-ended research question or memo request. Supports multi-ticker, scenario, and peer comparison prompts.",
  },
];

const queryParams = [
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "Same content as body.prompt; passed as a query string for the streaming endpoint.",
  },
];

const jsRequest = `const res = await fetch("${BASE_URL}/agents/deep", {
  method: "POST",
  headers: {
    "x-api-key": process.env.MARKETSAGE_API_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Write a 1,000 word memo comparing MSFT vs. GOOGL on AI infrastructure.",
  }),
});

const data = await res.json();
console.log(data.response);`;

const jsonResponse = `{
  "mode": "deep",
  "response": "# Executive summary\\n\\n- Both MSFT and GOOGL are well positioned ... (truncated)"
}`;

export default function DeepAgentPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Deep agent
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        The Deep agent runs a full research workflow—memory retrieval, web +
        filings, contradiction checks, and memo generation—to produce richer
        analysis.
      </p>

      <EndpointCard
        method="POST"
        path={`${BASE_URL}/agents/deep`}
        auth="x-api-key header"
        description="Run a long-form Deep agent analysis and return the memo text."
      />

      <ParamTable params={bodyParams} />

      <RequestResponse
        request={{ code: jsRequest, language: "JavaScript" }}
        response={{ code: jsonResponse, language: "JSON" }}
      />

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          Streaming
        </h2>
        <p className="mt-1 text-xs text-fg-muted sm:text-sm">
          For progressive rendering of long memos, use the streaming endpoint:
        </p>
        <ParamTable params={queryParams} />
        <Callout tone="info" title="Endpoint">
          <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
            GET /agents/deep/stream?prompt=...
          </code>{" "}
          streams memo text chunks. Combine them on the client to build the
          full document.
        </Callout>
      </section>
    </div>
  );
}

