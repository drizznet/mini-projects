# Lockin project modules

Lockin-specific HTTP modules belong under `modules/`. They use shared infrastructure from
`src/db`, `src/errors`, and `src/modules/auth` but own their routes, services, repositories,
DTOs, and Prisma models.

Current modules:

- `modules/commitments` — authenticated plan CRUD under `/api/lockedin/plans`
- `modules/today` — authenticated today summary under `/api/lockedin/today`
