import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-fg-muted"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={`h-10 w-full rounded-md border border-border-subtle bg-bg-surface px-3.5 text-sm text-fg shadow-soft transition-colors placeholder:text-fg-soft hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
      {error && (
        <p className="text-xs text-danger mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
