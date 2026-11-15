-- EcoAdmin theme preferences — one customizable interface theme per admin.
-- Run after migrations 0001, 0002, and 0003.

create table if not exists public.admin_preferences (
  admin_user_id uuid primary key references public.admin_users(id) on delete cascade,
  theme jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_preferences enable row level security;

create policy "admins can read own preferences"
  on public.admin_preferences for select
  using (admin_user_id = auth.uid());

create policy "admins can insert own preferences"
  on public.admin_preferences for insert
  with check (
    admin_user_id = auth.uid()
    and exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

create policy "admins can update own preferences"
  on public.admin_preferences for update
  using (
    admin_user_id = auth.uid()
    and exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  )
  with check (admin_user_id = auth.uid());
