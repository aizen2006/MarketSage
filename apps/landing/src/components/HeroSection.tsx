"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button, Card } from "@repo/ui";

const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL ?? "http://localhost:3000/chat";
const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002/getting-started";

const codeLines = [
  'curl -X POST "https://api.marketsage.ai/v1/agents/quick" \\',
  '  -H "x-api-key: sk_live_***" \\',
  '  -H "Content-Type: application/json" \\',
  '  -d \'{"prompt": "Summarize AAPL earnings in 3 bullet points"}\'',
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 sm:pb-32 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.85),_transparent_60%)]" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-16">
        <div className="max-w-xl text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl"
          >
            Modern financial intelligence,
            <span className="text-accent"> on tap.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
            className="mt-4 text-balance text-base text-fg-muted sm:text-lg"
          >
            MarketSage gives you an AI finance agent and production-ready API
            for earnings summaries, risk analysis, scenario planning, and more
            — powered by Quick, Deep, and Auto modes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start"
          >
            <Button asChild size="lg">
              <Link href={CHAT_URL}>Open Chat</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={DOCS_URL}>API Documentation</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="mt-4 text-xs text-fg-soft"
          >
            1 credit per call. Built-in billing, API keys, and usage tracking.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="w-full max-w-md lg:max-w-lg"
        >
          <Card className="relative overflow-hidden border border-border-strong bg-bg-elevated/90 shadow-soft">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-fg-soft">marketsage@terminal</span>
            </div>

            <div className="px-4 py-4 font-mono text-[11px] leading-relaxed text-fg-soft">
              <motion.pre
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                    },
                  },
                }}
              >
                {codeLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <span className="select-none text-fg-soft/60">
                      {idx === 0 ? "➜ " : "   "}
                    </span>
                    <span className="text-accent-soft">{line}</span>
                  </motion.div>
                ))}
              </motion.pre>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="mt-4 rounded-lg bg-bg-subtle/50 px-3 py-2"
              >
                <div className="text-[10px] uppercase tracking-wide text-accent-strong">
                  Response
                </div>
                <pre className="mt-1 text-[11px] text-fg-soft">
                  {`{\n  "mode": "quick",\n  "response": "AAPL beat on EPS and revenue, raised FY guidance, and expanded buybacks."\n}`}
                </pre>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

