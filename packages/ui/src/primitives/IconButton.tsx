"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { buttonTap } from "../motion/presets";

type Variant = "default" | "ghost";
type Size = "xs" | "sm" | "md";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
};

const variantClasses: Record<Variant, string> = {
  default:
    "border border-subtle bg-bg-elevated text-fg-soft hover:text-fg",
  ghost:
    "bg-transparent text-fg-soft hover:text-fg hover:bg-bg-subtle",
};

export function IconButton({
  className = "",
  variant = "default",
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      {...buttonTap}
      {...props}
      className={`inline-flex items-center justify-center rounded-full transition ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    />
  );
}
