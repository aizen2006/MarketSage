"use client";

import {
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "soft"
  | "danger";
type Size = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none";

const sizeClasses: Record<Size, string> = {
  xs: "h-7 px-3 text-[11px]",
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-sm",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_6px_16px_rgba(242,106,31,0.28)] hover:bg-accent-strong",
  secondary: "bg-fg text-fg-inverse hover:opacity-90",
  ghost: "bg-transparent text-fg-soft hover:text-fg hover:bg-bg-subtle",
  outline:
    "border-[1.5px] border-accent bg-transparent text-accent hover:bg-accent-tint",
  soft: "bg-accent-soft text-accent-strong hover:brightness-95",
  danger: "bg-danger text-white shadow-sm hover:brightness-95",
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
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
