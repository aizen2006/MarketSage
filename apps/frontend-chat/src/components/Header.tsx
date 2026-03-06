"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { IconButton } from "@repo/ui";

const MODES = ["Quick", "Deep", "Auto"] as const;

type HeaderProps = {
  onToggleSidebar?: () => void;
  mode: "quick" | "deep" | "auto";
  onModeChange?: (mode: "quick" | "deep" | "auto") => void;
};

export function Header({ onToggleSidebar, mode, onModeChange }: HeaderProps) {
  const [activeMode, setActiveMode] =
    useState<(typeof MODES)[number]>(
      mode === "deep" ? "Deep" : mode === "auto" ? "Auto" : "Quick",
    );

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
          className="relative flex items-center p-1 rounded-xl bg-bg-elevated border border-border-subtle shadow-sm"
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
                onClick={() => {
                  setActiveMode(mode);
                  const next =
                    mode === "Quick"
                      ? "quick"
                      : mode === "Deep"
                        ? "deep"
                        : "auto";
                  onModeChange?.(next);
                }}
                className={`relative z-10 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
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
            layoutId="header-mode-pill"
            className="absolute inset-y-1 rounded-lg bg-bg shadow-soft border border-border-subtle"
            style={{
              width: "calc(33.3333% - 6px)",
              left:
                activeMode === "Quick"
                  ? "4px"
                  : activeMode === "Deep"
                    ? "calc(33.3333% + 2px)"
                    : "calc(66.6666% - 2px)",
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
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
