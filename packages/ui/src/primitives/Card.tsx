import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-subtle bg-bg-elevated p-4 text-sm text-fg shadow-soft ${className}`}
    />
  );
}

