-- lockIn — Supabase schema
--
-- Mirrors src/lib/types.ts one-to-one. Every table is scoped by user_id and
-- protected by row-level security, so the anon key can only ever reach the
-- signed-in user's own rows.
--
-- Apply with:  supabase db push   (or paste into the SQL editor)

create extension if not exists "pgcrypto";

-- Enums -----------------------------------------------------------------------

do $$ begin
  create type priority as enum ('critical', 'high', 'medium', 'low');
exception when duplicate_object then null; end $$;

do $$ begin
  create type goal_status as enum ('active', 'paused', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type focus_item_status as enum ('not_started', 'in_progress', 'blocked', 'done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type session_status as enum ('running', 'paused', 'completed', 'abandoned');
exception when duplicate_object then null; end $$;

-- Settings --------------------------------------------------------------------

create table if not exists settings (
  user_id                 uuid primary key references auth.users (id) on delete cascade,
  display_name            text        not null default '',
  daily_target_hours      numeric(4, 2) not null default 7,
  workdays                int[]       not null default '{1,2,3,4,5}',
  default_session_minutes int         not null default 60,
  theme                   text        not null default 'dark' check (theme in ('dark', 'light')),
  -- Small, user-editable lists; JSONB keeps them versionless.
  checklist_template      jsonb       not null default '[]'::jsonb,
  pause_reasons           jsonb       not null default '[]'::jsonb,
  music_links             jsonb       not null default '[]'::jsonb,
  updated_at              timestamptz not null default now()
);

-- Catalogue -------------------------------------------------------------------

create table if not exists categories (
  id          text        primary key,
  user_id     uuid        not null references auth.users (id) on delete cascade,
  name        text        not null,
  description text        not null default '',
  color       text        not null default 'chart-1',
  icon        text        not null default 'layers',
  created_at  timestamptz not null default now()
);

create table if not exists goals (
  id           text        primary key,
  user_id      uuid        not null references auth.users (id) on delete cascade,
  category_id  text        not null references categories (id) on delete cascade,
  title        text        not null,
  description  text        not null default '',
  priority     priority    not null default 'medium',
  target_hours numeric(6, 2) not null default 40,
  status       goal_status not null default 'active',
  target_date  date,
  created_at   timestamptz not null default now()
);

create table if not exists focus_items (
  id                    text              primary key,
  user_id               uuid              not null references auth.users (id) on delete cascade,
  goal_id               text              not null references goals (id) on delete cascade,
  name                  text              not null,
  notes                 text              not null default '',
  priority              priority          not null default 'medium',
  estimated_daily_hours numeric(4, 2)     not null default 1,
  status                focus_item_status not null default 'not_started',
  created_at            timestamptz       not null default now(),
  archived_at           timestamptz
);

-- Planning and sessions -------------------------------------------------------

create table if not exists daily_plans (
  user_id     uuid  not null references auth.users (id) on delete cascade,
  date        date  not null,
  -- [{ focusItemId, plannedHours }]
  allocations jsonb not null default '[]'::jsonb,
  intention   text  not null default '',
  primary key (user_id, date)
);

create table if not exists focus_sessions (
  id                  text           primary key,
  user_id             uuid           not null references auth.users (id) on delete cascade,
  focus_item_id       text           not null references focus_items (id) on delete cascade,
  planned_minutes     int            not null default 60,
  started_at          timestamptz    not null,
  ended_at            timestamptz,
  -- Accumulated completed pause time; active time is derived, never stored.
  paused_ms           bigint         not null default 0,
  paused_at           timestamptz,
  status              session_status not null default 'running',
  pauses              jsonb          not null default '[]'::jsonb,
  checklist           jsonb          not null default '[]'::jsonb,
  productivity_rating int            check (productivity_rating between 1 and 5),
  reflection          text           not null default ''
);

-- Indexes ---------------------------------------------------------------------

create index if not exists categories_user_idx     on categories (user_id);
create index if not exists goals_user_idx          on goals (user_id, status);
create index if not exists goals_category_idx      on goals (category_id);
create index if not exists focus_items_user_idx    on focus_items (user_id, status);
create index if not exists focus_items_goal_idx    on focus_items (goal_id);
create index if not exists sessions_user_start_idx on focus_sessions (user_id, started_at desc);
create index if not exists sessions_item_idx       on focus_sessions (focus_item_id);

-- Only one session may be open per user at a time.
create unique index if not exists sessions_single_open_idx
  on focus_sessions (user_id)
  where status in ('running', 'paused');

-- Row-level security ----------------------------------------------------------

alter table settings       enable row level security;
alter table categories     enable row level security;
alter table goals          enable row level security;
alter table focus_items    enable row level security;
alter table daily_plans    enable row level security;
alter table focus_sessions enable row level security;

do $$
declare
  target text;
begin
  foreach target in array array[
    'settings', 'categories', 'goals', 'focus_items', 'daily_plans', 'focus_sessions'
  ] loop
    execute format(
      'drop policy if exists %I on %I', target || '_owner', target
    );
    execute format(
      'create policy %I on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())',
      target || '_owner', target
    );
  end loop;
end $$;

-- Reporting view --------------------------------------------------------------
--
-- Per-day rollup matching DayMetrics' raw inputs. The focus score itself stays
-- in TypeScript (src/lib/analytics.ts) so its weights remain reviewable in one
-- place rather than being duplicated in SQL.

create or replace view daily_focus_rollup as
select
  s.user_id,
  (s.started_at at time zone 'utc')::date                     as day,
  count(*)                                                    as session_count,
  count(*) filter (where s.status = 'completed')               as completed_sessions,
  sum(
    extract(epoch from (coalesce(s.ended_at, now()) - s.started_at)) * 1000
    - s.paused_ms
  ) / 3600000.0                                                as actual_hours,
  max(
    extract(epoch from (coalesce(s.ended_at, now()) - s.started_at)) * 1000
    - s.paused_ms
  ) / 60000.0                                                  as longest_session_minutes,
  avg(s.productivity_rating)                                   as average_rating
from focus_sessions s
group by s.user_id, day;
