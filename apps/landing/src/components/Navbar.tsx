"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconButton, Button } from "@repo/ui";
import { useTheme } from "@repo/ui/theme/ThemeProvider";
import { motion } from "motion/react";

const NAV_ITEMS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002", label: "Docs", external: true },
];

const CHAT_SIGNIN_URL =
  process.env.NEXT_PUBLIC_CHAT_SIGNIN_URL ?? "http://localhost:3000/signin";
const DOCS_GETTING_STARTED_URL =
  process.env.NEXT_PUBLIC_DOCS_GETTING_STARTED_URL ??
  (process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002") +
    "/getting-started";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="sticky top-0 z-40"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 ${
          scrolled
            ? "backdrop-blur-md bg-bg/80 border-b border-border-subtle"
            : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft text-accent-strong shadow-soft">
            <span className="text-sm font-semibold">MS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              MarketSage
            </span>
            <span className="text-[11px] text-fg-soft">
              Finance agent & API
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-fg-muted md:flex">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <IconButton
            aria-label="Toggle theme"
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
          >
            <span className="text-xs">
              {theme === "dark" ? "☾" : "☀︎"}
            </span>
          </IconButton>

          <div className="hidden items-center gap-2 sm:flex">
            <Button asChild variant="outline" size="sm">
              <Link href={CHAT_SIGNIN_URL}>Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <a href={DOCS_GETTING_STARTED_URL}>Get API Key</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

