-- Enable RLS and define per-user policies
alter table public.monitored_urls enable row level security;
alter table public.url_status_logs enable row level security;

-- Monitors: users can manage their own
create policy if not exists "monitors select own" on public.monitored_urls
for select using (auth.uid() = user_id);
create policy if not exists "monitors insert self" on public.monitored_urls
for insert with check (auth.uid() = user_id);
create policy if not exists "monitors update own" on public.monitored_urls
for update using (auth.uid() = user_id);
create policy if not exists "monitors delete own" on public.monitored_urls
for delete using (auth.uid() = user_id);

-- Logs: readable by owner via url_id relationship
create policy if not exists "logs select by owner" on public.url_status_logs
for select using (exists (
  select 1 from public.monitored_urls m
  where m.id = url_id and m.user_id = auth.uid()
));

-- Notifications: not exposed to client by default (no RLS needed for client)
