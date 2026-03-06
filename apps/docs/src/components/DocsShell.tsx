"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { IconButton } from "@repo/ui";
import { useTheme } from "@repo/ui/theme/ThemeProvider";
import { DocsSidebar } from "./DocsSidebar";

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3001";

export function DocsShell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 border-r border-border-subtle bg-bg-surface px-4 py-4 sm:block">
        <Link href={LANDING_URL} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-xs font-semibold text-primary">
            MS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-fg">
              MarketSage
            </span>
            <span className="text-[11px] text-fg-soft">API Docs</span>
          </div>
        </Link>
        <div className="mt-6">
          <DocsSidebar />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-subtle bg-bg-surface/95 backdrop-blur-md px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-xs font-semibold text-primary">
              MS
            </div>
            <span className="text-sm font-semibold text-fg">API Docs</span>
          </div>
          <div className="hidden text-sm font-medium text-fg sm:block">
            MarketSage API reference
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={LANDING_URL}
              className="hidden text-xs text-fg-muted transition-colors hover:text-fg sm:inline"
            >
              ← Back to home
            </Link>
            <IconButton
              aria-label="Toggle theme"
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
            >
              <span className="text-xs">{theme === "dark" ? "☾" : "☀︎"}</span>
            </IconButton>
          </div>
        </header>

        <main className="flex-1 bg-bg px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto flex max-w-5xl gap-10">
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

