-- ecoadmin schema
-- Run this against your Supabase project (SQL editor, or `supabase db push`
-- if you're using the Supabase CLI locally). Not applied automatically —
-- this repo has no live Supabase project connected.

-- ============================================================================
-- admin_users
-- Distinguishes "has a Supabase auth account" from "is allowed to use
-- ecoadmin". A row here (id = auth.users.id) with is_active = true is what
-- makes someone an admin — creating a Supabase Auth user alone is not
-- enough. Add the owner's user manually after they sign up once (see
-- README section on ecoadmin setup).
-- ============================================================================
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- An admin can read their own row (this is what lib/ecoadmin/auth.ts checks
-- on every request). No one can read anyone else's row, and no client-side
-- role is granted insert/update — managing admins is a manual/service-role
-- operation for this single-owner/small-admin setup, on purpose.
create policy "admins can read own row"
  on public.admin_users for select
  using (auth.uid() = id);

-- ============================================================================
-- senders
-- The authoritative list of "From" addresses the composer may use. New
-- rows default to verification_status = 'pending' and is_active = false —
-- adding a row here does NOT make it usable until it's explicitly flipped
-- to verified/active (a deliberate manual gate against impersonation; see
-- lib/ecoadmin/senders.ts, which also hard-enforces the domain suffix in
-- application code as a second, independent check).
-- ============================================================================
create table if not exists public.senders (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@ecostructdynamicsltd\.com$'),
  display_name text not null,
  reply_to text,
  is_active boolean not null default false,
  verification_status text not null default 'pending'
    check (verification_status in ('verified', 'pending', 'unverified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.senders enable row level security;

create policy "active admins can read senders"
  on public.senders for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

create policy "active admins can propose senders"
  on public.senders for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

-- Seed the two currently authorized addresses, pre-verified.
insert into public.senders (email, display_name, reply_to, is_active, verification_status)
values
  ('info@ecostructdynamicsltd.com', 'Ecostruct Dynamics', 'info@ecostructdynamicsltd.com', true, 'verified'),
  ('tony@ecostructdynamicsltd.com', 'Tony', 'tony@ecostructdynamicsltd.com', true, 'verified')
on conflict (email) do nothing;

-- ============================================================================
-- templates
-- ============================================================================
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  created_by uuid references public.admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.templates enable row level security;

create policy "active admins can manage templates"
  on public.templates for all
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

-- Generic starter templates. No company claims, projects, or contact
-- details invented — bodies are intentionally blank scaffolding.
insert into public.templates (name, subject, body, created_by)
select v.name, v.subject, v.body, null
from (values
  ('General Business Inquiry', 'Following up on your inquiry', 'Hello,' || E'\n\n' || 'Thank you for reaching out to EcoStruct Dynamics Limited.' || E'\n\n' || E'\n\n' || 'Kind regards,'),
  ('Partnership', 'Partnership opportunity with EcoStruct Dynamics Limited', 'Hello,' || E'\n\n' || 'We would like to explore a potential partnership.' || E'\n\n' || E'\n\n' || 'Kind regards,'),
  ('Quotation', 'Quotation request', 'Hello,' || E'\n\n' || 'Please find our response to your quotation request below.' || E'\n\n' || E'\n\n' || 'Kind regards,'),
  ('Meeting Confirmation', 'Confirming our meeting', 'Hello,' || E'\n\n' || 'This confirms our upcoming meeting.' || E'\n\n' || E'\n\n' || 'Kind regards,'),
  ('Follow-up', 'Following up', 'Hello,' || E'\n\n' || 'I wanted to follow up on our previous conversation.' || E'\n\n' || E'\n\n' || 'Kind regards,'),
  ('Thank You', 'Thank you', 'Hello,' || E'\n\n' || 'Thank you for your time.' || E'\n\n' || E'\n\n' || 'Kind regards,')
) as v(name, subject, body)
where not exists (select 1 from public.templates where templates.name = v.name);

-- ============================================================================
-- email_logs
-- Audit trail for sends. Message bodies are deliberately NOT stored here —
-- only what's needed to audit who sent what, to whom, when, and whether it
-- succeeded. Reduces the amount of sensitive data at rest.
-- ============================================================================
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users(id),
  sender_id uuid references public.senders(id),
  to_addresses text[] not null,
  cc_addresses text[] not null default '{}',
  bcc_addresses text[] not null default '{}',
  subject text not null,
  resend_message_id text,
  status text not null check (status in ('queued', 'sent', 'failed')),
  error_message text,
  idempotency_key text unique,
  created_at timestamptz not null default now()
);

create index if not exists email_logs_admin_created_idx
  on public.email_logs (admin_user_id, created_at desc);

alter table public.email_logs enable row level security;

create policy "active admins can read email logs"
  on public.email_logs for select
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );

create policy "active admins can insert email logs"
  on public.email_logs for insert
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.id = auth.uid() and admin_users.is_active = true
    )
  );
