"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "ghost" | "outline";
type Size = "xs" | "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

const variantClasses: Record<Variant, string> = {
  default:
    "bg-bg-subtle text-fg hover:bg-border-subtle shadow-sm",
  ghost:
    "bg-transparent text-fg-soft hover:text-fg hover:bg-bg-subtle",
  outline:
    "border border-border-subtle bg-transparent text-fg hover:bg-bg-subtle shadow-sm",
};

export function IconButton({
  className = "",
  variant = "ghost",
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-1 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    />
  );
}
