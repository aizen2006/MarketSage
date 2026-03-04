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
      className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-xs transition ${
        isActive
          ? "border-accent bg-accent-soft text-fg"
          : "border-subtle bg-bg-elevated hover:border-accent/60"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      {...buttonTap}
    >
      <div className="mt-1 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[0.78rem] font-medium">
            {conversation.title}
          </span>
          <span className="shrink-0 text-[0.7rem] text-fg-soft">
            {timeLabel}
          </span>
        </div>
        <p className="line-clamp-2 text-[0.72rem] text-fg-muted">
          {conversation.lastMessagePreview}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {conversation.unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex min-w-[1.4rem] justify-center rounded-full bg-accent text-[0.65rem] font-semibold text-white"
          >
            {conversation.unreadCount}
          </motion.span>
        )}
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
            className="rounded-full bg-bg-subtle px-1.5 py-0.5 text-[0.65rem] text-fg-soft hover:text-fg"
            aria-label="Rename conversation"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-full bg-bg-subtle px-1.5 py-0.5 text-[0.65rem] text-danger hover:bg-danger/10"
            aria-label="Delete conversation"
          >
            Del
          </button>
        </div>
      </div>
    </motion.button>
  );
}

