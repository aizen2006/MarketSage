import { EndpointCard } from "../../../components/EndpointCard";
import { ParamTable } from "../../../components/ParamTable";
import { RequestResponse } from "../../../components/RequestResponse";
import { Callout } from "../../../components/Callout";

const BASE_URL = "https://marketsage-eklj.onrender.com/v1";

const bodyParams = [
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "User-facing question or instruction for the Quick agent (1–2 sentences works best).",
  },
];

const queryParams = [
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "Same as body.prompt; used for streaming GET endpoints where the body is not supported.",
  },
];

const jsRequest = `const res = await fetch("${BASE_URL}/agents/quick", {
  method: "POST",
  headers: {
    "x-api-key": process.env.MARKETSAGE_API_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Give me 3 bullet points on TSLA earnings.",
  }),
});

const data = await res.json();
console.log(data.response);`;

const jsonResponse = `{
  "mode": "quick",
  "response": "- EPS beat vs. consensus on stronger-than-expected margins.\\n- Deliveries slightly below street, but mix shifted to higher ASP models.\\n- Management reiterated FY guidance and highlighted progress on energy/storage."
}`;

export default function QuickAgentPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Quick agent
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        The Quick agent is optimized for fast answers (&lt; ~30s) to
        single-ticker questions, simple what-if checks, and short summaries.
      </p>

      <EndpointCard
        method="POST"
        path={`${BASE_URL}/agents/quick`}
        auth="x-api-key header"
        description="Run a single Quick agent completion and return the final text response."
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
          For incremental rendering in your UI, use the SSE endpoint:
        </p>
        <ParamTable params={queryParams} />
        <Callout tone="info" title="Endpoint">
          <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
            GET /agents/quick/stream?prompt=...
          </code>{" "}
          streams text chunks; each event&apos;s data field contains a
          human-readable string.
        </Callout>
      </section>
    </div>
  );
}

