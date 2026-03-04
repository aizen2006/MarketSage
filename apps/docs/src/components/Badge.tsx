import type { ReactNode } from "react";

type Variant = "get" | "post" | "put" | "delete" | "danger" | "neutral";

const variantClasses: Record<Variant, string> = {
  get: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  post: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  put: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  delete: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
  neutral:
    "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200",
};

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

