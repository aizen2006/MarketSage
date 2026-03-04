import type { ReactNode } from "react";
import { Badge } from "./Badge";

type Method = "GET" | "POST" | "PUT" | "DELETE";

function methodVariant(method: Method) {
  switch (method) {
    case "GET":
      return "get" as const;
    case "POST":
      return "post" as const;
    case "PUT":
      return "put" as const;
    case "DELETE":
      return "delete" as const;
    default:
      return "neutral" as const;
  }
}

export function EndpointCard({
  method,
  path,
  auth,
  description,
  children,
}: {
  method: Method;
  path: string;
  auth?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-border-subtle bg-bg-elevated/95 p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={methodVariant(method)}>{method}</Badge>
        <code className="rounded-md bg-bg-subtle/80 px-2 py-1 text-xs font-mono text-fg">
          {path}
        </code>
        {auth ? (
          <span className="text-[11px] text-fg-soft">
            Auth: <span className="font-medium text-fg-muted">{auth}</span>
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-2 text-xs text-fg-muted sm:text-sm">{description}</p>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}

