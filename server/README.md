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

Pinned to **Prisma 6** for the classic schema `DATABASE_URL` setup.

## Run

```bash
pnpm dev
```

- API: `http://localhost:4400`
- Swagger: `http://localhost:4400/docs`
- OpenAPI JSON: `http://localhost:4400/openapi.json`

## Adding a route

**Feature module (preferred)** — copy `src/modules/todos/` (types → repository → service → controller).

**Table + row type** — add the table in `prisma/schema.prisma`; add the mapped row shape in `src/types/` when the API shape differs from Prisma.

Then `pnpm dev` regenerates routes + OpenAPI (or run `pnpm generate`).

### Todos CRUD template

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List (`completed`, `q`, `page`, `limit`) |
| GET | `/api/todos/{id}` | Get one |
| POST | `/api/todos` | Create |
| PATCH | `/api/todos/{id}` | Partial update |
| DELETE | `/api/todos/{id}` | Delete (`204`) |

Layers: `TodosController` → `TodoService` → `TodoRepository` (Prisma → Postgres).

## Auth

| Endpoint | Auth |
|----------|------|
| `POST /api/auth/login` | Public |
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

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm generate` | Emit `src/generated/routes.ts` + `swagger.json` |
| `pnpm dev` | Watch controllers + run API |
| `pnpm build` | Generate + compile |
| `pnpm start` | Run compiled `dist/server.js` |
| `pnpm types` | Typecheck without emit |
