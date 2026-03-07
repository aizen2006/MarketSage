"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { Conversation, Message } from "../types/chat";
import { loadConversations, saveConversations } from "../lib/storage";
import {
  mockSendMessage,
  fetchConversationTitle,
  createConversationApi,
  updateConversationTitleApi,
} from "../lib/mockApi";

type ConversationsState = {
  conversations: Conversation[];
  messagesById: Record<string, Message[]>;
  activeId: string | null;
};

const EMPTY_STATE: ConversationsState = {
  conversations: [],
  messagesById: {},
  activeId: null,
};

export type ChatMode = "quick" | "deep" | "auto";

export function useChatState() {
  const [state, setState] = useState<ConversationsState>(EMPTY_STATE);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const stored = loadConversations<ConversationsState>();
    if (stored) {
      setState(stored);
      return;
    }

    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

    async function bootstrapFromBackend() {
      try {
        const res = await fetch(`${API_BASE}/user/conversations`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load conversations");
        const data = (await res.json()) as {
          conversations: Conversation[];
        };
        if (data.conversations && data.conversations.length) {
          const first = data.conversations[0];
          setState({
            conversations: data.conversations,
            messagesById: {},
            activeId: first.id,
          });
          return;
        }
      } catch {
        // fall back to local seed
      }

      const initialId = uuid();
      const initialConv: Conversation = {
        id: initialId,
        title: "New conversation",
        lastMessagePreview: "Start by asking about your portfolio…",
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
      };
      setState({
        conversations: [initialConv],
        messagesById: {
          [initialId]: [],
        },
        activeId: initialId,
      });
    }

    void bootstrapFromBackend();
  }, []);

  useEffect(() => {
    if (state.conversations.length) {
      saveConversations(state);
    }
  }, [state]);

  const activeConversation = useMemo(
    () =>
      state.activeId
        ? state.conversations.find((c) => c.id === state.activeId) ?? null
        : null,
    [state],
  );

  const activeMessages = useMemo(
    () => (state.activeId ? state.messagesById[state.activeId] ?? [] : []),
    [state],
  );

  const setActiveConversation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activeId: id,
      conversations: prev.conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c,
      ),
    }));
  }, []);

  const createConversation = useCallback(async () => {
    const created = await createConversationApi("New conversation");
    if (created) {
      setState((prev) => ({
        conversations: [
          {
            id: created.id,
            title: created.title,
            lastMessagePreview: created.lastMessagePreview,
            updatedAt: created.updatedAt,
            unreadCount: created.unreadCount,
          },
          ...prev.conversations,
        ],
        messagesById: {
          [created.id]: [],
          ...prev.messagesById,
        },
        activeId: created.id,
      }));
      return;
    }
    setState((prev) => {
      const id = uuid();
      const now = new Date().toISOString();
      const conv: Conversation = {
        id,
        title: "New conversation",
        lastMessagePreview: "Start by asking about your portfolio…",
        updatedAt: now,
        unreadCount: 0,
      };
      return {
        conversations: [conv, ...prev.conversations],
        messagesById: {
          [id]: [],
          ...prev.messagesById,
        },
        activeId: id,
      };
    });
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === id ? { ...c, title } : c,
      ),
    }));
    void updateConversationTitleApi(id, title);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setState((prev) => {
      const conversations = prev.conversations.filter((c) => c.id !== id);
      const { [id]: _removed, ...restMessages } = prev.messagesById;
      const activeId =
        prev.activeId === id
          ? conversations.length
            ? conversations[0].id
            : null
          : prev.activeId;
      return {
        conversations,
        messagesById: restMessages,
        activeId,
      };
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string, mode: ChatMode = "auto") => {
      if (!state.activeId || !content.trim()) return;
      const conversationId = state.activeId;
      const wasFirstMessage =
        (state.messagesById[conversationId] ?? []).length === 0;
      const now = new Date().toISOString();
      const userMessage: Message = {
        id: uuid(),
        conversationId,
        role: "user",
        content: content.trim(),
        createdAt: now,
        status: "sending",
      };

      setState((prev) => {
        const nextMessages = [...(prev.messagesById[conversationId] ?? []), userMessage];
        const conversations = prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessagePreview: userMessage.content,
                updatedAt: now,
              }
            : c,
        );
        return {
          conversations,
          messagesById: {
            ...prev.messagesById,
            [conversationId]: nextMessages,
          },
          activeId: prev.activeId,
        };
      });

      setIsTyping(true);

      try {
        const agentMessage = await mockSendMessage({
          conversationId,
          content,
          mode,
        });
        setState((prev) => {
          const current = prev.messagesById[conversationId] ?? [];
          const updatedUserMessageIndex = current.findIndex(
            (m) => m.id === userMessage.id,
          );
          const updatedMessages = [...current];
          if (updatedUserMessageIndex !== -1) {
            updatedMessages[updatedUserMessageIndex] = {
              ...userMessage,
              status: "sent",
            };
          }
          updatedMessages.push(agentMessage);
          const conversations = prev.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessagePreview: agentMessage.content,
                  updatedAt: agentMessage.createdAt,
                }
              : c,
          );
          return {
            conversations,
            messagesById: {
              ...prev.messagesById,
              [conversationId]: updatedMessages,
            },
            activeId: prev.activeId,
          };
        });
        if (wasFirstMessage) {
          const conv = state.conversations.find((c) => c.id === conversationId);
          if (conv?.title === "New conversation") {
            fetchConversationTitle(content.trim())
              .then((title) => {
                setState((prev) => ({
                  ...prev,
                  conversations: prev.conversations.map((c) =>
                    c.id === conversationId ? { ...c, title } : c,
                  ),
                }));
                void updateConversationTitleApi(conversationId, title);
              })
              .catch(() => {});
          }
        }
      } catch (error) {
        const backendMessage =
          error instanceof Error ? error.message : "Analysis failed.";
        console.error("sendMessage error", error);
        setState((prev) => {
          const current = prev.messagesById[conversationId] ?? [];
          const updated: Message[] = current.map((m): Message =>
            m.id === userMessage.id ? { ...m, status: "error" } : m,
          );
          const errorReply: Message = {
            id: "agent-error-" + Date.now(),
            conversationId,
            role: "agent",
            content: `Analysis failed: ${backendMessage}`,
            createdAt: new Date().toISOString(),
            status: "sent",
          };
          updated.push(errorReply);
          return {
            ...prev,
            messagesById: {
              ...prev.messagesById,
              [conversationId]: updated,
            },
          };
        });
      } finally {
        setIsTyping(false);
      }
    },
    [state.activeId],
  );

  return {
    conversations: state.conversations,
    activeConversation,
    activeMessages,
    activeId: state.activeId,
    isTyping,
    createConversation,
    renameConversation,
    deleteConversation,
    setActiveConversation,
    sendMessage,
  };
}

