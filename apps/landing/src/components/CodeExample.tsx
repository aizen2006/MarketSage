"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, IconButton } from "@repo/ui";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-bg-elevated/30">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Drop-in API in a few lines.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-2xl mx-auto">
            Call the Auto agent from any backend or edge runtime.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="flex flex-col p-0 overflow-hidden border border-border-strong bg-bg shadow-xl">
            <div className="flex items-center justify-between border-b border-border-subtle bg-bg-subtle px-4 py-3">
              <div className="flex gap-2">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                      t === tab ? "text-fg" : "text-fg-soft hover:text-fg-muted"
                    }`}
                  >
                    {t === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-bg border border-border-subtle shadow-sm"
                        style={{ zIndex: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t}</span>
                  </button>
                ))}
              </div>
              <IconButton
                aria-label="Copy request example"
                size="sm"
                onClick={() => handleCopy(codeByTab[tab])}
                className="h-7 w-7 text-fg-muted hover:text-fg"
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </IconButton>
            </div>
            
            <div className="relative flex-1 overflow-auto bg-bg p-6 text-[13px] leading-[1.6] text-fg-muted font-mono">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={tab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {codeByTab[tab]}
                </motion.pre>
              </AnimatePresence>
            </div>
          </Card>

          <Card className="flex flex-col p-0 overflow-hidden border border-border-subtle bg-bg shadow-lg opacity-90">
            <div className="flex items-center justify-between border-b border-border-subtle bg-bg-subtle px-5 py-3">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-fg-soft">
                JSON Response
              </span>
            </div>
            <div className="flex-1 overflow-auto bg-bg p-6 text-[13px] leading-[1.6] text-fg-soft font-mono">
              <pre>{responseExample}</pre>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
