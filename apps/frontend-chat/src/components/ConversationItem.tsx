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
      <div className="absolute right-2 top-2 hidden items-center gap-1 group-hover:flex">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-bg-subtle text-fg-soft hover:bg-bg-elevated hover:text-fg shadow-sm border border-border-subtle"
          aria-label="Rename conversation"
          title="Rename"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-bg-subtle text-danger hover:bg-danger/10 shadow-sm border border-border-subtle"
          aria-label="Delete conversation"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </motion.button>
  );
}
