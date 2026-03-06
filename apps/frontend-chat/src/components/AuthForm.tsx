"use client";

import { useState, FormEvent } from "react";
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

  const title = mode === "signin" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "signin"
      ? "Sign in with your email to continue."
      : "You'll get 100 free credits to start.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px]"
        aria-labelledby="auth-title"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-sm font-bold text-fg-inverse">
            MS
          </div>
          <h1
            id="auth-title"
            className="text-2xl font-semibold tracking-tight text-fg"
          >
            {title}
          </h1>
          <p className="mt-3 text-[15px] text-fg-muted">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-10">
          <form className="flex flex-col items-stretch gap-6" onSubmit={handleSubmit} noValidate>
            {mode === "signup" && (
              <Input
                id="name"
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            )}

            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder={mode === "signin" ? "name@company.com" : "john@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
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
                placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
                className="h-11"
              />
            </div>

            {(localError || error) && (
              <div
                role="alert"
                className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2.5 text-[13px] text-danger"
              >
                {localError || error}
              </div>
            )}

            <div className="mt-2 w-full">
              <Button
                type="submit"
                size="lg"
                className="w-full flex justify-center rounded-xl text-[15px] font-medium h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg" />
                    <span>Please wait...</span>
                  </span>
                ) : (
                  <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
                )}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-[14px] text-fg-soft">
          {mode === "signin" ? (
            <>
              {"Don't have an account?"}{" "}
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
