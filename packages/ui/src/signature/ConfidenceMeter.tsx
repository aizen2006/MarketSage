"use client";

import { useEffect, useState } from "react";

export interface ConfidenceMeterProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function ConfidenceMeter({
  value,
  size = 44,
  strokeWidth = 4,
  className = "",
  showLabel = true,
}: ConfidenceMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setDisplayValue(clamped);
    });
    return () => cancelAnimationFrame(timer);
  }, [clamped]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className=" -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-subtle)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: "drop-shadow(0 0 6px var(--accent))",
            transition: "stroke-dashoffset 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-[10px] font-semibold tabular-nums text-[var(--fg)]"
          style={{ fontSize: size * 0.22 }}
        >
          {Math.round(displayValue)}%
        </span>
      )}
    </div>
  );
}
