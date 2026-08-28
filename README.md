# Natourna Client

Client for Natourna — a building-committee money management app. React 18 + TypeScript (strict) + Vite, running on a mock in-memory data layer until the real server is ready.

## Getting started

```bash
npm install
npm run dev
```

Demo accounts (password `password`):

- Admin: `rima.saab@email.com`
- Resident: `georges.khoury@email.com`

## Scripts

- `npm run dev` — dev server
- `npm run build` — type check + production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript only

## Architecture

Strict one-directional flow: pages/components → hooks → services. Services expose per-domain interfaces mirroring the future REST endpoints, currently backed by mock implementations (`src/services/mock/`). `src/services/index.ts` is the single wiring point for swapping in the real HTTP implementations (`VITE_API_BASE_URL` in `.env`, see `.env.example`).
