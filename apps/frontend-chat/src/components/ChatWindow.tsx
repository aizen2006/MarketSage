\"use client\";

import { motion } from "motion/react";
import type { Message, Conversation } from "../types/chat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

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
    <section className="flex h-full flex-1 flex-col bg-bg">
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-6 md:px-8 md:pt-8 scrollbar-hide">
        {!hasMessages && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-fg text-[16px] font-bold text-bg shadow-sm">
                FA
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-fg">
                How can I help you today?
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-3 text-[13px] font-medium max-w-2xl"
            >
              {[
                "Summarize my portfolio",
                "Check today's risk level",
                "Spot unusual market moves",
                "Calculate P&L for AAPL",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-xl border border-border-subtle bg-bg-elevated px-4 py-2 text-fg-soft shadow-sm transition hover:border-border-strong hover:text-fg hover:shadow"
                >
                  {label}
                </button>
              ))}
            </motion.div>
          </div>
        )}

        {hasMessages && (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="mt-2 flex justify-start pl-12">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-end px-4 pb-6 md:px-8 w-full max-w-4xl mx-auto">
        {children}
        <p className="mt-3 text-[11px] text-fg-muted">
          MarketSage AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </section>
  );
}
