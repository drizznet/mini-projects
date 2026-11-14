# Server

Standalone Node.js + Express + TypeScript API with **TSOA** controller → route codegen.

You write controllers; TSOA generates Express routes and OpenAPI (`/docs`).

## Setup

```bash
cd server
pnpm install
cp .env.example .env
```

### Postgres + Prisma

See [DOCKER.md](./DOCKER.md) and [DB.md](./DB.md).

```bash
pnpm docker:up      # or use brew Postgres on :5432
pnpm db:ping
pnpm db:migrate     # applies prisma/schema.prisma (or pnpm db:push)
pnpm db:studio      # optional GUI
pnpm docker:down    # if using Docker
```

Uses **Prisma 7** with the generated ESM client and PostgreSQL driver adapter.

## Run

```bash
pnpm dev
```

- API: `http://localhost:4400`
- Swagger: `http://localhost:4400/docs`
- OpenAPI JSON: `http://localhost:4400/openapi.json`

## Adding a route

Shared capabilities live in `src/modules`. Product-specific capabilities should live under
`src/projects/<product>/modules` so they cannot accidentally become part of another product.

Example:

```text
src/
  modules/                 # shared auth, billing, files, etc.
  projects/
    auradesk/modules/     # AuraDesk-only controllers and services
    lockedin/modules/      # Lockin-only controllers and services
```

Each product should use a URL namespace such as `/api/auradesk/...` or `/api/lockedin/...`.
Keep controllers thin and use the same `types → repository → service → controller` layering.

**Table + DTOs** — add the table in `prisma/schema.prisma`; HTTP shapes live in the feature module (`*.types.ts`). Use Prisma types in the repository.

Then `pnpm dev` regenerates routes + OpenAPI (or run `pnpm generate`).

## Auth

| Endpoint | Auth |
|----------|------|
| `POST /api/auth/login` | Public |
| `POST /api/auth/google` | Public (Google ID token) |
| `POST /api/auth/register` | Public |
| `GET /api/auth/me` | Bearer token from login |

Default credentials (override with env):

- `ADMIN_EMAIL=admin@drizznet.local`
- `ADMIN_PASSWORD=drizznet`
- `AUTH_SECRET=dev-secret-change-me`

## Env

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4400` | Listen port |
| `CORS_ORIGIN` | `*` | Comma-separated origins |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15m) | Rate-limit window |
| `RATE_LIMIT_MAX` | `100` | Max requests per IP per window |
| `TRUST_PROXY` | — | Set `true` / `1` behind a reverse proxy |
| `ADMIN_EMAIL` | `admin@drizznet.local` | Login email |
| `ADMIN_PASSWORD` | `drizznet` | Login password |
| `AUTH_SECRET` | `dev-secret-change-me` | Token HMAC secret |
| `AUTH_TOKEN_TTL_SEC` | `86400` | Token lifetime |
| `GOOGLE_CLIENT_ID` | — | Google OAuth Web client ID (verify ID tokens) |

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm generate` | Emit `src/generated/routes.ts` + `swagger.json` |
| `pnpm dev` | Watch controllers + run API |
| `pnpm build` | Generate + compile |
| `pnpm start` | Run compiled `dist/server.js` |
| `pnpm types` | Typecheck without emit |
| `pnpm db:seed` | Seed the development user and Lockin plans |
