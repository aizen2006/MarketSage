"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { buttonTap } from "../motion/presets";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ className = "", ...props }: IconButtonProps) {
  return (
    <motion.button
      {...buttonTap}
      {...props}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-bg-elevated text-xs text-fg-soft hover:text-fg ${className}`}
    />
  );
}

