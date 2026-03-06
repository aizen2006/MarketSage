# Accessibility Notes

## Contrast (WCAG AA)

- **Primary text** `#E6EEF8` on `#0B0F1A`: ~12:1. Use for body and headings.
- **Muted text** `#9AA7B8` on `#0B0F1A`: ~5.5:1. Use for secondary copy only.
- **Primary (violet)** `#7C3AED` on dark: use for large CTAs and icons; avoid small text in primary only.

## Color-blind friendly palette (charts & data)

Use in addition to (or instead of) default accent/highlight when encoding categorical data or “positive/negative” so that protanopia/deuteranopia users can distinguish:

| Role       | Default   | Alternate (safe) |
|-----------|-----------|-------------------|
| Primary   | #7C3AED   | #7C3AED (keep)    |
| Positive  | #22D3EE   | #22D3EE (cyan)    |
| Negative  | #F97316   | #F97316 (orange)  |
| Neutral   | #9AA7B8   | #9AA7B8           |

Avoid relying on red vs green alone. Prefer **cyan vs orange** or **violet vs cyan** for binary/categorical encoding. For sparklines and meters, cyan is the data emphasis color and is distinguishable from orange (heat/warning).

## Reduced motion

- `packages/ui/src/tokens/tokens.css` sets `--motion-micro` and `--motion-macro` to `0.01s` inside `@media (prefers-reduced-motion: reduce)`.
- Data-mesh keyframes and pulse animation should not run or should be minimal when reduced motion is preferred. Use `.pulse-animate` with `animation: none` in a reduced-motion media query where applicable.
- Motion presets in `packages/ui/src/motion/presets.ts` expose `getReducedMotionTransition()` for JS-driven animations.

## Skeleton loaders

Use `Skeleton` from `@repo/ui` for heavy data (e.g. API keys list, insights) so layout and structure are visible before content loads. Keeps perceived performance high and avoids layout shift.
