"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, Button, IconButton } from "@repo/ui";

const TABS = ["curl", "javascript", "python"] as const;
type Tab = (typeof TABS)[number];

const codeByTab: Record<Tab, string> = {
  curl: `curl -X POST "https://api.marketsage.ai/v1/agents/auto" \\
  -H "x-api-key: sk_live_***" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explain today's move in NVDA in 4 bullets."
  }'`,
  javascript: `import fetch from "node-fetch";

const res = await fetch("https://api.marketsage.ai/v1/agents/auto", {
  method: "POST",
  headers: {
    "x-api-key": process.env.MARKETSAGE_API_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Explain today's move in NVDA in 4 bullets.",
  }),
});

const data = await res.json();
console.log(data.response);`,
  python: `import os
import requests

resp = requests.post(
    "https://api.marketsage.ai/v1/agents/auto",
    headers={
        "x-api-key": os.environ["MARKETSAGE_API_KEY"],
        "Content-Type": "application/json",
    },
    json={
        "prompt": "Explain today's move in NVDA in 4 bullets.",
    },
)

print(resp.json()["response"])`,
};

const responseExample = `{
  "mode": "auto",
  "response": "NVDA traded lower as investors digested stretched valuations, a modest guidance raise, rotation into other AI names, and profit taking after a strong run."
}`;

export function CodeExample() {
  const [tab, setTab] = useState<Tab>("curl");

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // no-op
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Drop-in API in a few lines.
          </h2>
          <p className="mt-3 text-sm text-fg-muted sm:text-base">
            Call the Auto agent from any backend or edge runtime.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-border-subtle bg-bg-elevated/95">
            <div className="mb-3 flex items-center justify-between gap-4 border-b border-border-subtle pb-2">
              <div className="flex items-center gap-1 rounded-full bg-bg-subtle/70 p-1 text-xs">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-full px-3 py-1 capitalize transition-colors ${
                      t === tab
                        ? "bg-accent text-bg"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <IconButton
                aria-label="Copy request example"
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(codeByTab[tab])}
              >
                <span className="text-[11px]">Copy</span>
              </IconButton>
            </div>

            <motion.pre
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-auto rounded-lg bg-bg-subtle/60 p-4 text-[11px] leading-relaxed text-fg-soft"
            >
              {codeByTab[tab]}
            </motion.pre>
          </Card>

          <Card className="border border-border-subtle bg-bg-elevated/95">
            <div className="mb-3 flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-soft">
                Sample JSON response
              </span>
              <IconButton
                aria-label="Copy response example"
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(responseExample)}
              >
                <span className="text-[11px]">Copy</span>
              </IconButton>
            </div>
            <pre className="overflow-auto rounded-lg bg-bg-subtle/60 p-4 text-[11px] leading-relaxed text-fg-soft">
              {responseExample}
            </pre>
          </Card>
        </div>
      </div>
    </section>
  );
}

