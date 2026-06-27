"use client";

import { motion } from "motion/react";
import type { Message, Conversation } from "../types/chat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Icon } from "./Icon";
interface ChatWindowProps {
  activeConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  children?: React.ReactNode;
}

export function ChatWindow({
  activeConversation,
  messages,
  isTyping,
  children,
}: ChatWindowProps) {
  const hasMessages = messages.length > 0;

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-bg">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-6 md:px-6 md:pt-8 scrollbar-hide">
          {!hasMessages && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-[#F8A24A] text-white shadow-[0_8px_24px_rgba(242,106,31,0.32)]">
                  <Icon name="auto_awesome" className="text-[26px]" />
                </div>
                <h2 className="text-[28px] font-semibold tracking-tight text-fg">
                  Real-time signals,{" "}
                  <span className="font-serif italic font-normal text-accent">
                    human-ready
                  </span>{" "}
                  insights.
                </h2>
                <p className="mt-3 text-[15px] text-fg-muted max-w-md mx-auto">
                  Ask about a ticker, your portfolio, or today&apos;s market
                  moves to get started.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex flex-wrap justify-center gap-3 text-[13px] font-medium max-w-2xl"
              >
                {[
                  { label: "Summarize my portfolio", icon: "pie_chart" },
                  { label: "Check today's risk level", icon: "shield" },
                  { label: "Spot unusual market moves", icon: "trending_up" },
                  { label: "Calculate P&L for AAPL", icon: "calculate" },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-surface px-4 py-2 text-fg-muted shadow-soft transition-colors duration-150 hover:border-accent hover:bg-accent-tint hover:text-accent-strong"
                  >
                    <Icon name={icon} className="text-[17px] text-accent" />
                    {label}
                  </button>
                ))}
              </motion.div>
            </div>
          )}

        {hasMessages && (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-8">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
        </div>

        <div className="flex flex-col items-center justify-end px-4 pb-6 md:px-8 w-full max-w-4xl mx-auto">
          {children}
          <p className="mt-3 text-[11px] text-fg-muted">
            MarketSage AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </section>
  );
}
