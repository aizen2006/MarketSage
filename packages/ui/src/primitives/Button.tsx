"use client";

import {
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { motion } from "motion/react";
import { buttonTap } from "../motion/presets";

type Variant = "primary" | "ghost" | "outline";
type Size = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed";

const sizeClasses: Record<Size, string> = {
  xs: "h-7 px-2 text-[11px]",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-soft hover:bg-accent-strong",
  ghost:
    "border border-subtle bg-bg-elevated text-fg-soft hover:text-fg hover:border-accent/60",
  outline:
    "border border-subtle bg-transparent text-fg hover:bg-bg-subtle hover:border-accent/60",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      className: `${classes} ${(children.props as { className?: string }).className ?? ""}`.trim(),
    });
  }

  return (
    <motion.button
      {...buttonTap}
      {...props}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
