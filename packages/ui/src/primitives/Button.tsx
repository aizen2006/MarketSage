"use client";

import {
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-1 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none";

const sizeClasses: Record<Size, string> = {
  xs: "h-7 px-2.5 text-[11px]",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-fg-inverse shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-primary/90 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
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
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
