"use client";

import { useMemo, useState } from "react";
import type { Conversation } from "../types/chat";
import { ConversationItem } from "./ConversationItem";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button, IconButton } from "@repo/ui";

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
      <aside className="flex h-full w-full flex-col bg-bg border-r border-border-subtle px-3 py-4 md:max-w-[280px]">
        {/* Header Logo & New Chat */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-fg text-xs font-bold text-bg shadow-sm">
              FA
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold tracking-tight text-fg leading-none">
                FinanceAI
              </span>
              <span className="text-[11px] text-fg-soft mt-0.5">
                Enterprise
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
              onRename={() => {
                const nextTitle = window.prompt(
                  "Rename conversation",
                  conv.title,
                );
                if (nextTitle && nextTitle.trim()) {
                  onRenameConversation(conv.id, nextTitle.trim());
                }
              }}
              onDelete={() => setPendingDeleteId(conv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="px-2 py-4 text-center text-[12px] text-fg-soft">
              No conversations match "{query}".
            </p>
          )}
        </div>

        {/* Footer User Profile */}
        <div className="mt-auto pt-4 px-1">
          <button className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-fg-inverse">
                AT
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-medium leading-none text-fg">
                  Alex Thompson
                </span>
                <span className="text-[11px] text-fg-soft mt-0.5">
                  Pro Plan
                </span>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg-soft"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
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
