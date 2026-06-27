"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Conversation } from "../types/chat";
import { buttonTap } from "../lib/motion";
import { Icon } from "./Icon";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onRename: (nextTitle: string) => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(conversation.title);
  const updatedAt = new Date(conversation.updatedAt);
  const timeLabel = updatedAt.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const submitRename = () => {
    const next = draftTitle.trim();
    if (next && next !== conversation.title) {
      onRename(next);
    }
    setIsEditing(false);
  };

  const cancelRename = () => {
    setDraftTitle(conversation.title);
    setIsEditing(false);
  };

  return (
    <motion.div
      className={`group relative flex w-full flex-col gap-1 rounded-md px-3 py-2.5 text-left transition-colors duration-200 ${
        isActive
          ? "border border-accent-soft bg-accent-tint text-accent-strong"
          : "border border-transparent text-fg-muted hover:bg-bg-subtle hover:text-fg"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft`}
      aria-current={isActive ? "page" : undefined}
      {...buttonTap}
    >
      <button
        type="button"
        className="flex w-full flex-col gap-1 text-left"
        onClick={onClick}
      >
        <div className="flex w-full items-center justify-between gap-2 pr-16">
          {isEditing ? (
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitRename();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelRename();
                }
              }}
              onBlur={submitRename}
              autoFocus
              className="h-6 w-full rounded-md border border-accent bg-bg-surface px-2 text-[13px] font-medium tracking-tight text-fg outline-none"
              aria-label="Conversation title"
            />
          ) : (
            <span className="truncate text-[13px] font-medium tracking-tight">
              {conversation.title}
            </span>
          )}
          <span className="shrink-0 text-[11px] text-fg-soft font-mono">
            {timeLabel}
          </span>
        </div>
        <p className="line-clamp-1 w-11/12 text-[12px] text-fg-soft">
          {conversation.lastMessagePreview}
        </p>
      </button>

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDraftTitle(conversation.title);
            setIsEditing(true);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-soft hover:bg-bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          aria-label="Rename conversation"
          title="Rename"
        >
          <Icon name="edit" className="text-[15px]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-soft hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
          aria-label="Delete conversation"
          title="Delete"
        >
          <Icon name="delete" className="text-[15px]" />
        </button>
      </div>
    </motion.div>
  );
}
