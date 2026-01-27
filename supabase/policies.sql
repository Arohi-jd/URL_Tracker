-- Enable RLS and clear old policies so this script is repeatable
alter table public.monitored_urls enable row level security;
alter table public.url_status_logs enable row level security;

-- Drop existing policies to avoid create conflicts (Postgres <16 lacks IF NOT EXISTS)
drop policy if exists "monitors select own" on public.monitored_urls;
drop policy if exists "monitors insert self" on public.monitored_urls;
drop policy if exists "monitors update own" on public.monitored_urls;
drop policy if exists "monitors delete own" on public.monitored_urls;
drop policy if exists "logs select by owner" on public.url_status_logs;

-- Monitors: users can manage their own
create policy "monitors select own" on public.monitored_urls
for select using (auth.uid() = user_id);
create policy "monitors insert self" on public.monitored_urls
for insert with check (auth.uid() = user_id);
create policy "monitors update own" on public.monitored_urls
for update using (auth.uid() = user_id);
create policy "monitors delete own" on public.monitored_urls
for delete using (auth.uid() = user_id);

-- Logs: readable by owner via url_id relationship
create policy "logs select by owner" on public.url_status_logs
for select using (exists (
  select 1 from public.monitored_urls m
  where m.id = url_id and m.user_id = auth.uid()
));

-- Notifications: not exposed to client by default (no RLS needed for client)
