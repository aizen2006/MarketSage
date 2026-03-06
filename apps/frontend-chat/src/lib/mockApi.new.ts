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

async function fetchAgentReply(
  mode: "quick" | "deep" | "auto",
  message: string,
): Promise<string> {
  const res = await fetch(
    `${API_BASE}/agents/${mode}?message=${encodeURIComponent(message)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "text/event-stream",
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const data = JSON.parse(text);
      message = data?.message ?? res.statusText;
    } catch {
      message = `Request failed with status ${res.status} ${res.statusText}`;
    }
    throw new Error(message);
  }

  if (!res.body) {
    return "";
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
  }

  const allLines = full.split("\n").map((l) => l.trim());
  for (let i = 0; i < allLines.length; i++) {
    if (allLines[i] === "event: error" && i + 1 < allLines.length) {
      const dataLine = allLines[i + 1];
      if (dataLine.startsWith("data:")) {
        const raw = dataLine.replace(/^data:\s*/, "").trim();
        try {
          const data = JSON.parse(raw) as { message?: string };
          throw new Error(data?.message ?? "Agent error");
        } catch (e) {
          if (e instanceof Error && e.name !== "SyntaxError") throw e;
          throw new Error("Agent error");
        }
      }
    }
  }

  const lines = allLines.filter((l) => l.startsWith("data:"));

  const text = lines
    .map((l) => l.replace(/^data:\s*/, ""))
    .join("");

  if (!text) {
    return "No response received from agent.";
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      if ("message" in parsed && !("response" in parsed)) {
        throw new Error(String((parsed as { message: unknown }).message));
      }
      if ("response" in parsed) {
        return String((parsed as { response: unknown }).response);
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message !== text) throw e;
  }

  return text;
}

export async function mockSendMessage(params: {
  conversationId: string;
  content: string;
  mode?: "quick" | "deep" | "auto";
}): Promise<Message> {
  const { conversationId, content, mode = "auto" } = params;
  const reply = await fetchAgentReply(mode, content);

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

