"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import type { Conversation } from "../types/chat";
import { ConversationItem } from "./ConversationItem";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button, IconButton } from "@repo/ui";
import { useAuth } from "../context/AuthContext";

const QUICK_PROMPTS = [
  "Summarize my portfolio performance over the last 30 days.",
  "Analyze my P&L and highlight biggest contributors.",
  "Assess my current risk exposure vs target.",
  "Suggest a rebalance strategy for this week.",
];

type SuggestionItem =
  | { type: "conversation"; conv: Conversation }
  | { type: "prompt"; text: string };

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
  onRunSuggestion?: (text: string) => void;
}

const MAX_CONV_SUGGESTIONS = 5;
const MAX_PROMPT_SUGGESTIONS = 4;

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onCreateConversation,
  onRenameConversation,
  onDeleteConversation,
  onRunSuggestion,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<
    number | null
  >(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { user, signout } = useAuth();

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(q) ||
        conv.lastMessagePreview.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const suggestionItems = useMemo((): SuggestionItem[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const convs = filtered.slice(0, MAX_CONV_SUGGESTIONS).map((conv) => ({
      type: "conversation" as const,
      conv,
    }));
    const prompts = QUICK_PROMPTS.filter((s) =>
      s.toLowerCase().includes(q),
    )
      .slice(0, MAX_PROMPT_SUGGESTIONS)
      .map((text) => ({ type: "prompt" as const, text }));
    return [...convs, ...prompts];
  }, [filtered, query]);

  const showSuggestions =
    searchFocused && query.trim().length > 0 && suggestionItems.length > 0;

  useEffect(() => {
    setActiveSuggestionIndex(
      suggestionItems.length > 0 ? 0 : null,
    );
  }, [suggestionItems.length, query]);

  useEffect(() => {
    if (!showSuggestions) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const selectSuggestion = useCallback(
    (item: SuggestionItem) => {
      if (item.type === "conversation") {
        onSelectConversation(item.conv.id);
        setQuery("");
        setSearchFocused(false);
      } else {
        if (onRunSuggestion) {
          onRunSuggestion(item.text);
          setQuery("");
          setSearchFocused(false);
        }
      }
    },
    [onSelectConversation, onRunSuggestion],
  );

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestionItems.length === 0) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setSearchFocused(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => {
          const next =
            prev === null ? 0 : (prev + 1) % suggestionItems.length;
          return next;
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => {
          const next =
            prev === null
              ? suggestionItems.length - 1
              : (prev - 1 + suggestionItems.length) % suggestionItems.length;
          return next;
        });
        return;
      }
      if (e.key === "Enter" && activeSuggestionIndex !== null) {
        e.preventDefault();
        selectSuggestion(suggestionItems[activeSuggestionIndex]);
      }
    },
    [
      showSuggestions,
      suggestionItems,
      activeSuggestionIndex,
      selectSuggestion,
    ],
  );

  const pendingConversation = conversations.find(
    (c) => c.id === pendingDeleteId,
  );

  return (
    <>
      <aside className="flex h-full w-full flex-col bg-bg-surface px-3 py-4 md:max-w-[280px]">
        {/* Header Logo & New Chat */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-fg-inverse shadow-sm">
              MS
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold tracking-tight text-fg leading-none">
                MarketSage
              </span>
              <span className="text-[11px] text-fg-soft mt-0.5">
                Finance
              </span>
            </div>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onCreateConversation}
            aria-label="New conversation"
            title="New Chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </IconButton>
        </div>

        {/* Search */}
        <div className="mb-4 px-1" ref={searchContainerRef}>
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-soft" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {}}
              placeholder="Search conversations..."
              className="h-8 w-full rounded-md border border-transparent bg-bg-elevated pl-8 pr-3 text-[13px] text-fg placeholder:text-fg-soft transition-all focus:border-border-strong focus:bg-bg focus:outline-none focus:ring-1 focus:ring-border-strong"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="sidebar-search-listbox"
              aria-activedescendant={
                showSuggestions && activeSuggestionIndex !== null
                  ? `sidebar-suggestion-${activeSuggestionIndex}`
                  : undefined
              }
            />
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  id="sidebar-search-listbox"
                  role="listbox"
                  aria-label="Search suggestions"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-y-auto rounded-lg border border-border-subtle bg-bg-elevated py-1 shadow-xl"
                >
                  {suggestionItems.map((item, index) => {
                    const selected = index === activeSuggestionIndex;
                    if (item.type === "conversation") {
                      return (
                        <button
                          key={item.conv.id}
                          id={`sidebar-suggestion-${index}`}
                          role="option"
                          aria-selected={selected}
                          type="button"
                          className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-[13px] transition-colors ${
                            selected
                              ? "bg-bg-subtle text-fg"
                              : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectSuggestion(item);
                          }}
                        >
                          <span className="font-medium truncate">
                            {item.conv.title}
                          </span>
                          <span className="line-clamp-1 text-[11px] text-fg-soft">
                            {item.conv.lastMessagePreview}
                          </span>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={`prompt-${index}-${item.text.slice(0, 20)}`}
                        id={`sidebar-suggestion-${index}`}
                        role="option"
                        aria-selected={selected}
                        type="button"
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors ${
                          selected
                            ? "bg-bg-subtle text-fg"
                            : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion(item);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        <span className="line-clamp-1 truncate">{item.text}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 scrollbar-hide">
          {filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onClick={() => onSelectConversation(conv.id)}
              onRename={(nextTitle) => {
                if (nextTitle.trim()) {
                  onRenameConversation(conv.id, nextTitle.trim());
                }
              }}
              onDelete={() => setPendingDeleteId(conv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="px-2 py-4 text-center text-[12px] text-fg-soft">
              No conversations match &quot;{query}&quot;.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 px-1 space-y-2 relative" ref={profileRef}>
          <Link
            href="/api-keys"
            className="flex items-center justify-between rounded-lg px-2 py-2 text-[12px] text-fg-soft hover:bg-bg-elevated hover:text-fg transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M4.9 4.9 7.1 7.1" />
                <path d="M16.9 16.9 19.1 19.1" />
                <path d="M3 12h3" />
                <path d="M18 12h3" />
                <path d="M4.9 19.1 7.1 16.9" />
                <path d="M16.9 7.1 19.1 4.9" />
              </svg>
              <span>API Keys</span>
            </span>
            <span className="text-[10px] uppercase tracking-wide text-fg-muted">
              New
            </span>
          </Link>

          {/* User Profile */}
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-fg-inverse shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() ?? "?"}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[13px] font-medium leading-none text-fg truncate">
                  {user?.name ?? "Account"}
                </span>
                <span className="text-[11px] text-fg-soft mt-0.5 truncate">
                  {user?.email ?? ""}
                </span>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg-soft shrink-0"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-1 right-1 mb-1 rounded-xl border border-border-subtle bg-bg-elevated p-3 shadow-xl z-50"
                role="dialog"
                aria-label="User menu"
              >
                <p className="text-[13px] font-medium text-fg truncate">
                  {user?.name ?? "Account"}
                </p>
                <p className="text-[12px] text-fg-muted truncate mt-0.5">
                  {user?.email ?? ""}
                </p>
                <Button
                  variant="ghost"
                  className="mt-3 w-full justify-center text-[13px]"
                  onClick={() => {
                    setProfileOpen(false);
                    signout();
                  }}
                >
                  Sign out
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <ConfirmDialog
        open={Boolean(pendingConversation)}
        title="Delete conversation?"
        description={`This will permanently remove "${pendingConversation?.title}". This cannot be undone.`}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            onDeleteConversation(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />
    </>
  );
}
