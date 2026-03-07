"use client";

import { useEffect, useState } from "react";
import { MarketSignalCard } from "@repo/ui";

type SignalItem = {
  id: string;
  title: string;
  value: string;
  valueTrend: "positive" | "negative" | "neutral";
  confidence: number;
  sparklineData: number[];
  isNew: boolean;
};

type InsightItem = {
  id: string;
  title: string;
  summary: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function InsightsPanel() {
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/user/insights`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load insights");
        return res.json();
      })
      .then((data: { signals: SignalItem[]; insights: InsightItem[] }) => {
        if (!cancelled) {
          setSignals(data.signals ?? []);
          setInsights(data.insights ?? []);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
          setSignals([]);
          setInsights([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Live signals
              </h2>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-[72px] animate-pulse rounded-lg bg-bg-elevated"
                  />
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Insight stream
              </h2>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-bg-elevated"
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-fg-muted">{error}</p>
          <p className="mt-2 text-xs text-fg-soft">
            The insights panel will retry when you reopen it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Live signals
            </h2>
            <div className="space-y-3">
              {signals.length === 0 ? (
                <p className="text-xs text-fg-soft">No signals yet.</p>
              ) : (
                signals.map((s) => (
                  <MarketSignalCard
                    key={s.id}
                    title={s.title}
                    value={s.value}
                    valueTrend={s.valueTrend}
                    confidence={s.confidence}
                    sparklineData={s.sparklineData}
                    isNew={s.isNew}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Insight stream
            </h2>
            <ul className="space-y-2">
              {insights.length === 0 ? (
                <li className="text-xs text-fg-soft">No insights yet.</li>
              ) : (
                insights.map((insight) => (
                  <li
                    key={insight.id}
                    className="rounded-lg border border-border-subtle bg-bg-elevated p-3 text-sm transition-colors hover:border-border-strong"
                  >
                    <p className="font-medium text-fg">{insight.title}</p>
                    <p className="mt-1 text-xs text-fg-muted">
                      {insight.summary}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
