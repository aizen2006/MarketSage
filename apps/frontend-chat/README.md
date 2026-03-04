MarketSage is a modern, minimal finance-agent chat interface built on Next.js, Tailwind CSS, and motion.dev. It provides a sleek, ChatGPT-style experience with light/dark themes, a protected chat route, and mock APIs for auth and chat responses.

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- motion.dev for micro-interactions
- Jest + React Testing Library for unit tests

## Getting started

Install dependencies (from the repo root or this app directory):

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Routes

- `/signin` – sign-in form with floating labels, remember-me, and social buttons (visual only).
- `/signup` – sign-up form with the same styling.
- `/chat` – protected chat UI; unauthenticated users are redirected to `/signin`.

## Architecture

- `src/app/layout.tsx` – wraps the app in `ThemeProvider` and `AuthProvider`.
- `src/context/ThemeContext.tsx` – manages light/dark mode and persists to `localStorage`.
- `src/context/AuthContext.tsx` – simple mock auth using `lib/mockApi.ts` and `localStorage`.
- `src/hooks/useChatState.ts` – conversation and message state, optimistic sending, persistence.
- `src/lib/mockApi.ts` – mock auth and chat endpoints.
- `src/lib/motion.ts` – shared motion.dev animation presets.
- `src/components` – UI components: `Sidebar`, `Header`, `ChatWindow`, `Composer`, `MessageBubble`, `ThemeToggle`, `AuthForm`, etc.

## Testing

Run unit tests:

```bash
bun run test
```

Example tests live under `src/components/__tests__/` and cover the `Composer` and `Sidebar` components.

## Theming & motion

Color tokens and motion guidelines are documented in `DESIGN_NOTES.md`. Theme colors are implemented as CSS variables in `src/app/globals.css` and referenced from Tailwind via the custom `tailwind.config.ts`.
