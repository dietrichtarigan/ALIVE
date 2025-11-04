-- Add poster support for job postings
alter table public.jobs
  add column if not exists poster_url text,
  add column if not exists poster_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-posters',
  'job-posters',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;