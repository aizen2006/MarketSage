const CONVERSATIONS_KEY = "financeai-conversations";
const THEME_KEY = "financeai-theme";
const AUTH_KEY = "financeai-auth";

export type StoredAuth = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
};

export function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadConversations<T>(): T | null {
  if (typeof window === "undefined") return null;
  return safeParse<T>(window.localStorage.getItem(CONVERSATIONS_KEY));
}

export function saveConversations<T>(value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(value));
}

export function loadTheme(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(THEME_KEY);
}

export function saveTheme(theme: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function loadAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredAuth>(window.localStorage.getItem(AUTH_KEY));
}

export function saveAuth(auth: StoredAuth) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

