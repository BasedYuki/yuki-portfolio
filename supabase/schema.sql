-- =============================================================
-- YUKI PORTFOLIO — Supabase schema
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- ---------- Tables ----------

create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  handle text not null default 'YUKI',
  name text not null default 'Omar Abdelhamed',
  tagline text not null default 'big dream small dih',
  arcana text not null default 'THE FOOL',
  arcana_num text not null default '0',
  role text not null default '',
  bio_head text not null default '',
  bio_body text not null default '',
  quote text not null default '',
  email text not null default '',
  portrait_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  handle text not null default '',
  url text not null,
  "order" int not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  arcana text not null default 'THE FOOL',
  description text not null default '',
  cover_url text,
  link text,
  published boolean not null default true,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skill_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value int not null default 50 check (value between 0 and 100),
  "order" int not null default 0
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  "order" int not null default 0
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  period text not null default '',
  title text not null default '',
  org text not null default '',
  description text not null default '',
  "order" int not null default 0
);

-- ---------- Row Level Security ----------

alter table public.profile    enable row level security;
alter table public.socials    enable row level security;
alter table public.projects   enable row level security;
alter table public.skill_stats enable row level security;
alter table public.equipment  enable row level security;
alter table public.experience enable row level security;

-- Everyone (site visitors) can read
create policy "content is public" on public.profile     for select using (true);
create policy "content is public" on public.socials     for select using (true);
create policy "content is public" on public.projects    for select using (true);
create policy "content is public" on public.skill_stats for select using (true);
create policy "content is public" on public.equipment   for select using (true);
create policy "content is public" on public.experience  for select using (true);

-- Only the logged-in admin can write
create policy "admin writes" on public.profile     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin writes" on public.socials     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin writes" on public.projects    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin writes" on public.skill_stats for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin writes" on public.equipment   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin writes" on public.experience  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- Storage bucket for images ----------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media admin write" on storage.objects
  for all using (bucket_id = 'media' and auth.role() = 'authenticated')
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

-- ---------- Realtime (live site updates) ----------

do $$
begin
  begin
    alter publication supabase_realtime add table public.profile;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.socials;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.projects;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.skill_stats;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.equipment;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.experience;
  exception when duplicate_object then null;
  end;
end $$;
