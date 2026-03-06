import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional class for custom sizing (default: h-4 w-full rounded) */
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={`animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-subtle)] ${className}`}
      aria-hidden
    />
  );
}
