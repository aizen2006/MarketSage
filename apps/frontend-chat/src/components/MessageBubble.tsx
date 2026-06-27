"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types/chat";
import { messageEnter } from "../lib/motion";
import { Icon } from "./Icon";

interface MessageBubbleProps {
  message: Message;
}

const ACTIONS = [
  { name: "content_copy", label: "Copy", hover: "hover:text-fg" },
  { name: "refresh", label: "Regenerate", hover: "hover:text-accent" },
  { name: "thumb_up", label: "Good response", hover: "hover:text-positive" },
  { name: "thumb_down", label: "Bad response", hover: "hover:text-danger" },
  { name: "volume_up", label: "Read aloud", hover: "hover:text-fg" },
] as const;

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.role === "agent";
  const [copied, setCopied] = useState(false);
  const timeLabel = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <motion.div
      className={`group flex w-full gap-3 text-sm overflow-hidden ${
        isAgent ? "justify-start" : "justify-end"
      }`}
      {...messageEnter}
    >
      {isAgent && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#F8A24A] text-white shadow-[0_4px_12px_rgba(242,106,31,0.3)]">
          <Icon name="auto_awesome" className="text-[17px]" />
        </div>
      )}

      <div
        className={`relative flex max-w-[88%] flex-col gap-1 ${
          isAgent ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`px-4 py-3 text-[15px] leading-relaxed ${
            isAgent
              ? "rounded-[16px_16px_16px_4px] border border-border-subtle bg-bg-surface text-fg"
              : "rounded-[16px_16px_4px_16px] border border-accent-soft bg-accent-tint text-fg"
          }`}
        >
          {isAgent ? (
            <div className="agent-markdown max-w-full overflow-hidden">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {isAgent ? (
          <div className="flex items-center gap-0.5 pl-1 text-fg-soft opacity-0 transition-opacity group-hover:opacity-100">
            {ACTIONS.map((action) => (
              <button
                key={action.name}
                type="button"
                aria-label={action.label}
                onClick={action.name === "content_copy" ? handleCopy : undefined}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-bg-subtle ${action.hover}`}
              >
                <Icon
                  name={
                    action.name === "content_copy" && copied
                      ? "check"
                      : action.name
                  }
                  className="text-[17px]"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-row-reverse items-center gap-2 pr-1 text-[11px] text-fg-soft opacity-0 transition-opacity group-hover:opacity-100">
            <span>{timeLabel}</span>
            {message.status && (
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
        )}
      </div>

      {!isAgent && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-subtle text-[11px] font-bold text-fg-muted">
          YOU
        </div>
      )}
    </motion.div>
  );
}
