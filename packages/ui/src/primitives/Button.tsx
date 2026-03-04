"use client";

import type { ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";
import { buttonTap } from "../motion/presets";

type Variant = "primary" | "ghost";
type Size = "sm" | "md";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed";

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-soft hover:bg-accent-strong",
  ghost:
    "border border-subtle bg-bg-elevated text-fg-soft hover:text-fg hover:border-accent/60",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      {...buttonTap}
      {...props}
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    />
  );
}

