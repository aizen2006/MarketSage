"use client";

import { motion } from "motion/react";
import { Card } from "@repo/ui";

const steps = [
  {
    id: 1,
    title: "Get your API key",
    description: "Create an account, generate a key, and set usage limits.",
  },
  {
    id: 2,
    title: "Send a prompt",
    description:
      "Call the Quick, Deep, or Auto agents with plain-language questions.",
  },
  {
    id: 3,
    title: "Receive intelligence",
    description:
      "Stream back structured insights you can show in-product or store.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 border-y border-border-subtle/70 bg-bg-subtle/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            How MarketSage fits into your stack.
          </h2>
          <p className="mt-3 text-sm text-fg-muted sm:text-base">
            A simple three-step flow from key creation to production responses.
          </p>
        </div>

        <div className="relative mt-6 grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-6 top-10 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.25,
                delay: index * 0.04,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="relative"
            >
              <Card className="h-full border border-border-subtle bg-bg-elevated/90">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong">
                    {step.id}
                  </span>
                  <h3 className="text-sm font-medium text-fg">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs text-fg-muted sm:text-sm">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

