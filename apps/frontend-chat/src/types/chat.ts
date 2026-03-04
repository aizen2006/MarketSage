export type Role = "user" | "agent";

export type MessageStatus = "sending" | "sent" | "error";

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: string;
  status: MessageStatus;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessagePreview: string;
  updatedAt: string;
  unreadCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

