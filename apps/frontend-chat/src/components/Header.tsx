"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { buttonTap } from "../lib/motion";

const MODES = ["Analysis", "Trader", "Planner"] as const;

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [activeMode, setActiveMode] =
    useState<(typeof MODES)[number]>("Analysis");

  return (
    <header className="flex items-center justify-between gap-3 border-b border-subtle bg-bg-elevated/60 px-3 py-2 md:px-5 md:py-3">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-subtle text-sm text-fg-soft hover:text-fg md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <nav
          className="relative flex items-center gap-1 rounded-full bg-bg-subtle px-1 py-1 text-[0.75rem]"
          role="tablist"
          aria-label="Mode"
        >
          {MODES.map((mode) => {
            const isActive = mode === activeMode;
            return (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveMode(mode)}
                className={`relative z-10 rounded-full px-2.5 py-1 transition ${
                  isActive
                    ? "text-fg"
                    : "text-fg-soft hover:text-fg-muted"
                }`}
              >
                {mode}
              </button>
            );
          })}
          <motion.span
            layout
            className="absolute inset-y-1 rounded-full bg-bg-elevated shadow-soft"
            style={{
              width: "33.3333%",
              left:
                activeMode === "Analysis"
                  ? "0%"
                  : activeMode === "Trader"
                    ? "33.3333%"
                    : "66.6666%",
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 26,
            }}
          />
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        <motion.button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-bg-elevated text-xs text-fg-soft hover:text-fg"
          aria-label="Chat settings"
          {...buttonTap}
        >
          ⚙
        </motion.button>
      </div>
    </header>
  );
}

