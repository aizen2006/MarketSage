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
    label: "Financial Data",
    description: "Fundamentals, ratios, and analyst estimates.",
  },
  {
    id: "sec",
    label: "SEC Filings",
    description: "10-K/10-Q parsing for risk and thesis work.",
  },
  {
    id: "memory",
    label: "Semantic Memory",
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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Built on serious research tooling.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-2xl mx-auto">
            MarketSage orchestrates search, fundamentals, vector memory, and
            guardrails into a single agentic layer.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card hoverable className="h-full border border-border-subtle bg-bg p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated border border-border-strong text-[13px] font-semibold text-fg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-fg">{tool.label}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
