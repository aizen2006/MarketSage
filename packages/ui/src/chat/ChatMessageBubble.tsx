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
        <div className="mt-1 h-7 w-7 rounded-full bg-accent-soft text-[0.7rem] font-semibold text-accent-strong shadow-soft">
          <span className="flex h-full items-center justify-center">AI</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
          isAgent
            ? "border border-subtle bg-bg-elevated text-fg"
            : "border border-accent bg-accent-soft text-fg"
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
        <div className="mt-1 h-7 w-7 rounded-full bg-bg-subtle text-[0.7rem] font-semibold text-fg-soft">
          <span className="flex h-full items-center justify-center">You</span>
        </div>
      )}
    </motion.div>
  );
}

