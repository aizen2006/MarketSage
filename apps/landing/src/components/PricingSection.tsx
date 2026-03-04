"use client";

import { motion } from "motion/react";
import { Card, Button } from "@repo/ui";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-bg">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Simple, transparent pricing.
        </h2>
        <p className="mt-4 text-[17px] text-fg-muted">
          Start with generous free credits, then scale usage as you grow. No
          hidden tiers or complicated knobs.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="mt-12 overflow-hidden p-0 border border-border-strong bg-bg shadow-xl text-left">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-8 sm:p-10 border-b md:border-b-0 md:border-r border-border-subtle">
                <h3 className="text-xl font-semibold tracking-tight text-fg">
                  Pay as you go
                </h3>
                <p className="mt-2 text-[15px] text-fg-muted leading-relaxed">
                  Same price for Quick, Deep, and Auto. Only pay for completed
                  calls. Usage & billing tracked per API key.
                </p>
                
                <ul className="mt-8 space-y-4">
                  {[
                    "1 credit per agent call",
                    "Onramp credits instantly via dashboard",
                    "Per-user usage logs via the API",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-fg-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg"><path d="M20 6 9 17l-5-5"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="w-full md:w-72 bg-bg-elevated p-8 sm:p-10 flex flex-col justify-center items-center text-center">
                <div className="text-[13px] font-medium uppercase tracking-wider text-fg-soft mb-4">
                  Usage Based
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tighter text-fg">$10</span>
                  <span className="text-fg-soft font-medium">/ 10k</span>
                </div>
                <span className="text-[13px] text-fg-muted mt-2 mb-8">credits</span>
                
                <Button asChild size="lg" className="w-full">
                  <a href={DASHBOARD_URL}>Get Started</a>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
