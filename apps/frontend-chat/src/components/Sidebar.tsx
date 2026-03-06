"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import type { Conversation } from "../types/chat";
import { ConversationItem } from "./ConversationItem";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button, IconButton } from "@repo/ui";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onCreateConversation,
  onRenameConversation,
  onDeleteConversation,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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
    return conversations.filter((conv) =>
      conv.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [conversations, query]);

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
        <div className="mb-4 px-1">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-soft" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="h-8 w-full rounded-md border border-transparent bg-bg-elevated pl-8 pr-3 text-[13px] text-fg placeholder:text-fg-soft transition-all focus:border-border-strong focus:bg-bg focus:outline-none focus:ring-1 focus:ring-border-strong"
            />
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
