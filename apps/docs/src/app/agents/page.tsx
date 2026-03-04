import Link from "next/link";
import { EndpointCard } from "../../components/EndpointCard";

const BASE_URL = "https://api.marketsage.ai/v1";

export default function AgentsOverviewPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Agents API
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        The Agents API exposes three modes—Quick, Deep, and Auto—under the{" "}
        <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
          /agents
        </code>{" "}
        namespace.
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          Base endpoints
        </h2>
        <EndpointCard
          method="POST"
          path={`${BASE_URL}/agents/quick`}
          auth="x-api-key header"
          description="Fast, single-ticker answers and summaries."
        />
        <EndpointCard
          method="POST"
          path={`${BASE_URL}/agents/deep`}
          auth="x-api-key header"
          description="Full investment memos, scenario analysis, and peer comparisons."
        />
        <EndpointCard
          method="POST"
          path={`${BASE_URL}/agents/auto`}
          auth="x-api-key header"
          description="Triage agent that routes between Quick and Deep."
        />
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          Streaming endpoints (SSE)
        </h2>
        <p className="mt-1 text-xs text-fg-muted sm:text-sm">
          Each mode also exposes a streaming variant that sends text chunks as
          Server-Sent Events:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-fg-muted sm:text-sm">
          <li>
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              GET /agents/quick/stream?prompt=...
            </code>
          </li>
          <li>
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              GET /agents/deep/stream?prompt=...
            </code>
          </li>
          <li>
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              GET /agents/auto/stream?prompt=...
            </code>
          </li>
        </ul>
      </section>

      <section className="mt-8 text-xs text-fg-muted sm:text-sm">
        <p>
          See the dedicated pages for detailed request/response examples:{" "}
          <Link
            href="/agents/quick"
            className="text-accent-strong hover:underline"
          >
            Quick
          </Link>
          ,{" "}
          <Link
            href="/agents/deep"
            className="text-accent-strong hover:underline"
          >
            Deep
          </Link>{" "}
          and{" "}
          <Link
            href="/agents/auto"
            className="text-accent-strong hover:underline"
          >
            Auto
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

