import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/context/**/*.{ts,tsx,js,jsx}",
    "./src/hooks/**/*.{ts,tsx,js,jsx}",
    "./src/lib/**/*.{ts,tsx,js,jsx}",
  ],
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
        "accent-tint": "var(--accent-tint)",
        highlight: "var(--highlight)",
        "highlight-soft": "var(--highlight-soft)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        positive: "var(--positive)",
        "positive-soft": "var(--positive-soft)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
        overlay: "var(--shadow-overlay)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "1rem",
        "2xl": "1.25rem",
        pill: "var(--radius-pill)",
      },
      transitionDuration: {
        micro: "var(--motion-micro)",
        macro: "var(--motion-macro)",
      },
    },
  },
  darkMode: "class",
};

export default config;

