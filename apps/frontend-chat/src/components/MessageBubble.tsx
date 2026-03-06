"use client";

import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types/chat";
import { messageEnter } from "../lib/motion";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.role === "agent";
  const timeLabel = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      className={`group flex w-full gap-4 text-sm ${
        isAgent ? "justify-start" : "justify-end"
      }`}
      {...messageEnter}
    >
      {isAgent && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fg text-[11px] font-bold text-bg shadow-sm">
          FA
        </div>
      )}

      <div
        className={`relative flex max-w-[85%] flex-col gap-1 ${
          isAgent ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
            isAgent
              ? "bg-bg-elevated border border-border-subtle text-fg"
              : "bg-fg text-bg"
          }`}
        >
          {isAgent ? (
            <div className="agent-markdown max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        <div
          className={`flex items-center gap-2 text-[11px] text-fg-soft opacity-0 transition-opacity group-hover:opacity-100 ${
            isAgent ? "pl-1" : "pr-1 flex-row-reverse"
          }`}
        >
          <span>{timeLabel}</span>
          {message.status && !isAgent && (
            <>
              <span>&bull;</span>
              <span>
                {message.status === "sending" && "Sending..."}
                {message.status === "sent" && "Delivered"}
                {message.status === "error" && (
                  <span className="text-danger">Failed to send</span>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {!isAgent && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle text-[11px] font-bold text-fg-soft">
          YOU
        </div>
      )}
    </motion.div>
  );
}
