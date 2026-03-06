"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Button, Card, IconButton, Skeleton } from "@repo/ui";
import { useAuth } from "../../context/AuthContext";
import {
  ApiKey,
  createApiKey,
  fetchApiKeys,
  toggleApiKey,
} from "../../lib/apiKeys";

type TabId = "curl" | "javascript" | "python";

const API_BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_BACKEND_URL ??
  "https://marketsage-eklj.onrender.com";

function maskKey(key: string) {
  if (!key) return "";
  const prefix = "sk-or-v1-";
  const clean = key.startsWith(prefix) ? key.slice(prefix.length) : key;
  const last4 = clean.slice(-4);
  return `${prefix}****${clean.length > 4 ? "…" : ""}${last4}`;
}

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

function buildCurlSnippet(key: string) {
  return `curl -X POST "${API_BACKEND_BASE}/v1/agents/quick" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${key || "sk-or-v1-your-key"}" \\
  -d '{
    "prompt": "Summarize AAPL earnings"
  }'`;
}

function buildJavascriptSnippet(key: string) {
  return `const res = await fetch("${API_BACKEND_BASE}/v1/agents/quick", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${key || "sk-or-v1-your-key"}",
  },
  body: JSON.stringify({
    prompt: "Summarize AAPL earnings",
  }),
});

const data = await res.json();
console.log(data);`;
}

function buildPythonSnippet(key: string) {
  return `import requests

resp = requests.post(
    "${API_BACKEND_BASE}/v1/agents/quick",
    headers={
        "Content-Type": "application/json",
        "x-api-key": "${key || "sk-or-v1-your-key"}",
    },
    json={"prompt": "Summarize AAPL earnings"},
)
print(resp.json())`;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedBanner, setCopiedBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("curl");
  const [snippetKey, setSnippetKey] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchApiKeys();
        if (mounted) {
          setKeys(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load API keys.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateKey = async () => {
    try {
      setCreating(true);
      setError(null);
      const key = await createApiKey();
      setKeys((prev) => [key, ...prev]);
      setNewKey(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleKey = async (key: ApiKey) => {
    const nextDisabled = !key.disabled;
    setKeys((prev) =>
      prev.map((k) =>
        k.id === key.id ? { ...k, disabled: nextDisabled } : k,
      ),
    );
    try {
      await toggleApiKey(key.id, nextDisabled);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update API key.");
      setKeys((prev) =>
        prev.map((k) => (k.id === key.id ? { ...k, disabled: key.disabled } : k)),
      );
    }
  };

  const handleCopyMasked = async (key: ApiKey) => {
    await copyToClipboard(maskKey(key.apikey));
    setCopiedKeyId(key.id);
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  const handleUseInExamples = (key: ApiKey) => {
    setSnippetKey(key.apikey);
    setActiveTab("curl");
  };

  const handleCopyNewKey = async () => {
    if (!newKey) return;
    await copyToClipboard(newKey.apikey);
    setCopiedBanner(true);
    setTimeout(() => setCopiedBanner(false), 1500);
  };

  const hasKeys = keys.length > 0;

  const snippet = useMemo(() => {
    const fullKey = snippetKey ?? "sk-or-v1-your-key";
    switch (activeTab) {
      case "javascript":
        return buildJavascriptSnippet(fullKey);
      case "python":
        return buildPythonSnippet(fullKey);
      case "curl":
      default:
        return buildCurlSnippet(fullKey);
    }
  }, [activeTab, snippetKey]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg text-fg">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => router.push("/chat")}
                className="inline-flex w-fit items-center gap-1 rounded-full border border-transparent bg-bg-subtle/60 px-3 py-1 text-[11px] font-medium text-fg-soft shadow-sm transition-all hover:border-border-subtle hover:bg-bg hover:text-fg"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to chat
              </button>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-fg">
                  API keys
                </h1>
                <span className="rounded-full bg-bg-subtle px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fg-soft">
                  Beta
                </span>
              </div>
              <p className="max-w-xl text-sm text-fg-soft">
                Create and manage keys for programmatic access to your MarketSage
                agents from scripts, dashboards, and backend services.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="flex items-center gap-3"
            >
              {user?.email && (
                <div className="hidden items-center gap-2 rounded-full border border-border-subtle bg-bg-subtle/60 px-3 py-1 text-[11px] text-fg-soft md:flex">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                    {user.email.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateKey}
                disabled={creating}
                className=""
              >
                {creating ? "Creating…" : "Create API key"}
              </Button>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-200 backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.25 }}
              className="space-y-4"
            >
              {/* New key banner */}
              <AnimatePresence>
                {newKey && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border border-primary/40 bg-primary/10">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-fg">
                            New API key created
                          </p>
                          <p className="text-xs text-fg-soft">
                            This value is shown{" "}
                            <span className="font-semibold">only once</span>. Copy
                            it now and store it in your secrets manager.
                          </p>
                          <div className="mt-2 flex items-center gap-2 rounded-md bg-bg px-2 py-1.5 text-xs font-mono text-fg">
                            <span className="truncate">{newKey.apikey}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCopyNewKey}
                          >
                            {copiedBanner ? "Copied!" : "Copy key"}
                          </Button>
                          <button
                            type="button"
                            onClick={() => setNewKey(null)}
                            className="text-[11px] text-fg-soft hover:text-fg transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Keys list */}
              <Card className="border border-border-subtle/80 bg-bg/80 backdrop-blur-sm">
                <div className="flex items-start justify-between border-b border-border-subtle/80 pb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-fg">Your keys</h2>
                    <p className="mt-1.5 text-[11px] text-fg-soft">
                      Rotate keys regularly and disable any that are no longer in
                      use.
                    </p>
                  </div>
                  {hasKeys && (
                    <span className="rounded-full bg-bg-subtle px-2 py-0.5 text-[10px] font-medium text-fg-soft">
                      {keys.length} key{keys.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-3"
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : !hasKeys ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <p className="text-sm font-medium text-fg">
                      You don&apos;t have any API keys yet.
                    </p>
                    <p className="max-w-sm text-xs text-fg-soft">
                      Create a key to call your MarketSage agents directly from
                      scripts, notebooks, and backend jobs.
                    </p>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleCreateKey}
                      disabled={creating}
                    >
                      {creating ? "Creating…" : "Create your first key"}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {keys.map((key, index) => (
                      <motion.div
                        key={key.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + index * 0.02, duration: 0.18 }}
                        whileHover={{ y: -1 }}
                        className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-3 text-xs transition-colors hover:border-border-strong sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-fg truncate">
                              {maskKey(key.apikey)}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                key.disabled
                                  ? "bg-bg-elevated text-fg-soft border border-border-subtle"
                                  : "bg-accent/15 text-accent border border-accent/40"
                              }`}
                            >
                              {key.disabled ? "Disabled" : "Active"}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-fg-soft">
                            Created {formatDate((key as any).createdAt ?? null)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleUseInExamples(key)}
                            className="h-7 px-2.5 text-[11px] whitespace-nowrap"
                          >
                            Use in examples
                          </Button>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            onClick={() => handleCopyMasked(key)}
                            aria-label="Copy masked key"
                            className="h-7 w-7"
                          >
                            {copiedKeyId === key.id ? (
                              <span className="text-[10px] font-medium">
                                Copied
                              </span>
                            ) : (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </IconButton>
                          <Button
                            size="xs"
                            variant={key.disabled ? "secondary" : "ghost"}
                            onClick={() => handleToggleKey(key)}
                            className="h-7 min-w-16 px-2.5 text-[11px]"
                          >
                            {key.disabled ? "Enable" : "Disable"}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* API reference panel */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.25 }}
            >
              <Card className="space-y-4 border border-border-subtle/80 bg-bg/80 backdrop-blur-sm">
                <div className="flex flex-col gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-fg">
                      API reference
                    </h2>
                    <p className="text-xs text-fg-soft">
                      Call your agents securely using the key from this page.
                    </p>
                  </div>
                  <span className="inline-flex w-fit max-w-full items-center rounded-full border border-border-subtle bg-bg-subtle px-3 py-1 text-[10px] font-mono text-fg-soft">
                    {API_BACKEND_BASE}
                  </span>
                </div>

                <div>
                  <div className="mb-3 inline-flex rounded-full border border-border-subtle bg-bg-subtle p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("curl")}
                      className={`rounded-full px-3 py-1 transition-colors ${
                        activeTab === "curl"
                          ? "bg-bg text-fg font-medium shadow-sm"
                          : "text-fg-soft hover:text-fg"
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("javascript")}
                      className={`rounded-full px-3 py-1 transition-colors ${
                        activeTab === "javascript"
                          ? "bg-bg text-fg font-medium shadow-sm"
                          : "text-fg-soft hover:text-fg"
                      }`}
                    >
                      JavaScript
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("python")}
                      className={`rounded-full px-3 py-1 transition-colors ${
                        activeTab === "python"
                          ? "bg-bg text-fg font-medium shadow-sm"
                          : "text-fg-soft hover:text-fg"
                      }`}
                    >
                      Python
                    </button>
                  </div>
                  <motion.pre
                    key={activeTab}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="max-h-88 overflow-x-auto overflow-y-auto rounded-lg border border-border-subtle bg-bg-subtle p-4 text-[12px] leading-6 font-mono text-fg shadow-sm"
                  >
                    {snippet}
                  </motion.pre>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

