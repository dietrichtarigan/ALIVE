-- Jobs table for INFOPROF postings
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  location text not null,
  category text not null check (category in ('Kerja', 'Magang', 'Beasiswa')),
  description text not null,
  requirements text[] default '{}'::text[],
  deadline date,
  contact text not null,
  link text not null,
  tags text[] default '{}'::text[],
  highlight text,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists jobs_category_idx on public.jobs(category);
create index if not exists jobs_deadline_idx on public.jobs(deadline);

comment on column public.jobs.created_by is 'Supabase auth user id that created the record';

-- Alumni stories table for CeritaKita
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  name text not null,
  batch text not null,
  role text not null,
  company text not null,
  location text not null,
  summary text not null,
  tags text[] default '{}'::text[],
  quote text not null,
  body text[] default '{}'::text[],
  avatar_color text,
  featured boolean default false,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists stories_slug_idx on public.stories(slug);
create index if not exists stories_featured_idx on public.stories(featured);

comment on column public.stories.created_by is 'Supabase auth user id that created the record';

-- Updated-at triggers reuse handle_updated_at()
drop trigger if exists handle_updated_at on public.jobs;
create trigger handle_updated_at before update on public.jobs
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.stories;
create trigger handle_updated_at before update on public.stories
  for each row execute function public.handle_updated_at();

-- Enable RLS
alter table public.jobs enable row level security;
alter table public.stories enable row level security;

-- Service role policies
drop policy if exists "Service role full access to jobs" on public.jobs;
create policy "Service role full access to jobs"
  on public.jobs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role full access to stories" on public.stories;
create policy "Service role full access to stories"
  on public.stories for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
