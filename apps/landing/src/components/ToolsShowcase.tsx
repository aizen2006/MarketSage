"use client";

import { motion } from "motion/react";
import { Card } from "@repo/ui";

const tools = [
  {
    id: "web-search",
    label: "Web Search",
    description: "Live market news and filings via Tavily.",
  },
  {
    id: "fin-data",
    label: "Financial Data (FMP)",
    description: "Fundamentals, ratios, and analyst estimates.",
  },
  {
    id: "sec",
    label: "SEC Filings",
    description: "10-K/10-Q parsing for risk and thesis work.",
  },
  {
    id: "memory",
    label: "Semantic Memory (Qdrant)",
    description: "Recall prior research, notes, and documents.",
  },
  {
    id: "contradictions",
    label: "Contradiction Detector",
    description: "Flags conflicting claims across sources.",
  },
  {
    id: "memos",
    label: "Memo Generator",
    description: "Clean investment memos from raw analysis.",
  },
];

export function ToolsShowcase() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Built on serious research tooling.
          </h2>
          <p className="mt-3 text-sm text-fg-muted sm:text-base">
            MarketSage orchestrates search, fundamentals, vector memory, and
            guardrails into a single agentic layer.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.22,
                delay: index * 0.03,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <Card className="h-full border border-border-subtle bg-bg-elevated/90">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-accent-soft text-xs font-semibold text-accent-strong">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-medium text-fg">{tool.label}</h3>
                </div>
                <p className="mt-2 text-xs text-fg-muted sm:text-sm">
                  {tool.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

