import { Badge } from "../../components/Badge";
import { Callout } from "../../components/Callout";

const errors = [
  {
    code: "MISSING_API_KEY",
    status: 401,
    description: "The x-api-key header was not provided.",
  },
  {
    code: "INVALID_API_KEY",
    status: 401,
    description: "The provided API key does not exist or is disabled.",
  },
  {
    code: "INSUFFICIENT_CREDITS",
    status: 402,
    description:
      "The user does not have enough credits to run the requested agent.",
  },
  {
    code: "INTERNAL_ERROR",
    status: 500,
    description: "Unexpected server-side failure while running the agent.",
  },
];

export default function ErrorsPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Errors
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        All endpoints use standard HTTP status codes and structured JSON error
        objects.
      </p>

      <Callout tone="info" title="Error shape">
        <code className="block rounded-md bg-bg-subtle/80 px-2 py-2 font-mono text-[11px] text-fg-soft">
          {`{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Not enough credits to run quick agent"
  }
}`}
        </code>
      </Callout>

      <section className="mt-6">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead className="border-b border-border-subtle text-left text-[11px] uppercase tracking-wide text-fg-soft">
            <tr>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Code</th>
              <th className="py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err) => (
              <tr
                key={err.code}
                className="border-b border-border-subtle/70 last:border-b-0"
              >
                <td className="py-2 pr-3 align-top font-mono text-[11px] text-fg-soft">
                  {err.status}
                </td>
                <td className="py-2 pr-3 align-top">
                  <Badge variant={err.status >= 500 ? "danger" : "neutral"}>
                    {err.code}
                  </Badge>
                </td>
                <td className="py-2 align-top text-xs text-fg-muted sm:text-sm">
                  {err.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

