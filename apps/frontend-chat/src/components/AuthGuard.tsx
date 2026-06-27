"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [isLoading, user, router]);

  if (isLoading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface px-6 py-4 text-sm text-fg-muted shadow-soft">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-soft border-t-accent" />
          Checking your session…
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

