"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const QUICK_ACTIONS = [
  { id: "new-chat", label: "New conversation", shortcut: "N", path: "/chat" },
  { id: "api-keys", label: "API keys", shortcut: "K", path: "/api-keys" },
  { id: "quick-aapl", label: "Quick: AAPL summary", action: "query" },
  { id: "quick-portfolio", label: "Quick: Portfolio risk", action: "query" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onRunQuery?: (query: string) => void;
}

export function CommandPalette({
  open,
  onClose,
  onRunQuery,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query.trim()
    ? QUICK_ACTIONS.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()),
      )
    : QUICK_ACTIONS;

  const handleSelect = useCallback(
    (item: (typeof QUICK_ACTIONS)[0]) => {
      if (item.path) {
        router.push(item.path);
        onClose();
      } else if (item.action === "query" && onRunQuery) {
        onRunQuery(item.label.replace(/^Quick: /, ""));
        onClose();
      }
    },
    [router, onClose, onRunQuery],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, filtered, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-bg/80 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-label="Command palette"
      >
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl rounded-lg border border-border-subtle bg-bg-surface overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-fg-soft shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or run quick action..."
              className="flex-1 bg-transparent py-2 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
              autoFocus
              aria-label="Search commands"
            />
            <kbd className="rounded border border-border-subtle px-1.5 py-0.5 text-[10px] text-fg-muted">
              Esc
            </kbd>
          </div>
          <ul
            className="max-h-[280px] overflow-y-auto py-2"
            role="listbox"
            aria-label="Quick actions"
          >
            {filtered.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === selectedIndex}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                    i === selectedIndex
                      ? "bg-primary/15 text-fg"
                      : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                  }`}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => handleSelect(item)}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <kbd className="rounded border border-border-subtle px-1.5 py-0.5 text-[10px] text-fg-soft">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return { open, setOpen };
}
