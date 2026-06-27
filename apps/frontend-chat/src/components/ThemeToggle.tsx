"use client";

import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./Icon";

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
      <span className="relative z-10 flex w-full items-center justify-between px-1 text-fg-soft">
        <span className="flex h-6 w-6 items-center justify-center">
          <Icon name="light_mode" className="text-[15px]" />
        </span>
        <span className="flex h-6 w-6 items-center justify-center">
          <Icon name="dark_mode" className="text-[15px]" />
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
