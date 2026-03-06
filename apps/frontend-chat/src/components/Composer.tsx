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
import { IconButton } from "@repo/ui";

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

  const showSuggestions = focused && value.trim().length > 0;

  const filteredSuggestions = useMemo(() => {
    const q = value.toLowerCase();
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 4);
  }, [value]);

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
      className={`relative w-full max-w-3xl rounded-2xl border transition-all duration-300 bg-bg-surface shadow-soft ${
        focused
          ? "border-border-strong ring-1 ring-border-strong"
          : "border-border-subtle"
      } ${isDragging ? "ring-1 ring-border-strong border-border-strong" : ""}`}
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
                  className="shrink-0 rounded p-0.5 text-fg-soft hover:bg-bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
                  aria-label={`Remove ${a.name}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 px-3 py-3">
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
        <IconButton
          variant="ghost"
          size="sm"
          className="mb-0.5 shrink-0 rounded-xl"
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </IconButton>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={isEmptyState && !value ? 2 : 1}
          className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 pl-0 pr-1 text-[15px] leading-relaxed text-fg placeholder:text-fg-soft focus:outline-none"
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
              ? "bg-primary text-fg-inverse"
              : "bg-bg-surface text-fg-soft"
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
