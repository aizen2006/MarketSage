"use client";

import { motion } from "motion/react";
import { Card } from "@repo/ui";

const features = [
  {
    id: "quick",
    label: "Quick Agent",
    badge: "≈ 30s",
    description:
      "Blazing-fast answers for quotes, earnings snippets, and simple what-if checks.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ),
  },
  {
    id: "deep",
    label: "Deep Agent",
    badge: "≈ 3 min",
    description:
      "Full investment memos with bull/bear cases, risk analysis, and scenario modeling.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
    ),
  },
  {
    id: "auto",
    label: "Auto Mode",
    badge: "Smart routing",
    description:
      "Automatically chooses between Quick and Deep based on user intent and complexity.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-bg-elevated/30">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Three modes, one finance brain.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-2xl mx-auto">
            Switch between quick answers, deep research, or let MarketSage
            intelligently route your query.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card hoverable className="h-full flex flex-col p-8 bg-bg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-subtle text-fg border border-border-subtle shadow-sm">
                  {feature.icon}
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-[17px] font-semibold tracking-tight text-fg">
                    {feature.label}
                  </h3>
                  <span className="rounded-md border border-border-strong bg-bg-elevated px-2 py-0.5 text-[11px] font-medium text-fg-soft">
                    {feature.badge}
                  </span>
                </div>
                
                <p className="text-[15px] leading-relaxed text-fg-muted">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
