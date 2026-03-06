/**
 * Tailwind theme extension for MarketSage design tokens.
 * Copy the theme.extend block into your tailwind.config.ts (or merge with existing extend).
 * Ensure your app’s globals.css imports packages/ui/src/tokens/tokens.css and maps
 * CSS variables in @theme inline.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-subtle": "var(--bg-subtle)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-soft": "var(--fg-soft)",
        "fg-inverse": "var(--fg-inverse)",
        primary: "var(--primary)",
        "primary-soft": "var(--primary-soft)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-strong": "var(--accent-strong)",
        highlight: "var(--highlight)",
        "highlight-soft": "var(--highlight-soft)",
        danger: "var(--danger)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      transitionDuration: {
        micro: "var(--motion-micro)",
        macro: "var(--motion-macro)",
      },
    },
  },
  darkMode: "class",
};
