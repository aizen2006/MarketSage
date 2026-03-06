"use client";

import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative inline-flex h-8 w-[72px] items-center rounded-full border border-border-subtle bg-bg-subtle px-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      aria-label="Toggle theme"
      aria-pressed={isDark}
    >
      <span className="relative z-10 flex w-full items-center justify-between px-2 text-fg-soft">
        <span className="flex h-6 w-6  pl- -0.5 pr-2 items-center justify-center rounded-full transition-colors">
          <SunIcon />
        </span>
        <span className="flex h-6 w-6 px-2 items-center justify-center rounded-full transition-colors">
          <MoonIcon />
        </span>
      </span>
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className="absolute top-1 h-6 w-6 rounded-full bg-bg-elevated shadow-soft border border-border-subtle"
        style={{
          left: isDark ? 40 : 8,
        }}
      />
    </motion.button>
  );
}
