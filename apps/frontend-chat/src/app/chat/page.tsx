"use client";

import { useState } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { ChatWindow } from "../../components/ChatWindow";
import { Composer } from "../../components/Composer";
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
  const [mode, setMode] = useState<ChatMode>("quick");

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col overflow-hidden bg-bg text-fg md:flex-row">
        <div
          className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-bg-subtle transition-transform md:sticky md:top-0 md:h-screen md:self-start md:z-auto md:translate-x-0 ${
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
          />
        </div>

        <div className="flex flex-1 flex-col">
          <Header
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            mode={mode}
            onModeChange={setMode}
          />
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
        </div>
      </div>
    </AuthGuard>
  );
}

