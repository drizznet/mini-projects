# How this app talks to Postgres

## The pipeline

```text
HTTP request
  → TodosController          (TSOA / HTTP only)
  → TodoService              (rules: validate, 404, normalize)
  → TodoRepository           (Prisma Client)
  → PostgreSQL               (brew :5432 or Docker :5433)
```

**HTTP DTOs** = `src/modules/todos/todo.types.ts` (TSOA / OpenAPI).  
**Row type** = Prisma `Todo` from `@prisma/client`.  
**Table** = `todos` (defined in `prisma/schema.prisma`, applied by migrate/push).  
**Repository** = talks to the DB; service never imports Prisma/`pg` directly.

## Prisma path

`GET /api/todos/{id}`:

1. Controller → `todoService.getById(id)`
2. Service → `todoRepository.findById(id)`
3. Repository → `prisma.todo.findUnique({ where: { id } })`
4. Prisma runs SQL under the hood and returns a typed row
5. `mapTodo()` turns `Date` fields into ISO strings for the API

Schema lives in `prisma/schema.prisma`. Client singleton: `src/db/prisma.ts`.

## Commands

```bash
# 1. Postgres up + DATABASE_URL in .env
pnpm db:ping

# 2. Create/sync tables from prisma/schema.prisma
pnpm db:migrate          # named migration (preferred)
# or
pnpm db:push             # quick prototype sync (no migration history)

# 3. Regenerate client after schema edits (migrate/push usually do this)
pnpm db:generate

# 4. Browse data in a GUI
pnpm db:studio

pnpm dev
```

## Brew vs Docker

| | Brew | Docker |
|--|--|--|
| Port | `5432` | `5433` |
| URL | `postgresql://YOU@localhost:5432/server_dev` | `postgresql://server:server@localhost:5433/server_dev` |

Only `DATABASE_URL` changes.

We pin **Prisma 6** (classic `url = env("DATABASE_URL")` in the schema). Prisma 7 needs extra config — see BACKLOG.
