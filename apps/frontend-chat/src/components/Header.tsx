"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { IconButton } from "@repo/ui";

const MODES = ["Analysis", "Trader", "Planner"] as const;

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [activeMode, setActiveMode] =
    useState<(typeof MODES)[number]>("Analysis");

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-border-subtle bg-bg/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-3">
        <IconButton
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </IconButton>
        
        <nav
          className="relative flex items-center p-1 rounded-lg bg-bg-elevated border border-border-subtle shadow-sm"
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
                className={`relative z-10 rounded-md px-3 py-1 text-[13px] font-medium transition-colors ${
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
            className="absolute inset-y-1 rounded-md bg-bg shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.05)] border border-border-subtle"
            style={{
              width: "calc(33.3333% - 2.6px)",
              left:
                activeMode === "Analysis"
                  ? "4px"
                  : activeMode === "Trader"
                    ? "calc(33.3333% + 1.3px)"
                    : "calc(66.6666% - 1.3px)",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
