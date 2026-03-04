import { Callout } from "../../components/Callout";
import { CodeBlock } from "../../components/CodeBlock";

const BASE_URL = "https://api.marketsage.ai/v1";

const quickExample = `curl -X POST "${BASE_URL}/agents/quick" \\
  -H "x-api-key: sk_live_***" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Summarize AAPL earnings in 3 bullet points."
  }'`;

export default function GettingStartedPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Getting started
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        The MarketSage API exposes three agent modes—Quick, Deep, and
        Auto—behind a single base URL and simple JSON schema.
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          Base URL
        </h2>
        <p className="mt-1 text-xs text-fg-muted sm:text-sm">
          All requests are made over HTTPS to the following base:
        </p>
        <CodeBlock code={BASE_URL} language="base URL" />
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          Authentication
        </h2>
        <p className="mt-1 text-xs text-fg-muted sm:text-sm">
          Authenticate every request with an API key via the{" "}
          <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
            x-api-key
          </code>{" "}
          header.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-fg-muted sm:text-sm">
          <li>Generate keys from the MarketSage dashboard.</li>
          <li>Keys are scoped per user and can be disabled at any time.</li>
          <li>
            Usage and billing are tracked per key via the backend{" "}
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              /apikeys
            </code>{" "}
            and{" "}
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              /user
            </code>{" "}
            endpoints.
          </li>
        </ul>

        <Callout tone="warning" title="Keep keys secret">
          Never expose API keys in client-side code. Use a backend or serverless
          function to proxy requests to MarketSage.
        </Callout>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          Credits & billing
        </h2>
        <p className="mt-1 text-xs text-fg-muted sm:text-sm">
          Each completed agent run consumes 1 credit, regardless of mode
          (Quick, Deep, or Auto).
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-fg-muted sm:text-sm">
          <li>
            If there are not enough credits available, the API returns{" "}
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              402
            </code>{" "}
            with error code{" "}
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              INSUFFICIENT_CREDITS
            </code>
            .
          </li>
          <li>
            Use the backend{" "}
            <code className="rounded-md bg-bg-subtle/80 px-1.5 py-0.5 font-mono text-[11px]">
              /user/credits
            </code>{" "}
            endpoint to check your remaining balance.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-fg sm:text-base">
          First request
        </h2>
        <p className="mt-1 text-xs text-fg-muted sm:text-sm">
          The snippet below shows a minimal curl call to the Quick agent.
        </p>
        <CodeBlock code={quickExample} language="curl" />
      </section>
    </div>
  );
}

