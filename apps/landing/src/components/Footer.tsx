const LANDING_GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/your-org/marketsage";

const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL ?? "http://localhost:3000/chat";

const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-border-subtle/80 bg-bg-subtle/40 py-6 text-xs text-fg-soft sm:text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-soft text-[11px] font-semibold text-accent-strong">
            MS
          </div>
          <span>© {year} MarketSage. All rights reserved.</span>
        </div>

        <nav className="flex items-center gap-4">
          <a
            href={CHAT_URL}
            className="transition-colors hover:text-fg"
          >
            Chat
          </a>
          <a
            href={DOCS_URL}
            className="transition-colors hover:text-fg"
          >
            API Docs
          </a>
          <a
            href={LANDING_GITHUB_URL}
            className="transition-colors hover:text-fg"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

