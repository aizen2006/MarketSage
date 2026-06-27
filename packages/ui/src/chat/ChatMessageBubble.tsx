 "use client";

import { motion } from "motion/react";
import { messageEnter } from "../motion/presets";

export type ChatMessageStatus = "sending" | "sent" | "error";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  createdAt: string;
  status: ChatMessageStatus;
}

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isAgent = message.role === "agent";
  const timeLabel = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      className={`flex w-full gap-2 text-sm ${
        isAgent ? "justify-start" : "justify-end"
      }`}
      {...messageEnter}
    >
      {isAgent && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#F8A24A] text-white shadow-[0_4px_12px_rgba(242,106,31,0.3)]">
          <span className="material-symbols-rounded text-[17px]">
            auto_awesome
          </span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 text-sm ${
          isAgent
            ? "rounded-[16px_16px_16px_4px] border border-border-subtle bg-bg-surface text-fg"
            : "rounded-[16px_16px_4px_16px] border border-accent-soft bg-accent-tint text-fg"
        }`}
      >
        <p className="whitespace-pre-wrap text-[0.85rem] leading-relaxed">
          {message.content}
        </p>
        <div className="mt-1 flex items-center justify-between gap-3 text-[0.7rem] text-fg-soft">
          <span>{timeLabel}</span>
          <span>
            {message.status === "sending" && "Sending…"}
            {message.status === "sent" && "Sent ✓"}
            {message.status === "error" && (
              <span className="text-danger">Failed • tap to retry</span>
            )}
          </span>
        </div>
      </div>
      {!isAgent && (
        <div className="mt-1 h-8 w-8 rounded-full bg-bg-subtle text-[0.7rem] font-semibold text-fg-muted">
          <span className="flex h-full items-center justify-center">You</span>
        </div>
      )}
    </motion.div>
  );
}

