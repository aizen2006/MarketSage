import { CodeBlock } from "./CodeBlock";

export function RequestResponse({
  request,
  response,
}: {
  request: { code: string; language?: string };
  response: { code: string; language?: string };
}) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-fg-soft">
          Request
        </p>
        <CodeBlock code={request.code} language={request.language} />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-fg-soft">
          Response
        </p>
        <CodeBlock code={response.code} language={response.language} />
      </div>
    </div>
  );
}

