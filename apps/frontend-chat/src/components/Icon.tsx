import type { CSSProperties } from "react";

interface IconProps {
  /** Material Symbols Rounded ligature name, e.g. "auto_awesome" */
  name: string;
  className?: string;
  /** Optical size in px (drives font-size); defaults to inherit via className */
  size?: number;
  filled?: boolean;
  style?: CSSProperties;
}

/**
 * Thin wrapper over Material Symbols Rounded (loaded in layout.tsx).
 * Replaces inline SVGs across the Ember-redesigned app.
 */
export function Icon({ name, className = "", size, filled, style }: IconProps) {
  return (
    <span
      aria-hidden
      className={`material-symbols-rounded ${className}`}
      style={{
        ...(size ? { fontSize: size } : null),
        ...(filled ? { fontVariationSettings: '"FILL" 1' } : null),
        ...style,
      }}
    >
      {name}
    </span>
  );
}
