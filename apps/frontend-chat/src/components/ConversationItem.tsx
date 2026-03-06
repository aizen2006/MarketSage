"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Conversation } from "../types/chat";
import { buttonTap } from "../lib/motion";

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
      className={`group relative flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 ${
        isActive
          ? "bg-bg-elevated text-fg"
          : "text-fg-muted hover:bg-bg-elevated hover:text-fg"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong`}
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
              className="h-6 w-full rounded-md border border-border-strong bg-bg px-2 text-[13px] font-medium tracking-tight text-fg outline-none"
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
    </motion.div>
  );
}
