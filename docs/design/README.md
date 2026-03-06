# MarketSage Design System

Premium finance-agent UI: shared tokens, signature motif, motion, and accessibility.

## Signature motif

Two elements make the product recognizable:

1. **Data-mesh / flow-lines background** — Subtle animated SVG “circuit” lines behind content. Low opacity (6–12%), optional parallax on pointer move. Used on chat main area and insights panel. Respects `prefers-reduced-motion` (animation minimized).
2. **Asymmetric cut-corner cards** — Cards and panels use a diagonal clip (e.g. top-right notch) via `clip-path`, not only rounded corners. Used for Market Signal Cards and premium surfaces.

## Theme & palette

- **Dark base:** `#0B0F1A` (background)
- **Surface:** `#0F1724`
- **Primary (bold):** `#7C3AED` (deep violet) — branding, CTAs
- **Accent (electric):** `#22D3EE` (cyan) — data emphasis, confidence meters, sparklines
- **Highlight (warning/heat):** `#F97316` (orange)
- **Text high-contrast:** `#E6EEF8`
- **Muted text:** `#9AA7B8`

Tokens live in `packages/ui/src/tokens/tokens.css`. Apps import this file and map vars in `@theme inline` for Tailwind.

## Motion system

- **Micro:** `0.12s` — hover lift (scale 1.01 in Conservative variant), small feedback. CSS: `--motion-micro`.
- **Macro:** `0.28s`–`0.45s` — appear, panel open. CSS: `--motion-macro`, `--motion-macro-slow`.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out); elastic for confidence meter: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` sets durations to `0.01s` and disables pulse/flow animations where applied.

Presets: `packages/ui/src/motion/presets.ts` — `messageEnter`, `staggerContainer`, `staggerItem`, `hoverLift`, `getReducedMotionTransition()`.

## Microcopy

- **Hero:** “Real-time signals. Human-ready insights.”
- **Primary CTA:** “Connect Markets”
- **Secondary CTA:** “Try Demo Data”
- **Empty state CTA:** “Upload a PDF or paste a ticker”

## Component naming

- **DataMeshBackground** — full-bleed background layer
- **AsymmetricCard** — cut-corner container (`cut`: top-right | bottom-left | …)
- **ConfidenceMeter** — circular segmented meter + numeric %
- **NumericDisplay** — compact tabular financial numbers
- **MarketSignalCard** — signal card: sparkline, value, confidence meter, optional “new” dot. In Conservative variant uses standard `Card` (rounded, no clip-path).

## Variant directions

- **Conservative (Linear/Vercel):** **Current implementation.** Premium and restrained; flat surfaces, subtle borders, minimal shadow, no data-mesh on main areas, standard rounded cards. Restrained motion (e.g. hover scale 1.01).
- **Bold:** Strong signature motif, higher contrast, more motion; data-mesh and asymmetric cards reintroduced.
- **Experimental:** Data-mesh + asymmetric cards everywhere; parallax and pulse; distinct identity.

## Accessibility

- **Contrast:** Primary text on dark meets WCAG AA. Use `--fg` on `--bg` / `--bg-surface`.
- **Color-blind charts:** Prefer accent cyan + primary violet + highlight orange; avoid red/green-only encoding. An alternate palette for charts is documented in `docs/design/accessibility.md`.
- **Focus:** Visible focus ring (`:focus-visible`) with `--border-strong`.
- **Reduced motion:** All motion tokens and keyframes respect `prefers-reduced-motion: reduce`.

## Tailwind theme

Apps extend Tailwind with tokens from CSS. Example (see `apps/frontend-chat/tailwind.config.ts`):

- `colors`: bg, bg-surface, primary, accent, highlight, fg, fg-muted, …
- `boxShadow`: soft, elevated
- `borderRadius`: sm (6px), md (12px), lg (18px)
- `transitionDuration`: micro, macro
