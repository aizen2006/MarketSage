export default function ChangelogPage() {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Changelog
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-fg-muted sm:text-base">
        High-level notes on changes to the MarketSage API. This is a preview
        stub you can extend as you ship versions.
      </p>

      <section className="mt-6 space-y-4 text-xs text-fg-muted sm:text-sm">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-fg-soft">
            Unreleased
          </div>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Initial public documentation for Quick, Deep, and Auto agents.</li>
            <li>Added streaming endpoints to all agent modes.</li>
            <li>Documented error codes and credit-based billing.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

