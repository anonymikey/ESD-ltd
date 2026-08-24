-- ecoadmin schema — notification / activity system (Phase 1: database only)
-- Run this against the same Supabase project as 0001 and 0002, after both.
-- Adds one new table (admin_notifications) and one narrowly-scoped SQL
-- function. Touches nothing on admin_users, senders, templates, email_logs,
-- retention_settings, or cleanup_runs — no existing policy is modified.

-- ============================================================================
-- admin_notifications
--
-- Serves both "my notifications" (bell/unread count) and "activity feed"
-- (chronological history) from a single table — this project's admin count
-- is small enough that a separate activity-log table would just mean
-- joining two tables for every read with no real benefit. See the audit
-- for the fuller reasoning.
--
-- admin_user_id is the RECIPIENT of this row. "Notify all active admins" is
-- implemented as fan-out-on-write: one row per recipient, not a single
-- broadcast row computed at read time. At this project's admin count that's
-- cheap and keeps every query a plain `WHERE admin_user_id = auth.uid()`.
--
-- actor_name is denormalized (the acting admin's display name/email,
-- captured at write time) rather than resolved via a join against
-- admin_users at read time. This is a deliberate choice: admin_users'
-- existing RLS only lets a user read their OWN row (see 0001), and
-- broadening that so any admin could look up any other admin's row was a
-- bigger, less obviously-safe change than just storing the name once, here,
-- when it's already known. actor_admin_id is kept too, as a real reference
-- for any future feature that legitimately needs it — it just isn't relied
-- on for display.
--
-- `type` deliberately has NO check constraint. Constraining it would mean
-- every new activity type needs a migration; instead it's validated by the
-- TypeScript union in lib/ecoadmin/activityTypes.ts. `severity` DOES have a
-- check constraint — it drives UI styling directly and has a small, stable
-- set of values, so constraining it protects rendering logic instead of
-- getting in the way of extension.
-- ============================================================================
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),

  admin_user_id uuid not null references public.admin_users(id) on delete cascade,

  actor_admin_id uuid references public.admin_users(id) on delete set null,
  actor_name text,

  type text not null,
  title text not null,
  message text not null,

  severity text not null default 'info'
    check (severity in ('success', 'info', 'warning', 'error', 'system')),

  entity_type text,
  entity_id text,

  metadata jsonb not null default '{}'::jsonb,

  is_read boolean not null default false,

  created_at timestamptz not null default now()
);

comment on table public.admin_notifications is
  'Per-recipient admin notifications and activity history. One row per recipient — a "notify all admins" action fans out to one row per active admin, it does not broadcast a single shared row.';
comment on column public.admin_notifications.admin_user_id is
  'Recipient of this notification (whose bell/activity feed it appears in).';
comment on column public.admin_notifications.actor_name is
  'Denormalized display name/email of the acting admin, captured at write time. See table-level design note above for why this is denormalized rather than joined.';

-- Recipient + unread — the exact shape of the unread-count / bell query.
create index if not exists admin_notifications_recipient_unread_idx
  on public.admin_notifications (admin_user_id, is_read)
  where is_read = false;

-- Recipient + chronological — the exact shape of the recent-list / activity
-- feed query (always ordered newest-first, always scoped to one recipient).
create index if not exists admin_notifications_recipient_created_idx
  on public.admin_notifications (admin_user_id, created_at desc);

alter table public.admin_notifications enable row level security;

-- Tight: an admin may only ever read rows addressed to them.
create policy "admins can read own notifications"
  on public.admin_notifications for select
  using (
    admin_user_id = auth.uid()
    and exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Tight: an admin may only mark their OWN notifications read — not tamper
-- with another admin's read state.
create policy "admins can update own notifications"
  on public.admin_notifications for update
  using (
    admin_user_id = auth.uid()
    and exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  )
  with check (admin_user_id = auth.uid());

-- Necessarily broader: for Admin A's action to notify Admin B, the row
-- being inserted has admin_user_id = B while the session performing the
-- insert is A's. A policy restricted to "admin_user_id = auth.uid()" would
-- make cross-admin notification impossible. This mirrors a trust level
-- already granted elsewhere in this schema — any active admin can already
-- read the full email_logs audit trail across every admin, not just their
-- own sends. There is still no path for an unauthenticated or non-admin
-- user to insert anything; this only ever runs from server-side code
-- already gated by checkAdmin().
create policy "active admins can insert notifications"
  on public.admin_notifications for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- No DELETE policy. Notifications aren't deletable in this phase — keep the
-- surface area to what's actually used.

-- ============================================================================
-- get_active_admin_ids()
--
-- notifyAllAdmins() needs to know who the current active admins are in
-- order to fan out one row per recipient. admin_users' existing RLS (0001)
-- only lets a caller read their OWN row, which would make that lookup
-- return at most one id. Rather than broadening admin_users' general SELECT
-- policy (a wider, more permanent change), this is one narrow, purpose-
-- built function: it returns ONLY ids, nothing else, and — critically — it
-- re-checks that the CALLER is themselves an active admin before returning
-- anything, even though it runs as SECURITY DEFINER (elevated privilege
-- internally). A non-admin or unauthenticated caller gets zero rows back,
-- not an error and not a bypass.
-- ============================================================================
create or replace function public.get_active_admin_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.admin_users
  where is_active = true
    and exists (
      select 1 from public.admin_users caller
      where caller.id = auth.uid() and caller.is_active = true
    );
$$;

revoke all on function public.get_active_admin_ids() from public;
grant execute on function public.get_active_admin_ids() to authenticated;
