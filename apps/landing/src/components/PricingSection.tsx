"use client";

import { Card, Button } from "@repo/ui";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000";

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Simple, credit-based pricing.
        </h2>
        <p className="mt-3 text-sm text-fg-muted sm:text-base">
          Start with generous free credits, then scale usage as you grow. No
          hidden tiers or complicated knobs.
        </p>

        <Card className="mt-8 border border-border-subtle bg-bg-elevated/95 shadow-soft">
          <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
              <div className="text-left">
                <h3 className="text-sm font-semibold text-fg">
                  1 credit per agent call
                </h3>
                <p className="mt-1 text-xs text-fg-muted sm:text-sm">
                  Same price for Quick, Deep, and Auto. Only pay for completed
                  calls.
                </p>
              </div>
              <div className="mt-2 text-left sm:mt-0 sm:text-right">
                <div className="text-xs text-fg-soft">Example bundle</div>
                <div className="text-lg font-semibold text-fg">
                  10,000 credits
                </div>
                <div className="text-xs text-fg-muted">ideal for small teams</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-bg-subtle/60 px-4 py-3 text-left sm:flex-row">
              <ul className="list-disc space-y-1 pl-4 text-xs text-fg-muted sm:text-sm">
                <li>Usage &amp; billing tracked per API key</li>
                <li>Onramp credits instantly via dashboard (cards, onramp)</li>
                <li>Per-user usage logs via the `/user` endpoints</li>
              </ul>
              <Button asChild size="sm">
                <a href={DASHBOARD_URL}>Open dashboard</a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

