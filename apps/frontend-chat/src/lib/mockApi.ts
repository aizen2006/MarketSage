import type { Message, User } from "../types/chat";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
  remember?: boolean;
};

const DEMO_USER: User = {
  id: "demo-user",
  name: "Alex Thompson",
  email: "alex@example.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockSignIn(payload: AuthPayload) {
  await delay(700);
  if (!payload.email.includes("@") || payload.password.length < 6) {
    throw new Error("Invalid credentials. Check your email and password.");
  }
  return {
    token: "mock-token-" + Date.now().toString(36),
    user: DEMO_USER,
  };
}

export async function mockSignUp(payload: AuthPayload) {
  await delay(900);
  if (!payload.email.includes("@") || payload.password.length < 6) {
    throw new Error("Please provide a valid email and a password of at least 6 characters.");
  }
  return {
    token: "mock-token-" + Date.now().toString(36),
    user: {
      ...DEMO_USER,
      name: payload.name || DEMO_USER.name,
      email: payload.email,
    },
  };
}

export async function mockSendMessage(params: {
  conversationId: string;
  content: string;
}): Promise<Message> {
  await delay(1100);
  const { conversationId, content } = params;

  const trimmed = content.toLowerCase();
  let reply =
    "Here’s a quick view of your portfolio. Overall, your risk exposure is balanced and your cash buffer is healthy.";

  if (trimmed.includes("p&l") || trimmed.includes("pnl")) {
    reply =
      "Your realized P&L over the last 30 days is up 4.2%, driven mainly by BTC and ETH. The max drawdown was -1.3%.";
  } else if (trimmed.includes("volatility")) {
    reply =
      "24h realized volatility on your portfolio is slightly elevated vs. the 30-day average. Consider tightening stops on high-beta assets.";
  } else if (trimmed.includes("rebalance") || trimmed.includes("allocation")) {
    reply =
      "For a moderate risk profile, shifting 5–8% from high-volatility alts into BTC and short-duration treasuries could smooth your equity curve.";
  }

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

