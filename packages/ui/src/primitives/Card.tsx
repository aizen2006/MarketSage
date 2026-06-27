import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ className = "", hoverable = false, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-lg border border-border-subtle bg-bg-surface p-5 text-sm text-fg shadow-soft transition-all duration-150 ${
        hoverable ? "hover:-translate-y-0.5 hover:shadow-elevated" : ""
      } ${className}`}
    />
  );
}
