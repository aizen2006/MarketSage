"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { motion } from "motion/react";
import { buttonTap } from "../lib/motion";

interface ComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  isEmptyState?: boolean;
}

const SUGGESTIONS = [
  "Summarize my portfolio performance over the last 30 days.",
  "Analyze my P&L and highlight biggest contributors.",
  "Assess my current risk exposure vs target.",
  "Suggest a rebalance strategy for this week.",
];

export function Composer({ onSend, disabled, isEmptyState }: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);

  const showSuggestions = focused && value.trim().length > 0;

  const filteredSuggestions = useMemo(() => {
    const q = value.toLowerCase();
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 4);
  }, [value]);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    setActiveSuggestion(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
      return;
    }

    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((prev) => {
        const next = prev === null ? 0 : (prev + 1) % filteredSuggestions.length;
        return next;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((prev) => {
        const next =
          prev === null
            ? filteredSuggestions.length - 1
            : (prev - 1 + filteredSuggestions.length) %
              filteredSuggestions.length;
        return next;
      });
    } else if (event.key === "Enter" && event.shiftKey) {
      // Allow newline with Shift+Enter
      return;
    } else if (event.key === "Tab" && activeSuggestion !== null) {
      event.preventDefault();
      const suggestion = filteredSuggestions[activeSuggestion];
      setValue(suggestion);
    }
  }

  return (
    <div
      className={`relative w-full max-w-2xl rounded-2xl border border-subtle bg-bg-elevated px-3 py-2 shadow-soft transition ${
        focused ? "border-accent shadow-soft" : ""
      }`}
      aria-label="Message composer"
    >
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-bg-subtle text-xl text-fg-soft hover:text-fg"
          aria-label="Insert template or attachment"
        >
          +
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={isEmptyState ? 2 : 1}
          className="max-h-32 flex-1 resize-none bg-transparent pb-1 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
          placeholder="Type your financial query…"
          aria-label="Type your financial query"
        />
        <motion.button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={handleSend}
          className="mb-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm text-white shadow-soft disabled:cursor-not-allowed disabled:bg-accent/40"
          aria-label="Send message"
          {...buttonTap}
        >
          ➤
        </motion.button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className="absolute bottom-full left-0 z-10 mb-2 w-full max-w-md rounded-2xl border border-subtle bg-bg-elevated p-2 text-xs text-fg shadow-soft"
          role="listbox"
          aria-label="Smart suggestions"
        >
          {filteredSuggestions.map((suggestion, index) => {
            const selected = index === activeSuggestion;
            return (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={selected}
                className={`mb-1 w-full rounded-xl px-2 py-1 text-left transition last:mb-0 ${
                  selected
                    ? "bg-accent-soft text-fg"
                    : "hover:bg-bg-subtle text-fg-muted"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setValue(suggestion);
                  setActiveSuggestion(index);
                }}
              >
                {suggestion}
              </button>
            );
          })}
          <p className="mt-1 px-1 text-[0.68rem] text-fg-soft">
            Use ↑/↓ to navigate, Tab to apply.
          </p>
        </div>
      )}
    </div>
  );
}

