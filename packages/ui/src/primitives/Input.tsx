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
  const inputId = id ?? (typeof label === "string" ? label.toLowerCase() : undefined);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-fg-soft"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={`h-9 w-full rounded-xl border border-subtle bg-bg-subtle px-3 text-sm text-fg placeholder:text-fg-soft focus:border-accent focus:outline-none ${className}`}
      />
      {error && (
        <p className="text-[0.7rem] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

