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
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3 md:px-6 md:pt-4">
        {!hasMessages && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-2xl bg-bg-elevated px-5 py-3 text-xs text-fg-soft shadow-soft">
              <p className="text-[0.8rem] font-medium text-fg">
                What’s on your mind today?
              </p>
              <p className="mt-1">
                Ask about volatility, P&L, or rebalancing and your finance
                agent will run the numbers.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-[0.75rem] text-fg-soft">
              {[
                "Summarize my portfolio",
                "Check today’s risk level",
                "Spot unusual moves",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-subtle bg-bg-elevated px-3 py-1"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasMessages && (
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="mt-1 flex justify-start">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className={`flex flex-col items-center px-3 pb-4 md:px-6 ${
          !hasMessages ? "justify-center" : "justify-end"
        }`}
      >
        {children}
        <p className="mt-2 text-[0.68rem] text-fg-soft">
          Encrypted end-to-end financial intelligence.
        </p>
      </div>
    </section>
  );
}

