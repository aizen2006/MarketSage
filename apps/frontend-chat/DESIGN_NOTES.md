## Visual tokens

- **Accent**: `#06b6d4` (primary finance action / highlights)
- **Accent soft**: `#ecfeff` (light), `#022c38` (dark)
- **Background**: `#f8fafc` (light), `#0b1220` (dark)
- **Surface**: `#ffffff` (light), `#0f1724` (dark)
- **Text primary**: `#0f172a` (light), `#e6eef8` (dark)
- **Text muted**: `#64748b`
- **Danger**: `#ef4444`
- **Radius**: `rounded-2xl` for major cards, `rounded-xl` for buttons and inputs
- **Spacing**: use Tailwind scale `4, 6, 8` as primary unit steps for padding/margins

## Motion patterns

Defined in `src/lib/motion.ts` and used across the app:

- **Buttons**
  - Tap: `whileTap={{ scale: 0.98 }}` with a short spring
  - Duration: **0.15s**, spring stiffness ~400, damping ~25
- **Messages**
  - Enter: `initial={{ opacity: 0, y: 6 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.28 }}`
- **Typing indicator**
  - Three-dot keyframes; each dot animates `y` and `opacity` over **0.9s**, repeating infinitely with slight delays
- **Theme toggle**
  - Background pill uses `layout` animations with a spring transition around **0.35s**
  - Sun / moon icons remain static for now, but container translates between light/dark halves
- **Mode tabs**
  - Sliding pill indicator driven by `layout` + spring for smooth transitions

## Interaction guidelines

- Prefer subtle motion; avoid large bounces or overshoot.
- Every focusable element must have a visible focus ring, using the accent color.
- Hover states should rely on small elevation and color changes rather than large movement.
- Use the accent color sparingly (primary CTAs, active states, key indicators) to keep the UI calm and finance-appropriate.

