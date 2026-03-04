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
  },
  {
    id: "deep",
    label: "Deep Agent",
    badge: "≈ 3 min",
    description:
      "Full investment memos with bull/bear cases, risk analysis, and scenario modeling.",
  },
  {
    id: "auto",
    label: "Auto Mode",
    badge: "Smart routing",
    description:
      "Automatically chooses between Quick and Deep based on user intent and complexity.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Three modes, one finance brain.
          </h2>
          <p className="mt-3 text-sm text-fg-muted sm:text-base">
            Switch between quick answers, deep research, or let MarketSage
            decide for you.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.28,
                delay: index * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <Card className="h-full border border-border-subtle bg-bg-elevated/90 shadow-soft transition-transform duration-150 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-fg">
                    {feature.label}
                  </h3>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent-strong">
                    {feature.badge}
                  </span>
                </div>
                <p className="mt-3 text-xs text-fg-muted sm:text-sm">
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

