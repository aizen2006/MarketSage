"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Conversation } from "../types/chat";
import { ConversationItem } from "./ConversationItem";
import { buttonTap } from "../lib/motion";
import { ConfirmDialog } from "./ConfirmDialog";

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
      <aside className="flex h-full w-full flex-col border-r border-subtle bg-bg-subtle/60 px-3 py-3 md:max-w-xs">
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent-soft text-xs font-semibold text-accent-strong shadow-soft">
              FA
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-fg">FinanceAI</div>
              <div className="text-[0.7rem] text-fg-soft">
                Enterprise v2.0 • Chat
              </div>
            </div>
          </div>
          <motion.button
            type="button"
            className="hidden h-7 items-center justify-center rounded-xl border border-subtle bg-bg-elevated px-2 text-[0.7rem] text-fg-soft hover:text-fg md:inline-flex"
            aria-label="New conversation"
            onClick={onCreateConversation}
            {...buttonTap}
          >
            +
          </motion.button>
        </div>

        <div className="mb-3">
          <label className="sr-only" htmlFor="conversation-search">
            Search conversations
          </label>
          <input
            id="conversation-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="h-8 w-full rounded-xl border border-subtle bg-bg-elevated px-3 text-[0.75rem] text-fg placeholder:text-fg-soft focus:border-accent focus:outline-none"
          />
        </div>

        <div
          className="flex-1 space-y-2 overflow-y-auto pb-2"
          aria-label="Conversation list"
        >
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
            <p className="px-1 text-[0.72rem] text-fg-soft">
              No conversations match "{query}".
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 pt-2 text-[0.75rem]">
          <motion.button
            type="button"
            className="flex h-8 w-full items-center justify-center rounded-xl border border-dashed border-subtle bg-bg-elevated text-xs font-medium text-fg-soft hover:border-accent hover:text-fg"
            onClick={onCreateConversation}
            {...buttonTap}
          >
            <span className="mr-1 text-base leading-none">+</span>
            New conversation
          </motion.button>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-bg-elevated px-2 py-2 text-[0.75rem] text-fg-soft">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-[0.7rem] font-semibold text-accent-strong">
              AT
            </span>
            <div className="leading-tight">
              <div className="text-[0.8rem] font-medium text-fg">
                Alex Thompson
              </div>
              <div className="text-[0.7rem] text-fg-soft">Premium member</div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-subtle text-[0.75rem] text-fg-soft hover:text-fg"
            aria-label="User settings"
          >
            ⚙
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

