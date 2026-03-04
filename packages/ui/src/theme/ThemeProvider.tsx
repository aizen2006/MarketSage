"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

function getPreferredTheme(
  storageKey: string,
  defaultTheme: Theme,
  enableSystem: boolean,
): Theme {
  if (typeof window === "undefined") return defaultTheme;
  const stored = window.localStorage.getItem(storageKey) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  if (enableSystem) {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
      .matches;
    return prefersDark ? "dark" : "light";
  }
  return defaultTheme;
}

export function ThemeProvider({
  children,
  storageKey = "financeai-theme",
  defaultTheme = "light",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const initial = getPreferredTheme(storageKey, defaultTheme, enableSystem);
    setThemeState(initial);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
  }, [storageKey, defaultTheme, enableSystem]);

  const applyTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, next);
      }
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, next);
      }
      return next;
    });
  }, [storageKey]);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme: applyTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

