# Agent Quick Guide (<=100 lines)

**Role:** AI coding agent. Follow repo rules and be safe. Keep changes small and verifiable.

## Commands (use manifest; never guess)
- Install: `npm install`
- Lint: `npm run lint`
- Type-check: `npm run type-check`
- Test: `npm run test`
- Build: `npm run build`

## Testing
- Run `npm run lint` before PR.
- Prefer `npm run test` for unit/integration checks.
- Use CI profile commands from `.repo/repo.manifest.yaml`.

## Tech Stack (must mention in PRs/docs)
- Backend: **Django 4.2** on **Python 3.11**
- Frontend: **React 18** + **TypeScript**

## Project Structure
- `app/` Next.js routes/pages
- `components/` shared UI components
- `lib/` utilities/business logic
- `content/` content/markdown
- `public/` static assets
- `backend/` server code
- `frontend/` client code
- `.repo/tasks/` task workflow (TODO/BACKLOG/ARCHIVE)

## Code Style
- Prefer functional React components with TypeScript.
- Server Components by default; Client Components only when needed.
- Keep utilities in `lib/` and UI in `components/`.

**Example (React):**
```tsx
export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}
```

**Example (utility):**
```ts
export const toTitle = (value: string) =>
  value.replace(/\b\w/g, (c) => c.toUpperCase());
```

## Git Workflow
- One change type per PR.
- Link changes to `.repo/tasks/TODO.md` task.
- Commit messages: imperative, concise.
- Never commit secrets or `.env` files.

## Boundaries (MUST)
- No cross-module imports without ADR (see `.repo/policy/BOUNDARIES.md`).
- Don’t change policy files without approval.
- If UNKNOWN or risky (security/money/external), create HITL and stop.
