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
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-border-subtle shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg text-[11px] font-bold text-bg shadow-sm">
            FA
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-fg">
            MarketSage
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <IconButton
            aria-label="Toggle theme"
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            )}
          </IconButton>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border-subtle">
            <Button asChild variant="ghost" size="sm" className="font-medium">
              <Link href={CHAT_SIGNIN_URL}>Log in</Link>
            </Button>
            <Button asChild size="sm" className="font-medium">
              <a href={DOCS_GETTING_STARTED_URL}>Start for free</a>
            </Button>
          </div>
          
          <IconButton variant="ghost" size="sm" className="md:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </IconButton>
        </div>
      </div>
    </motion.header>
  );
}
