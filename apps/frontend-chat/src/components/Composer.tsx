"use client";

import {
  KeyboardEvent,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  DragEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./Icon";

/** Local attachment for composer (client-side only, no upload). */
export interface ComposerAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  preview?: string;
}

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

const TEXT_TYPES = /^text\//;
const MAX_PREVIEW_LENGTH = 120;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Composer({ onSend, disabled, isEmptyState }: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuggestions = focused;

  const filteredSuggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return SUGGESTIONS.slice(0, 4);
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 4);
  }, [value]);

  useEffect(() => {
    setActiveSuggestion((prev) => {
      if (filteredSuggestions.length === 0) return null;
      if (prev === null) return 0;
      return prev >= filteredSuggestions.length ? 0 : prev;
    });
  }, [filteredSuggestions.length]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const next: ComposerAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      next.push({
        id: `${file.name}-${file.size}-${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
      });
    }
    setAttachments((prev) => [...prev, ...next]);
    // Optional: load text preview for text files
    next.forEach((a) => {
      if (TEXT_TYPES.test(a.file.type)) {
        a.file
          .text()
          .then((text) => {
            const preview = text.slice(0, MAX_PREVIEW_LENGTH).trim();
            setAttachments((prev) =>
              prev.map((x) =>
                x.id === a.id ? { ...x, preview } : x
              )
            );
          })
          .catch(() => {});
      }
    });
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

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
    setAttachments([]);
    setActiveSuggestion(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (
        showSuggestions &&
        filteredSuggestions.length > 0 &&
        activeSuggestion !== null
      ) {
        event.preventDefault();
        const suggestion = filteredSuggestions[activeSuggestion];
        setValue(suggestion);
        setActiveSuggestion(null);
        return;
      }
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

  function onDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    addFiles(files ?? null);
  }

  return (
    <div
      className={`relative w-full max-w-3xl rounded-lg border transition-all duration-300 bg-bg-surface shadow-soft ${
        focused
          ? "border-accent ring-2 ring-accent-soft"
          : "border-border-subtle"
      } ${isDragging ? "ring-2 ring-accent-soft border-accent" : ""}`}
      aria-label="Message composer"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap items-center gap-2 px-3 pt-2 pb-1 border-b border-border-subtle"
          >
            {attachments.map((a) => (
              <motion.div
                key={a.id}
                layout
                className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-subtle px-2 py-1.5 text-[12px] text-fg-muted"
              >
                <span className="truncate max-w-[140px]" title={a.name}>
                  {a.name}
                </span>
                <span className="shrink-0 text-fg-soft">{formatSize(a.size)}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="shrink-0 rounded p-0.5 text-fg-soft hover:bg-bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                  aria-label={`Remove ${a.name}`}
                >
                  <Icon name="close" className="text-[14px]" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="*/*"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={isEmptyState && !value ? 2 : 1}
        className="max-h-[200px] w-full resize-none bg-transparent px-4 pt-4 pb-1 text-[15px] leading-relaxed text-fg placeholder:text-fg-soft focus:outline-none"
        placeholder="Ask MarketSage anything..."
        aria-label="Type your financial query"
      />

      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Attach file"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-pill border border-border-subtle text-fg-soft transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            <Icon name="add" className="text-[18px]" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border-subtle px-3 py-1.5 text-[13px] font-medium text-fg-muted">
            <Icon name="psychology" className="text-[16px] text-accent" />
            Think Deeper
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border-subtle px-3 py-1.5 text-[13px] font-medium text-fg-muted">
            <Icon name="tune" className="text-[16px]" />
            Tools
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-pill border border-border-subtle px-3 py-1.5 text-[13px] font-medium text-fg sm:inline-flex">
            <span className="h-3.5 w-3.5 rounded-full bg-accent" />
            Ember Pro AI
            <Icon name="expand_more" className="text-[18px] text-fg-soft" />
          </span>
          <button
            type="button"
            aria-label="Voice input"
            className="flex h-8 w-8 items-center justify-center rounded-pill text-fg-soft transition-colors hover:text-fg"
          >
            <Icon name="mic" className="text-[19px]" />
          </button>
          <motion.button
            type="button"
            disabled={disabled || !value.trim()}
            onClick={handleSend}
            whileHover={value.trim() && !disabled ? { scale: 1.05 } : {}}
            whileTap={value.trim() && !disabled ? { scale: 0.95 } : {}}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-pill transition-colors ${
              value.trim() && !disabled
                ? "bg-accent text-white shadow-[0_6px_16px_rgba(242,106,31,0.3)] hover:bg-accent-strong"
                : "bg-bg-subtle text-fg-soft"
            }`}
            aria-label="Send message"
          >
            <Icon name="arrow_upward" className="text-[19px]" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-[calc(100%+12px)] left-0 right-0 z-50 w-full"
            role="listbox"
            aria-label="Suggested prompts"
          >
            {isEmptyState && !value.trim() && (
              <p className="mb-2 text-[13px] text-fg-muted">
                Upload a PDF or paste a ticker to get started.
              </p>
            )}
            <div className="rounded-lg border border-border-subtle bg-bg-surface p-2 shadow-overlay">
              {filteredSuggestions.map((suggestion, index) => {
                const selected = index === activeSuggestion;
                return (
                  <button
                    key={suggestion}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px] transition-colors ${
                      selected
                        ? "bg-accent-tint text-accent-strong"
                        : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setValue(suggestion);
                      setActiveSuggestion(index);
                    }}
                  >
                    <Icon
                      name="auto_awesome"
                      className={`text-[16px] ${selected ? "text-accent" : "text-fg-soft"}`}
                    />
                    <span className="truncate">{suggestion}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
