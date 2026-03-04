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

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-1 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed select-none";

const sizeClasses: Record<Size, string> = {
  xs: "h-7 px-2.5 text-[11px]",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-fg-inverse shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:bg-accent/90 dark:shadow-[0_1px_2px_rgba(255,255,255,0.1)]",
  secondary: "bg-bg-subtle text-fg hover:bg-border-subtle",
  ghost:
    "bg-transparent text-fg-soft hover:text-fg hover:bg-bg-subtle",
  outline:
    "border border-border-subtle bg-transparent text-fg shadow-sm hover:bg-bg-subtle",
  danger: "bg-danger text-white shadow-sm hover:bg-danger/90",
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
