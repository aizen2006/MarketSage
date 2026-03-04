const LANDING_GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/your-org/marketsage";

const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL ?? "http://localhost:3000/chat";

const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-3 text-fg">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-fg text-[9px] font-bold text-bg">
            FA
          </div>
          <span className="text-[13px] font-semibold tracking-tight">MarketSage © {year}</span>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href={CHAT_URL}
            className="text-[13px] text-fg-muted transition-colors hover:text-fg"
          >
            Chat App
          </a>
          <a
            href={DOCS_URL}
            className="text-[13px] text-fg-muted transition-colors hover:text-fg"
          >
            API Documentation
          </a>
          <a
            href={LANDING_GITHUB_URL}
            className="text-[13px] text-fg-muted transition-colors hover:text-fg"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
