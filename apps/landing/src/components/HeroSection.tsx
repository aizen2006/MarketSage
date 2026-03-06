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
    <section className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28">
      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl text-center lg:text-left lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-surface px-3 py-1 text-[13px] font-medium text-fg mb-6 shadow-soft">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              v2.0 is now live
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-tighter text-fg sm:text-6xl lg:text-7xl leading-[1.1]">
              Real-time signals. <span className="text-fg-soft">Human-ready insights.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-balance text-[17px] leading-relaxed text-fg-muted sm:text-lg"
          >
            MarketSage gives you an AI finance agent and production-ready API
            for earnings summaries, risk analysis, and scenario planning. Built for modern teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button asChild size="lg" variant="primary" className="w-full sm:w-auto h-12 px-8 text-[15px]">
              <Link href={CHAT_URL}>Connect Markets</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-[15px]">
              <Link href={DOCS_URL}>Try Demo Data</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[500px] lg:w-1/2"
        >
          <Card className="relative overflow-hidden border border-border-subtle bg-bg-surface p-0">
            <div className="flex h-10 items-center justify-between border-b border-border-subtle bg-bg px-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <div className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <div className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              </div>
              <span className="text-[11px] font-medium text-fg-soft">bash</span>
            </div>

            <div className="p-5 font-mono text-[13px] leading-loose text-fg-muted">
              <motion.pre
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {codeLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, x: -5 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <span className="select-none text-fg-soft/40 mr-3">
                      {idx === 0 ? "❯" : " "}
                    </span>
                    <span className="text-fg">{line}</span>
                  </motion.div>
                ))}
              </motion.pre>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mt-6 rounded-lg border border-border-subtle bg-bg p-4"
              >
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-fg-soft">
                  Response
                </div>
                <pre className="text-fg leading-relaxed">
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
