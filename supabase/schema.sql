-- Enable needed extensions
create extension if not exists pgcrypto;

-- Monitored URLs belong to users in auth.users
create table if not exists public.monitored_urls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  interval_minutes int not null default 5,
  is_active boolean not null default true,
  last_checked timestamptz,
  last_status text not null default 'unknown',
  created_at timestamptz not null default now()
);

-- Status logs
create table if not exists public.url_status_logs (
  id bigserial primary key,
  url_id uuid not null references public.monitored_urls(id) on delete cascade,
  ts timestamptz not null default now(),
  status text not null check (status in ('up','down')),
  response_time_ms int,
  error text
);
create index if not exists idx_url_status_logs_url_ts on public.url_status_logs(url_id, ts desc);

-- Notifications (queued/sent)
create table if not exists public.notifications (
  id bigserial primary key,
  url_id uuid not null references public.monitored_urls(id) on delete cascade,
  type text not null check (type in ('email','sms','push')),
  status text not null default 'queued',
  message text,
  created_at timestamptz not null default now()
);

-- Helper function to fetch due monitors (called by backend scheduler)
create or replace function public.get_due_monitors()
returns setof public.monitored_urls
language sql stable as $$
  select m.*
  from public.monitored_urls m
  where m.is_active
    and (
      m.last_checked is null
      or (extract(epoch from (now() - m.last_checked)) / 60.0) >= m.interval_minutes
    )
  order by m.last_checked nulls first
  limit 200
$$;
