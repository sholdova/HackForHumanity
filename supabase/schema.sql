-- Run this in the Supabase SQL editor before using the app.
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 80),
  description text not null check (char_length(description) between 1 and 500),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_email text not null,
  created_at timestamptz not null default now()
);
alter table public.ideas enable row level security;
create policy "Authenticated participants can read ideas" on public.ideas for select to authenticated using (true);
create policy "Participants can add their own ideas" on public.ideas for insert to authenticated with check (auth.uid() = author_id);
