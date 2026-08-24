# Docker + Postgres (local learning path)

You do **not** build a custom Postgres image for day-to-day work. You **run** the official image and point your app at it with `DATABASE_URL`.

## Concepts (quick)

| Term | Meaning |
|------|---------|
| **Image** | Blueprint (`postgres:16-alpine` from Docker Hub) |
| **Container** | Running instance of that image |
| **Compose** | YAML that starts one or more containers (`docker-compose.yml`) |
| **Volume** | Disk so DB data survives `docker compose down` |
| **Port map** | `5432:5432` → your Mac talks to `localhost:5432` |

## 1. Start Postgres

```bash
cd server
pnpm docker:up
# same as: docker compose up -d
# Postgres is on localhost:5433 (brew can keep 5432)
```

Check it’s healthy:

```bash
docker compose ps
docker compose logs -f postgres   # Ctrl+C to stop following
```

## 2. Connect the codebase

`.env` (from `.env.example`) must match Compose credentials:

```env
DATABASE_URL=postgresql://server:server@localhost:5433/server_dev
```

Then:

```bash
pnpm db:ping
pnpm db:migrate   # or pnpm db:push
```

`src/db/prisma.ts` is the Prisma client; todos use it by default.

## 3. Stop / reset

```bash
pnpm docker:down          # stop container, keep data volume
docker compose down -v    # stop + DELETE all Postgres data
```

## Next (not done yet)

See `BACKLOG.md`.
