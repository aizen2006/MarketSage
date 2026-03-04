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
      "User query. The triage agent inspects this prompt and chooses the appropriate mode.",
  },
];

const queryParams = [
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "Same content as body.prompt; used for the streaming variant of the endpoint.",
  },
];

const jsRequest = `const res = await fetch("${BASE_URL}/agents/auto", {
  method: "POST",
  headers: {
    "x-api-key": process.env.MARKETSAGE_API_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Stress test my portfolio for a 200 bps move in rates.",
  }),
});

const data = await res.json();
console.log(data.mode, data.response);`;

const jsonResponse = `{
  "mode": "deep",
  "response": "Because this request requires scenario analysis across multiple assets, MarketSage routed it to the Deep agent. (truncated memo...)"
}`;

export default function AutoAgentPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Auto agent
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        The Auto agent inspects the prompt and routes to either Quick or Deep,
        returning which mode was used alongside the response.
      </p>

      <EndpointCard
        method="POST"
        path={`${BASE_URL}/agents/auto`}
        auth="x-api-key header"
        description="Run the triage agent and automatically route to Quick or Deep."
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
          Use the streaming endpoint when you want Auto agent responses to
          appear token-by-token in your UI.
        </p>
        <ParamTable params={queryParams} />
        <Callout tone="info" title="Endpoint">
          <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
            GET /agents/auto/stream?prompt=...
          </code>
        </Callout>
      </section>
    </div>
  );
}

