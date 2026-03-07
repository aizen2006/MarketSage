"use client";

import { useState } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { ChatWindow } from "../../components/ChatWindow";
import { Composer } from "../../components/Composer";
import { InsightsPanel } from "../../components/InsightsPanel";
import { CommandPalette, useCommandPalette } from "../../components/CommandPalette";
import { useChatState, type ChatMode } from "../../hooks/useChatState";

export default function ChatPage() {
  const {
    conversations,
    activeConversation,
    activeMessages,
    activeId,
    isTyping,
    createConversation,
    renameConversation,
    deleteConversation,
    setActiveConversation,
    sendMessage,
  } = useChatState();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [mode, setMode] = useState<ChatMode>("quick");
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette();

  return (
    <AuthGuard>
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onRunQuery={(q) => {
          if (activeConversation) sendMessage(q, mode);
        }}
      />
      <div className="flex h-screen flex-col overflow-hidden bg-bg text-fg md:flex-row">
        {/* Nav — collapsible on tablet/mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-bg-surface border-r border-border-subtle transition-transform duration-macro md:sticky md:top-0 md:h-screen md:self-start md:z-auto md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelectConversation={(id) => {
              setActiveConversation(id);
              setSidebarOpen(false);
            }}
            onCreateConversation={createConversation}
            onRenameConversation={renameConversation}
            onDeleteConversation={deleteConversation}
            onRunSuggestion={(text) => {
              if (activeConversation) sendMessage(text, mode);
            }}
          />
        </div>

        {/* Main + Insights */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            onToggleInsights={() => setInsightsOpen((o) => !o)}
            insightsOpen={insightsOpen}
            onOpenCommandPalette={() => setCommandOpen(true)}
            mode={mode}
            onModeChange={setMode}
          />
          <div className="flex flex-1 overflow-hidden">
            {/* Main chat area with data-mesh */}
            <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
              <ChatWindow
                activeConversation={activeConversation}
                messages={activeMessages}
                isTyping={isTyping}
              >
                <Composer
                  onSend={(content) => sendMessage(content, mode)}
                  disabled={!activeConversation}
                  isEmptyState={!activeMessages.length}
                />
              </ChatWindow>
            </main>

            {/* Insights panel — desktop 2/3-col, hidden on small screens unless toggled */}
            {insightsOpen && (
              <aside className="hidden w-full flex-shrink-0 border-l border-border-subtle bg-bg-surface md:block md:max-w-[360px] lg:w-[360px]">
                <InsightsPanel />
              </aside>
            )}
          </div>
        </div>

        {/* Mobile bottom action bar placeholder — quick actions */}
        <div className="flex items-center justify-center gap-2 border-t border-border-subtle bg-bg-surface px-4 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg px-3 py-2 text-xs font-medium text-fg-muted hover:bg-bg-subtle hover:text-fg"
          >
            Chats
          </button>
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-xs font-medium text-fg-muted hover:bg-bg-subtle hover:text-fg"
          >
            Insights
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
