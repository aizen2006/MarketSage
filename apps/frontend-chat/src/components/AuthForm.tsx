"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

type Mode = "signin" | "signup";

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signin, signup, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
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
      await signin({ email, password, remember });
    } else {
      await signup({ name, email, password, remember });
    }
  }

  const title = mode === "signin" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "signin"
      ? "Sign in to continue your portfolio analysis."
      : "Sign up to start chatting with your finance agent.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl border border-subtle bg-bg-elevated p-8 shadow-soft"
        aria-labelledby="auth-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              id="auth-title"
              className="text-xl font-semibold text-fg tracking-tight"
            >
              {title}
            </h1>
            <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-bg-subtle px-3 py-1 text-xs text-fg-soft">
            <span className="inline-block h-6 w-6 rounded-full bg-accent-soft" />
            <span>FinanceAI</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <FloatingInput
              id="name"
              label="Full name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={setName}
            />
          )}

          <FloatingInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
          />

          <FloatingInput
            id="password"
            label="Password"
            type="password"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            value={password}
            onChange={setPassword}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-subtle bg-bg-subtle text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-fg-muted">Remember me on this device</span>
            </label>
            {mode === "signin" && (
              <button
                type="button"
                className="text-xs font-medium text-accent hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Forgot?
              </button>
            )}
          </div>

          {(localError || error) && (
            <div
              role="alert"
              className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger"
            >
              {localError || error}
            </div>
          )}

          <motion.button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:shadow-none"
            whileTap={{ scale: 0.98 }}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-soft border-t-white" />
                <span>Signing {mode === "signin" ? "in" : "up"}…</span>
              </span>
            ) : (
              <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
            )}
          </motion.button>

          <div className="relative py-2 text-center text-xs text-fg-soft">
            <span className="px-2">or continue with</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            {["Google", "Apple", "Microsoft"].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex items-center justify-center gap-1 rounded-xl border border-subtle bg-bg-subtle px-2 py-2 text-fg-muted shadow-sm transition hover:border-accent/50 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span className="h-4 w-4 rounded-full bg-bg-elevated" />
                <span>{provider}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-fg-soft">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-accent hover:text-accent-strong"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-accent hover:text-accent-strong"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </motion.div>
    </div>
  );
}

interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
}

function FloatingInput({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
}: FloatingInputProps) {
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className="peer h-11 w-full rounded-xl border border-subtle bg-bg-subtle px-3 pt-5 text-sm text-fg shadow-inner outline-none transition focus:border-accent focus:bg-bg-elevated peer-not-placeholder-shown:text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1.5 text-xs text-fg-soft transition-all peer-focus:text-accent peer-focus:brightness-110"
      >
        {label}
      </label>
      {!hasValue && (
        <span className="sr-only">
          {label} input. This field is required to continue.
        </span>
      )}
    </div>
  );
}

