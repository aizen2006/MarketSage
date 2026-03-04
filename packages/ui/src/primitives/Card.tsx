import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ className = "", hoverable = false, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-border-subtle bg-bg-elevated p-5 text-sm text-fg shadow-sm transition-all duration-200 ${
        hoverable ? "hover:border-border-strong hover:shadow-md" : ""
      } ${className}`}
    />
  );
}
