"use client";

import { motion } from "motion/react";
import { Card } from "../primitives/Card";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { NumericDisplay } from "./NumericDisplay";
import { staggerItem } from "../motion/presets";

export interface MarketSignalCardProps {
  title: string;
  value: string | number;
  valueTrend?: "positive" | "negative" | "neutral";
  confidence: number;
  sparklineData?: number[];
  isNew?: boolean;
  className?: string;
}

function MiniSparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 48;
  const h = 20;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      className="overflow-visible"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MarketSignalCard({
  title,
  value,
  valueTrend = "neutral",
  confidence,
  sparklineData = [],
  isNew = false,
  className = "",
}: MarketSignalCardProps) {
  return (
    <motion.div {...staggerItem}>
      <Card
        hoverable
        className={`relative p-4 ${isNew ? "border-accent/30" : ""} ${className}`}
      >
        {isNew && (
          <span
            className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            aria-hidden
          />
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[var(--fg-muted)]">
              {title}
            </p>
            <NumericDisplay variant="emphasis" trend={valueTrend} className="mt-0.5 block">
              {value}
            </NumericDisplay>
            {sparklineData.length > 0 && (
              <div className="mt-2">
                <MiniSparkline data={sparklineData} />
              </div>
            )}
          </div>
          <ConfidenceMeter value={confidence} size={40} strokeWidth={3} />
        </div>
      </Card>
    </motion.div>
  );
}
