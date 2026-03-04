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
      className="py-20 sm:py-24 border-y border-border-subtle/50 bg-bg"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            How MarketSage fits into your stack.
          </h2>
          <p className="mt-4 text-[17px] text-fg-muted max-w-2xl mx-auto">
            A simple three-step flow from key creation to production responses.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-12 top-6 hidden h-[2px] bg-gradient-to-r from-transparent via-border-strong to-transparent md:block opacity-20" />
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <Card className="h-full border border-border-subtle bg-bg-elevated p-8 pt-10 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border-strong text-[15px] font-bold text-fg shadow-sm">
                  {step.id}
                </div>
                <div className="text-center mt-2">
                  <h3 className="text-[17px] font-semibold text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
                    {step.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
