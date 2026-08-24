# Server production backlog

Things to revisit before / while shipping this API to production.

## Security

- [ ] **Swagger CSP relaxations** (`src/server.ts` Helmet config)  
  `/docs` allows `'unsafe-inline'` for scripts/styles (and `validator.swagger.io` images) so Swagger UI works. That weakens XSS protection on browser-facing pages.  
  **Prod options:** disable `/docs` in production, serve docs behind auth, or drop `'unsafe-inline'` and ship a stricter CSP once Swagger is no longer needed on the public API host.

## Database

- [ ] **Apply Prisma migrations on a live DB** — schema is ready (`prisma/schema.prisma`). With Postgres up + `DATABASE_URL` set: `pnpm db:migrate` (or `pnpm db:push` for prototypes), then exercise `/api/todos`.
- [ ] **Prod secrets** — default Compose password `server` / URL in `.env.example` are local-only; never ship them.
- [ ] **Prisma 7 upgrade** — pinned on Prisma 6 for classic `url = env("DATABASE_URL")` in schema. v7 needs `prisma.config.ts` + driver adapter; revisit later.

## Learning

- [ ] **Write `docker-compose.yml` from scratch** — rebuild `server/docker-compose.yml` yourself: `services`, `image` vs build, `ports` (`host:container`), `environment` / `POSTGRES_*`, named `volumes`, `healthcheck`. Compare with a local (brew) Postgres on another port so both can run.

## Notes

Add new items below as you find them.
