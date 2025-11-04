-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Updated-at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Hero sections table
create table if not exists public.hero_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  cta_primary_text text,
  cta_primary_url text,
  cta_secondary_text text,
  cta_secondary_url text,
  background_image text,
  is_published boolean default false,
  position int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists handle_updated_at on public.hero_sections;
create trigger handle_updated_at before update on public.hero_sections
  for each row execute function public.handle_updated_at();

create index if not exists hero_sections_slug_idx on public.hero_sections(slug);
create index if not exists hero_sections_published_idx on public.hero_sections(is_published, position);

-- CTA blocks table
create table if not exists public.cta_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  cta_text text,
  cta_url text,
  is_published boolean default false,
  position int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists handle_updated_at on public.cta_blocks;
create trigger handle_updated_at before update on public.cta_blocks
  for each row execute function public.handle_updated_at();

create index if not exists cta_blocks_slug_idx on public.cta_blocks(slug);
create index if not exists cta_blocks_published_idx on public.cta_blocks(is_published, position);

-- FAQ items table
create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  question text not null,
  answer text not null,
  category text,
  is_published boolean default false,
  position int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists handle_updated_at on public.faq_items;
create trigger handle_updated_at before update on public.faq_items
  for each row execute function public.handle_updated_at();

create index if not exists faq_items_slug_idx on public.faq_items(slug);
create index if not exists faq_items_published_idx on public.faq_items(is_published, position);
create index if not exists faq_items_category_idx on public.faq_items(category);

-- Pricing tiers table
create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price numeric not null,
  currency text default 'USD',
  billing_period text default 'month',
  description text,
  features jsonb default '[]'::jsonb,
  cta_text text,
  cta_url text,
  is_popular boolean default false,
  is_published boolean default false,
  position int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists handle_updated_at on public.pricing_tiers;
create trigger handle_updated_at before update on public.pricing_tiers
  for each row execute function public.handle_updated_at();

create index if not exists pricing_tiers_slug_idx on public.pricing_tiers(slug);
create index if not exists pricing_tiers_published_idx on public.pricing_tiers(is_published, position);

-- Feature items table (for feature sections)
create table if not exists public.feature_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon_name text,
  image_url text,
  category text,
  is_published boolean default false,
  position int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists handle_updated_at on public.feature_items;
create trigger handle_updated_at before update on public.feature_items
  for each row execute function public.handle_updated_at();

create index if not exists feature_items_slug_idx on public.feature_items(slug);
create index if not exists feature_items_published_idx on public.feature_items(is_published, position);
create index if not exists feature_items_category_idx on public.feature_items(category);

-- Enable RLS on all tables
alter table public.hero_sections enable row level security;
alter table public.cta_blocks enable row level security;
alter table public.faq_items enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.feature_items enable row level security;

-- Public read access for published content
create policy "Public read published hero sections"
  on public.hero_sections for select
  using (is_published = true);

create policy "Public read published CTA blocks"
  on public.cta_blocks for select
  using (is_published = true);

create policy "Public read published FAQ items"
  on public.faq_items for select
  using (is_published = true);

create policy "Public read published pricing tiers"
  on public.pricing_tiers for select
  using (is_published = true);

create policy "Public read published feature items"
  on public.feature_items for select
  using (is_published = true);

-- Service role full access (for admin panel)
create policy "Service role full access to hero sections"
  on public.hero_sections for all
  using (true)
  with check (true);

create policy "Service role full access to CTA blocks"
  on public.cta_blocks for all
  using (true)
  with check (true);

create policy "Service role full access to FAQ items"
  on public.faq_items for all
  using (true)
  with check (true);

create policy "Service role full access to pricing tiers"
  on public.pricing_tiers for all
  using (true)
  with check (true);

create policy "Service role full access to feature items"
  on public.feature_items for all
  using (true)
  with check (true);
