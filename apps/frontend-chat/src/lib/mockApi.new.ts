import type { Message, User } from "../types/chat";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
  remember?: boolean;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function handleJsonResponse(res: Response) {
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors
  }
  if (!res.ok) {
    const message =
      data?.message ||
      `Request failed with status ${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

/** Normalize line breaks so markdown paragraphs and lists render correctly. */
function normalizeReplyText(text: string): string {
  if (!text || typeof text !== "string") return text;
  let out = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (out.length > 200 && !out.includes("\n\n")) {
    out = out.replace(/\n/g, "\n\n");
  }
  return out;
}

function makeUserFromEmail(email: string, name?: string): User {
  const baseName = name || email.split("@")[0] || "User";
  return {
    id: email,
    name: baseName,
    email,
  };
}

export async function mockSignIn(payload: AuthPayload) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
    credentials: "include",
  });

  await handleJsonResponse(res);

  return {
    token: "cookie",
    user: makeUserFromEmail(payload.email, payload.name),
  };
}

export async function mockSignUp(payload: AuthPayload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
    credentials: "include",
  });

  await handleJsonResponse(res);

  return {
    token: "cookie",
    user: makeUserFromEmail(payload.email, payload.name),
  };
}

/** Agent error with optional backend code for UI. */
export class AgentError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "AgentError";
    this.code = code;
  }
}

async function fetchAgentReply(
  mode: "quick" | "deep" | "auto",
  message: string,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/agents/${mode}/json`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Network request failed";
    throw new AgentError(
      `Could not reach backend (${API_BASE}). Check backend server/CORS. ${details}`,
      "NETWORK_ERROR",
    );
  }

  let data: { response?: string; error?: { code?: string; message?: string } } | null = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const msg =
      data?.error?.message ??
      `Request failed with status ${res.status} ${res.statusText}`;
    throw new AgentError(msg, data?.error?.code);
  }

  if (data?.error?.message) {
    throw new AgentError(data.error.message, data.error.code);
  }

  const raw = data?.response;
  if (raw != null && typeof raw === "string") {
    return raw;
  }

  return "No response received from agent.";
}

/** Fetch a short AI-generated conversation title from the first user message. */
export async function fetchConversationTitle(firstMessage: string): Promise<string> {
  const res = await fetch(`${API_BASE}/agents/title`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: firstMessage }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message ?? "Title generation failed";
    throw new Error(msg);
  }
  return typeof data?.title === "string" ? data.title.trim().slice(0, 80) : "New conversation";
}

export async function createConversationApi(title: string = "New conversation"): Promise<{
  id: string;
  title: string;
  lastMessagePreview: string;
  updatedAt: string;
  unreadCount: number;
} | null> {
  try {
    const res = await fetch(`${API_BASE}/user/conversations`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateConversationTitleApi(
  conversationId: string,
  title: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/user/conversations/${conversationId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function mockSendMessage(params: {
  conversationId: string;
  content: string;
  mode?: "quick" | "deep" | "auto";
}): Promise<Message> {
  const { conversationId, content, mode = "auto" } = params;
  const rawReply = await fetchAgentReply(mode, content);
  const reply = normalizeReplyText(rawReply);

  const now = new Date().toISOString();

  return {
    id: "agent-" + Date.now().toString(36),
    conversationId,
    role: "agent",
    content: reply,
    createdAt: now,
    status: "sent",
    isStreaming: false,
  };
}

