import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ className = "", hoverable = false, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-lg border border-border-subtle bg-bg-elevated p-5 text-sm text-fg transition-colors duration-150 ${
        hoverable ? "hover:border-border-strong" : ""
      } ${className}`}
    />
  );
}
