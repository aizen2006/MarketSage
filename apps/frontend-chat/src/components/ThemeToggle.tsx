"use client";

import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-8 items-center rounded-full border border-subtle bg-bg-subtle px-1 text-xs text-fg-soft shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      aria-label="Toggle theme"
      aria-pressed={isDark}
    >
      <span className="relative z-10 flex w-16 items-center justify-between px-2">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span>Light</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-sky-400" />
          <span>Dark</span>
        </span>
      </span>
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          duration: 0.35,
        }}
        className="absolute inset-y-1 w-1/2 rounded-full bg-bg-elevated shadow-soft"
        style={{
          left: isDark ? "50%" : "0%",
        }}
      />
    </button>
  );
}

