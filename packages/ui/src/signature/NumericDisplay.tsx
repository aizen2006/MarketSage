import type { HTMLAttributes, ReactNode } from "react";

export interface NumericDisplayProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Emphasize (larger, bolder) for hero/metrics */
  variant?: "compact" | "emphasis";
  /** Positive/negative for color tint */
  trend?: "positive" | "negative" | "neutral";
}

export function NumericDisplay({
  children,
  variant = "compact",
  trend = "neutral",
  className = "",
  ...props
}: NumericDisplayProps) {
  const trendClass =
    trend === "positive"
      ? "text-[var(--positive)]"
      : trend === "negative"
        ? "text-[var(--danger)]"
        : "";
  const variantClass =
    variant === "emphasis"
      ? "text-lg font-semibold tracking-tight md:text-xl"
      : "text-sm font-medium tabular-nums";
  return (
    <span
      {...props}
      className={`${variantClass} ${trendClass} ${className}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {children}
    </span>
  );
}
