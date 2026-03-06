"use client";

import { MarketSignalCard } from "@repo/ui";

const MOCK_SIGNALS = [
  {
    id: "1",
    title: "AAPL 7d momentum",
    value: "+2.4%",
    valueTrend: "positive" as const,
    confidence: 87,
    sparklineData: [0, 1, 0.5, 1.2, 0.8, 1.5, 2.4],
    isNew: true,
  },
  {
    id: "2",
    title: "Portfolio VaR (95%)",
    value: "1.2%",
    valueTrend: "neutral" as const,
    confidence: 92,
    sparklineData: [1.4, 1.3, 1.2, 1.25, 1.2, 1.18, 1.2],
    isNew: false,
  },
  {
    id: "3",
    title: "Sector heat",
    value: "Tech",
    valueTrend: "positive" as const,
    confidence: 78,
    sparklineData: [0.3, 0.5, 0.6, 0.55, 0.7, 0.85, 1],
    isNew: false,
  },
];

const MOCK_INSIGHTS = [
  {
    id: "i1",
    title: "Earnings surprise likelihood",
    summary: "AAPL next quarter estimate spread suggests 12% upside to consensus.",
    expanded: false,
  },
  {
    id: "i2",
    title: "Correlation shift",
    summary: "Tech vs S&P 500 30d correlation rose to 0.89; consider hedging.",
    expanded: false,
  },
];

export function InsightsPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Live signals
            </h2>
            <div className="space-y-3">
              {MOCK_SIGNALS.map((s) => (
                <MarketSignalCard
                  key={s.id}
                  title={s.title}
                  value={s.value}
                  valueTrend={s.valueTrend}
                  confidence={s.confidence}
                  sparklineData={s.sparklineData}
                  isNew={s.isNew}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Insight stream
            </h2>
            <ul className="space-y-2">
              {MOCK_INSIGHTS.map((insight) => (
                <li
                  key={insight.id}
                  className="rounded-lg border border-border-subtle bg-bg-elevated p-3 text-sm transition-colors hover:border-border-strong"
                >
                  <p className="font-medium text-fg">{insight.title}</p>
                  <p className="mt-1 text-xs text-fg-muted">{insight.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
