# How this app talks to Postgres

The server uses one shared Prisma client and one Postgres database. Shared tables belong in
`prisma/schema.prisma`; product-specific tables should be organized around their product
module.

```text
HTTP request
  → product/shared controller (TSOA)
  → service (business rules)
  → repository (Prisma Client)
  → PostgreSQL
```

Repositories are the only application layer that should import Prisma. Controllers should
remain focused on HTTP and services should remain focused on business rules.

## Commands

```bash
# Postgres up + DATABASE_URL in .env
pnpm db:ping

# Create/sync tables from prisma/schema.prisma
pnpm db:migrate          # named migration (preferred)
# or
pnpm db:push             # quick prototype sync (no migration history)

pnpm db:generate
pnpm db:studio
```

## Brew vs Docker

| | Brew | Docker |
|--|--|--|
| Port | `5432` | `5433` |
| URL | `postgresql://YOU@localhost:5432/server_dev` | `postgresql://server:server@localhost:5433/server_dev` |

Only the runtime URL changes. Prisma 7 reads its CLI datasource configuration from
`prisma.config.ts`, preferring `DATABASE_URL_UNPOOLED` for migrations. Neon migrations
should use the direct connection, not the pooled hostname. Runtime queries use the
PostgreSQL driver adapter.
