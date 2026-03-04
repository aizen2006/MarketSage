"use client";

import { KeyboardEvent, useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconButton } from "@repo/ui";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showSuggestions = focused && value.trim().length > 0;

  const filteredSuggestions = useMemo(() => {
    const q = value.toLowerCase();
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 4);
  }, [value]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    setActiveSuggestion(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
    } else if (event.key === "Tab" && activeSuggestion !== null) {
      event.preventDefault();
      const suggestion = filteredSuggestions[activeSuggestion];
      setValue(suggestion);
    }
  }

  return (
    <div
      className={`relative w-full max-w-3xl rounded-2xl border transition-all duration-300 bg-bg shadow-sm ${
        focused 
          ? "border-border-strong shadow-lg ring-1 ring-border-strong" 
          : "border-border-subtle"
      }`}
      aria-label="Message composer"
    >
      <div className="flex items-end gap-3 px-3 py-3">
        <IconButton
          variant="ghost"
          size="sm"
          className="mb-0.5 shrink-0 rounded-xl"
          aria-label="Insert template or attachment"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </IconButton>
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={isEmptyState && !value ? 2 : 1}
          className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-relaxed text-fg placeholder:text-fg-soft focus:outline-none"
          placeholder="Ask MarketSage anything..."
          aria-label="Type your financial query"
        />
        
        <motion.button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={handleSend}
          whileHover={value.trim() && !disabled ? { scale: 1.05 } : {}}
          whileTap={value.trim() && !disabled ? { scale: 0.95 } : {}}
          className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
            value.trim() && !disabled
              ? "bg-fg text-bg shadow-md"
              : "bg-bg-elevated text-fg-soft"
          }`}
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-[calc(100%+12px)] left-0 z-50 w-full rounded-xl border border-border-subtle bg-bg-elevated p-1.5 shadow-xl backdrop-blur-md"
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
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${
                    selected
                      ? "bg-bg-subtle text-fg"
                      : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue(suggestion);
                    setActiveSuggestion(index);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  <span className="truncate">{suggestion}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
