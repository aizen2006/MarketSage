"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Input, Button } from "@repo/ui";

type Mode = "signin" | "signup";

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signin, signup, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(null);
  }, [mode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      setLocalError("Please fill in all required fields.");
      return;
    }
    setLocalError(null);

    if (mode === "signin") {
      await signin({ email, password, remember: true });
    } else {
      await signup({ name, email, password, remember: true });
    }
  }

  const title = mode === "signin" ? "Log in to MarketSage" : "Create your account";
  const subtitle =
    mode === "signin"
      ? "Welcome back. Enter your details to continue."
      : "Start chatting with your finance agent today.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px]"
        aria-labelledby="auth-title"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-fg text-sm font-bold text-bg shadow-sm">
            FA
          </div>
          <h1
            id="auth-title"
            className="text-2xl font-semibold tracking-tight text-fg"
          >
            {title}
          </h1>
          <p className="mt-2 text-[15px] text-fg-soft">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {mode === "signup" && (
              <Input
                id="name"
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                id="password"
                label={
                  <div className="flex w-full items-center justify-between">
                    <span>Password</span>
                    {mode === "signin" && (
                      <button
                        type="button"
                        className="text-[13px] font-medium text-fg-muted hover:text-fg transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                }
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {(localError || error) && (
              <div
                role="alert"
                className="mt-2 rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger"
              >
                {localError || error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full text-[15px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg" />
                  <span>Please wait...</span>
                </span>
              ) : (
                <span>{mode === "signin" ? "Log in" : "Sign up"}</span>
              )}
            </Button>
          </form>

          <div className="relative my-6 text-center text-[13px]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <span className="relative bg-bg-elevated px-4 text-fg-soft">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "GitHub"].map((provider) => (
              <Button
                key={provider}
                type="button"
                variant="outline"
                className="w-full text-[13px]"
              >
                {provider}
              </Button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[14px] text-fg-soft">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-fg hover:underline transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-fg hover:underline transition-colors"
              >
                Log in
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
