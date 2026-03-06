"use client";

import { motion } from "motion/react";
import type { Conversation } from "../types/chat";
import { buttonTap } from "../lib/motion";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const updatedAt = new Date(conversation.updatedAt);
  const timeLabel = updatedAt.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.button
      type="button"
      className={`group relative flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 ${
        isActive
          ? "bg-bg-elevated text-fg"
          : "text-fg-muted hover:bg-bg-elevated hover:text-fg"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      {...buttonTap}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <span className="truncate text-[13px] font-medium tracking-tight">
          {conversation.title}
        </span>
        <span className="shrink-0 text-[11px] text-fg-soft font-mono">
          {timeLabel}
        </span>
      </div>
      <p className="line-clamp-1 w-11/12 text-[12px] text-fg-soft">
        {conversation.lastMessagePreview}
      </p>

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-soft hover:bg-bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-1 focus-visible:ring-offset-bg-elevated"
          aria-label="Rename conversation"
          title="Rename"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-soft hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-elevated"
          aria-label="Delete conversation"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
    </motion.button>
  );
}
