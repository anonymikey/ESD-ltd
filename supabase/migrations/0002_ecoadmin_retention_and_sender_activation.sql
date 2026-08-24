-- ecoadmin schema — phase 0 operational update
-- Adds: (a) the RLS policies needed for in-app sender activation and
-- audit-log cleanup, which 0001 deliberately did not include, and (b) the
-- retention_settings / cleanup_runs tables backing the new Settings UI.
-- Run this against the same Supabase project as 0001, after it.

-- ============================================================================
-- senders: allow active admins to UPDATE (needed for "Activate" /
-- "Deactivate" in the Senders UI). This does not weaken the domain
-- restriction — the existing CHECK constraint on senders.email still
-- applies to every row regardless of who updates it, and this only lets an
-- admin flip status on an already-proposed row, not create a new one
-- outside the allowed domain.
-- ============================================================================
create policy "active admins can update senders"
  on public.senders for update
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- ============================================================================
-- email_logs: allow active admins to DELETE (needed for retention/cleanup).
-- Deleting a row here only removes the EcoAdmin audit record — it has no
-- effect on any email already sent through Resend/Gmail/Outlook.
-- ============================================================================
create policy "active admins can delete email logs"
  on public.email_logs for delete
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- ============================================================================
-- retention_settings
-- Singleton row (id is always 1) holding the current retention period.
-- Read by Settings (to display it) and by the Sent page (to pre-fill the
-- "delete older than" control). Nothing in this codebase deletes records
-- automatically on a schedule — see cleanup_runs below, which only ever
-- gets a row from an admin explicitly running cleanup.
-- ============================================================================
create table if not exists public.retention_settings (
  id smallint primary key default 1 check (id = 1),
  retention_days int not null default 180 check (retention_days > 0),
  updated_by uuid references public.admin_users(id),
  updated_at timestamptz not null default now()
);

alter table public.retention_settings enable row level security;

create policy "active admins can read retention settings"
  on public.retention_settings for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

create policy "active admins can update retention settings"
  on public.retention_settings for all
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

insert into public.retention_settings (id, retention_days)
values (1, 180)
on conflict (id) do nothing;

-- ============================================================================
-- cleanup_runs
-- One row per cleanup action an admin actually performs (individual
-- delete, bulk selection delete, or "delete older than X days"). This is
-- what "Last cleanup" on the Settings page reads — there is currently no
-- automatic/scheduled cleanup, so there is deliberately no "next scheduled
-- cleanup" data source; the Settings UI says so explicitly rather than
-- implying a cron job exists.
-- ============================================================================
create table if not exists public.cleanup_runs (
  id uuid primary key default gen_random_uuid(),
  performed_by uuid references public.admin_users(id),
  run_type text not null check (run_type in ('individual', 'bulk_selection', 'older_than')),
  retention_days int,
  records_deleted int not null,
  created_at timestamptz not null default now()
);

alter table public.cleanup_runs enable row level security;

create policy "active admins can read cleanup runs"
  on public.cleanup_runs for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

create policy "active admins can insert cleanup runs"
  on public.cleanup_runs for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );
