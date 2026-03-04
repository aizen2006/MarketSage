import type { ReactNode } from "react";

type Tone = "info" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  info: "border-sky-200/80 bg-sky-50/40 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100",
  warning:
    "border-amber-200/80 bg-amber-50/40 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100",
  danger:
    "border-rose-200/80 bg-rose-50/40 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100",
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mt-4 rounded-xl border px-3.5 py-3 text-xs sm:text-sm ${toneClasses[tone]}`}
    >
      {title ? (
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide">
          {title}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
}

