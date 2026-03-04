"use client";

import { IconButton } from "@repo/ui";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const label = language ?? "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-border-subtle bg-bg-elevated/95 text-xs shadow-soft">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-1.5">
        <span className="text-[11px] uppercase tracking-wide text-fg-soft">
          {label}
        </span>
        <IconButton
          aria-label="Copy code"
          variant="ghost"
          size="xs"
          onClick={handleCopy}
        >
          <span className="text-[10px]">Copy</span>
        </IconButton>
      </div>
      <pre className="max-h-[320px] overflow-auto rounded-b-xl bg-bg-subtle/60 px-3 py-3 font-mono text-[11px] leading-relaxed text-fg-soft">
        {code}
      </pre>
    </div>
  );
}

