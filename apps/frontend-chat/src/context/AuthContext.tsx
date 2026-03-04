"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "../types/chat";
import { clearAuth, loadAuth, saveAuth, type StoredAuth } from "../lib/storage";
import { mockSignIn, mockSignUp } from "../lib/mockApi";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signin: (input: {
    email: string;
    password: string;
    remember?: boolean;
  }) => Promise<void>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    remember?: boolean;
  }) => Promise<void>;
  signout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = loadAuth();
    if (stored) {
      setUser(stored.user as StoredAuth["user"]);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = useCallback(
    (auth: StoredAuth) => {
      setUser(auth.user);
      setToken(auth.token);
      saveAuth(auth);
      if (pathname !== "/chat") {
        router.push("/chat");
      }
    },
    [pathname, router],
  );

  const signin = useCallback<AuthContextValue["signin"]>(
    async ({ email, password, remember }) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mockSignIn({ email, password, remember });
        handleAuthSuccess(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to sign in right now.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess],
  );

  const signup = useCallback<AuthContextValue["signup"]>(
    async ({ name, email, password, remember }) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mockSignUp({ name, email, password, remember });
        handleAuthSuccess(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to sign up right now.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess],
  );

  const signout = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
    router.push("/signin");
  }, [router]);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      error,
      signin,
      signup,
      signout,
    }),
    [user, token, isLoading, error, signin, signup, signout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

