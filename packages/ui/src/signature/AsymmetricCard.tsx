"use client";

import type { HTMLAttributes, ReactNode } from "react";

export interface AsymmetricCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Cut corner: "top-right" | "bottom-left" | "top-left" | "bottom-right" */
  cut?: "top-right" | "bottom-left" | "top-left" | "bottom-right";
  /** Use elevated shadow */
  elevated?: boolean;
  hoverable?: boolean;
}

const cutClipPaths: Record<NonNullable<AsymmetricCardProps["cut"]>, string> = {
  "top-right": "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
  "bottom-left": "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
  "top-left": "polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)",
  "bottom-right":
    "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
};

export function AsymmetricCard({
  children,
  cut = "top-right",
  elevated = false,
  hoverable = false,
  className = "",
  style,
  ...props
}: AsymmetricCardProps) {
  const clipPath = cutClipPaths[cut];
  return (
    <div
      {...props}
      className={`rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--fg)] transition-all duration-[var(--motion-macro)] ${
        elevated ? "shadow-[var(--shadow-elevated)]" : "shadow-[var(--shadow-soft)]"
      } ${hoverable ? "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-elevated)]" : ""} ${className}`}
      style={{
        ...style,
        clipPath,
        WebkitClipPath: clipPath,
      }}
    />
  );
}
