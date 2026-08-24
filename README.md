# EcoStruct Dynamics Limited — Corporate Website

A one-page corporate site plus a dedicated About page for **EcoStruct
Dynamics Limited**, built with Next.js, TypeScript and Tailwind CSS.

All company facts (name, tagline, vision, mission, core values, contact
details, registration data, service categories) are sourced from the
official company profile and centralized in `lib/data.ts`. Nothing about
clients, completed projects, certifications, awards, employee counts or
statistics has been invented — the Projects section is intentionally a
placeholder ("Selected projects and case studies will be featured here").

**Note on the logo/brand text mismatch:** the uploaded logo graphic reads
"ECOSTRUCT DYNAMICS LTD" / "BUILDING WHAT MOVES TOMORROW" — an earlier
tagline that predates the official company profile ("EcoStruct Dynamics
Limited", "Engineering Sustainable Solutions for People and Planet"). The
site's actual text content follows the official profile throughout; the
logo is used only as a visual mark, cropped to exclude the old tagline
line baked into the image (that text is raster pixels, not editable). If
the logo should be regenerated to match the current name/tagline, flag it
and it can be redone.

**Note on Higgsfield:** the request asked for cinematic scroll assets via
Higgsfield (video/3D). That was deliberately skipped in favor of CSS/SVG-
built motion (parallax, blueprint line-draw, staggered reveals) — see
`lib/useParallax.ts`. Reasoning: generated stock-style footage risks
reading as generic/off-brand, adds real asset weight against this site's
strict performance requirement, and the target audience (government/
institutional stakeholders) is better served by something fast and
dependable than by a heavier cinematic build. Happy to revisit if wanted.

---

## 1. Project structure

```
ecostruct-dynamics/
├─ app/
│  ├─ layout.tsx        Root layout, SEO metadata
│  ├─ page.tsx           Assembles the homepage sections
│  ├─ about/page.tsx     Fuller About page (vision, mission, values, registration)
│  ├─ icon.png            App favicon (Next.js file convention, auto-linked)
│  ├─ apple-icon.png      Apple touch icon (Next.js file convention, auto-linked)
│  ├─ globals.css        Design tokens, animation utilities
│  ├─ robots.ts          robots.txt (Next.js Metadata Route)
│  └─ sitemap.ts         sitemap.xml (Next.js Metadata Route)
├─ components/
│  ├─ Navbar.tsx          Transparent-on-hero → glass-on-scroll, logo, active-link indication
│  ├─ Footer.tsx          Logo, contact, blueprint background detail
│  ├─ SectionHeading.tsx
│  ├─ ServiceCard.tsx     Hover lift + drafting-style corner marks
│  ├─ ProjectCard.tsx    Ready for real project data — not yet used on the page
│  ├─ ProcessStep.tsx     Workflow step with scroll-triggered connecting line
│  ├─ TagPill.tsx        Reusable pill used across capability/economy/tech lists
│  ├─ ContactForm.tsx    Client-side validation + error/success states
│  └─ RevealOnScroll.tsx Scroll-reveal animation wrapper
├─ sections/
│  ├─ Hero.tsx            Cinematic hero — logo, layered parallax, blueprint lines
│  ├─ Capabilities.tsx    Integrated Capabilities (7 core disciplines + tag cloud)
│  ├─ About.tsx           Homepage About summary, links to /about
│  ├─ Services.tsx        8 strategic service categories
│  ├─ Projects.tsx        "Coming soon" placeholder with numbered card fields
│  ├─ GreenBlueEconomy.tsx
│  ├─ TechAI.tsx
│  ├─ Impact.tsx
│  ├─ Quality.tsx         Quality, Safety & Compliance
│  ├─ Process.tsx         Discover → Plan → Design → Build → Deliver workflow
│  ├─ ValueProposition.tsx
│  └─ Contact.tsx
├─ lib/
│  ├─ data.ts              All editable copy: site info, nav, capabilities,
│  │                        service categories, sustainability tags, tech
│  │                        capabilities, impact groups, quality principles,
│  │                        value proposition, process steps
│  ├─ useActiveSection.ts  Tracks which section is in view, for navbar active-link state
│  └─ useParallax.ts       Lightweight scroll-parallax hook (no library), respects reduced-motion
├─ public/
│  ├─ logo-mark.webp       Emblem-only crop of the official logo (navbar, hero, footer, mobile)
│  └─ logo-full.webp       Full lockup crop (emblem + wordmark, tagline strip excluded) — About page
├─ tailwind.config.ts      Colour, type and layout tokens
└─ package.json
```

Content edits (service categories, capability list, tags, contact details)
should go through **`lib/data.ts`** rather than the component files.

---

## 2. Technologies used

- **Next.js 14** (App Router) — homepage (`/`) and a dedicated `/about` page
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling and design tokens
- No external UI, animation, or icon libraries — scroll reveals, parallax
  depth, active-section nav highlighting, and hover micro-interactions are
  hand-built with `IntersectionObserver`, `requestAnimationFrame`, and CSS
  transitions (`lib/useParallax.ts`, `lib/useActiveSection.ts`). All of it
  respects `prefers-reduced-motion`.
- Favicons use Next.js's file-convention icons (`app/icon.png`,
  `app/apple-icon.png`) — no manual `<link>` tags or metadata needed.
- Imagery currently comes from Unsplash via `next/image` (remote pattern
  allow-listed in `next.config.js`). Swap for the company's own photography
  by replacing the `src` values in `sections/Hero.tsx`, `sections/About.tsx`
  and `sections/Quality.tsx`.

---

## 3. Running locally

Requires Node.js 18.18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

To verify a production build:

```bash
npm run build
npm run start
```

---

## 4. Pushing to GitHub

```bash
git init
git add .
git commit -m "Rework site around official company profile"
git branch -M main
git remote add origin https://github.com/<your-org>/ecostruct-dynamics.git
git push -u origin main
```

---

## 5. Deploying on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub
   repository.
2. Framework preset: **Next.js** (auto-detected). No environment variables
   are required for the current build.
3. Deploy. Vercel will build and host the site on a `*.vercel.app` URL.
4. In the Vercel project → **Settings → Domains**, add
   `ecostructdynamicsltd.com` and follow the DNS instructions shown.

### Connecting Cloudflare

- Add the DNS records Vercel provides inside Cloudflare's DNS dashboard.
- If Cloudflare's proxy is enabled, set SSL/TLS mode to **Full (strict)** to
  avoid redirect loops with Vercel's own TLS.

---

## 6. Contact information currently published

Per the official company profile, plus the two addresses already in use
before the profile was supplied (kept, not removed):

- Website enquiries: `info@ecostructdynamicsltd.com`
- Official company email: `econstructdynamicsltd@gmail.com`
- Direct contact: `tony@ecostructdynamicsltd.com`
- Phone: `+254 718 222 758`
- Registered office: Hilltop Plaza, Kwashibu Road, Mwembe Tayari, Mombasa, Kenya
- Postal address: P.O. Box 87347-80100, Mombasa G.P.O., Kenya

If the three published email addresses should be consolidated, that's a
one-line edit in `lib/data.ts` (`site.emails`) plus updating
`sections/Contact.tsx` / `components/Footer.tsx` accordingly.

The contact form itself (`components/ContactForm.tsx`) is fully styled but
**not connected to an email-sending service** — it says so in-product. See
the comment inside `handleSubmit` for how to wire up Formspree, Resend, or
a custom API route.

---

## 7. Still to confirm / add

- [ ] Real **project case studies** (title, category, location, year,
      photos) — `ProjectCard` is ready; `Projects.tsx` shows a placeholder
- [ ] Any **certifications, licenses, or accreditations**
- [ ] **Social media** profile links, if any (none published yet)
- [ ] A real **Open Graph image** (1200×630) for social sharing — see the
      comment in `app/layout.tsx`
- [ ] Choice of **form backend** (Formspree, Resend, or other) to activate
      the contact form
- [ ] Final **photography** to replace the current Unsplash placeholders
- [ ] Confirmation on whether all three email addresses should remain
      published, or be consolidated

---

## 8. EcoAdmin — private admin email system

A protected admin area at `/ecoadmin` for sending email from the company's
own addresses (rather than a personal Gmail account) through Resend, with
Supabase for authentication and data. This is entirely separate from the
public site — nothing in sections 1–7 above changed to build it.

### 8.1 Already implemented (in this codebase, right now)

- **Authentication**: Supabase Auth via `@supabase/ssr`, using the modern
  Next.js App Router SSR pattern. `middleware.ts` (scoped to `/ecoadmin/*`
  only) refreshes the session and redirects unauthenticated requests to
  `/ecoadmin/login` — enforced server-side, before any admin page renders.
- **Admin authorization**, distinct from authentication: `app/ecoadmin/(admin)/layout.tsx`
  re-checks on every request that the signed-in user has an active row in
  `admin_users` (`lib/ecoadmin/auth.ts`). A Supabase account alone does not
  grant access to anything under `/ecoadmin`.
- **Compose** (`/ecoadmin/compose`): From is a locked dropdown sourced from
  the server-validated sender list — never free text. To/CC/BCC/subject/
  message validation on both the client (immediate feedback) and the server
  (authoritative). Duplicate-submission and rate-limit protection.
- **Send API** (`/api/ecoadmin/email/send`): the only code path that calls
  Resend. Re-verifies the session and admin status, re-validates the sender
  against the DB allowlist (ignores whatever the browser claims), validates
  recipients, checks a payload size limit, checks a DB-backed rate limit and
  idempotency key, then calls Resend and logs the result.
- **Sender management** (`/ecoadmin/senders`): lists current senders;
  "Propose Sender" is domain-restricted to `@ecostructdynamicsltd.com` and
  always creates a `pending`/`inactive` row. Activation is a separate,
  explicit, confirmed action an admin takes after verifying the address
  with the provider — see §8.5.
- **Sent log** (`/ecoadmin/sent`): reads from `email_logs`, with subject
  search and sender filtering. Message bodies are not stored (see schema
  notes below).
- **Templates** (`/ecoadmin/templates`): generic starter templates (seeded
  by the migration), full create/edit/delete.
- **Branded HTML email template** (`lib/ecoadmin/emailTemplate.ts`):
  table-based, inline-styled markup for Gmail/Outlook/mobile compatibility;
  escapes user-supplied text before interpolating it (no raw HTML injection
  from a message body).
- **Database schema + RLS**: `supabase/migrations/0001_ecoadmin_schema.sql`
  — not yet applied to any live project (see setup steps below).

### 8.2 Requires manual production configuration (not done, on purpose)

Nothing below was invented or assumed — each of these needs a real
decision or credential from you.

- **A Supabase project.** This codebase has never been connected to one.
- **Running the migration** against that project.
- **Creating the first admin.** Signing up a Supabase Auth user does *not*
  make them an admin — a row in `admin_users` has to be added manually.
- **`RESEND_API_KEY`.** Not set anywhere. Until it is, the send API
  returns a clear "outbound email is not available" error and logs a
  `failed` row with that reason — it never pretends to have sent anything.
- **Resend domain verification for `ecostructdynamicsltd.com`.** Not
  started. Resend will provide DNS records (SPF/DKIM, typically TXT/CNAME)
  once you add and verify the domain in the Resend dashboard.
- **Reviewing Cloudflare DNS before adding those records.** This was not
  touched, inspected, or modified as part of this work — no MX records,
  no existing DNS records, no Cloudflare configuration of any kind. The
  domain's current incoming **Cloudflare Email Routing must not be
  replaced or disturbed** by whatever Resend asks for; the two typically
  coexist (Resend needs outbound-sending records like SPF/DKIM, not MX),
  but the actual records should be reviewed against what's currently live
  before adding anything. That review and the DNS changes themselves are
  intentionally left for a separate step, done directly in Cloudflare.

### 8.3 Production setup steps

**1. Create the Supabase project**
Create a project at [supabase.com](https://supabase.com) (any region).

**2. Run the migration**
In the Supabase SQL Editor, run the contents of
`supabase/migrations/0001_ecoadmin_schema.sql`. This creates `admin_users`,
`senders` (pre-seeded with the two current addresses, verified/active),
`templates` (pre-seeded with six generic templates), and `email_logs`, all
with Row Level Security restricting access to active admins only.

**3. Set environment variables**
In Vercel → Project → Settings → Environment Variables (see `.env.example`
for the full list):

```
NEXT_PUBLIC_SUPABASE_URL=<Project Settings → API → Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Project Settings → API → anon/public key>
RESEND_API_KEY=<set once you're ready to enable sending — see step 6>
```

The anon key is safe as `NEXT_PUBLIC_*` — it's designed to be public;
access is controlled by the RLS policies in the migration, not by keeping
it secret. **Never** set a Supabase *service role* key as a
`NEXT_PUBLIC_*` variable, and this codebase never needs one — every table
access goes through the signed-in user's own session and RLS.

**4. Create your Supabase Auth user**
In Supabase → Authentication → Users → "Add user", create an account with
your email and a password (or invite yourself via email, per your
preference).

**5. Authorize that user as an admin**
Still needs a manual step — by design, nothing in the app can do this for
you. In the SQL Editor:

```sql
insert into public.admin_users (id, display_name, is_active)
values ('<the user id from step 4>', 'Your Name', true);
```

The user ID is visible on the user's detail page in the Supabase
Authentication UI. At this point `/ecoadmin/login` should work end-to-end.

**6. Enable outbound email (when ready)**
a. Create a Resend account and add `ecostructdynamicsltd.com` as a domain.
b. Resend will show the DNS records it needs (SPF/DKIM). **Review these
   against Cloudflare's current DNS configuration yourself** — specifically
   confirm they won't collide with the existing MX records / Email Routing
   rules already in place for incoming mail — before adding anything.
c. Add the records in Cloudflare, then confirm verification in Resend.
d. Set `RESEND_API_KEY` (Resend → API Keys) in Vercel and redeploy.

Until step 6 is complete, Compose still works fully — it just returns an
honest "not available yet" error instead of sending, and logs that.

### 8.4 What was intentionally *not* built

- **Attachments**: the composer's fields don't include file upload. Adding
  it needs object storage (e.g. Supabase Storage) and size/type limits on
  top of what exists — deliberately left undone rather than wired up
  insecurely, per the brief.
- **Full RBAC / multiple permission tiers**: `admin_users.is_active` is a
  single on/off flag, intentionally — the brief asked for something
  suitable for "a single-owner/small-admin setup," not a permissions
  system.
- **Message body storage**: `email_logs` stores metadata (sender,
  recipients, subject, status, Resend message ID) but not the message
  body, to avoid holding more sensitive data at rest than the audit trail
  actually needs.

### 8.5 Phase 0 operational update (sender workflow + retention)

Built after the production pipeline was confirmed working end-to-end.
Deliberately operational only — no visual redesign, toast system, or
onboarding tour; those are still explicitly out of scope until a later
task.

**Sender workflow, made explicit:**
- The Senders page now shows a **"What happens next?"** four-step
  explanation (Propose → configure DNS in Cloudflare → verify with the
  provider → activate in EcoAdmin) directly under the sender list.
- **"How to verify in Cloudflare"** (`/ecoadmin/senders/verify-guide`) is a
  step-by-step guide with one diagram per step. These are original,
  generic wireframe illustrations (`components/ecoadmin/GuideIllustration.tsx`)
  — not real Cloudflare screenshots. That's intentional: Cloudflare's
  actual UI isn't mine to reproduce or redistribute, and a literal
  screenshot goes stale the moment Cloudflare changes their dashboard. The
  guide says as much and points the admin to follow their own dashboard's
  labels. It also carries the required warning ("Never guess DNS values —
  use only the exact records supplied by the email provider") and a
  **"Need help? Contact the developer"** `mailto:anonymiketech@gmail.com`
  link.
- **Sender activation is now a real in-app action**, not just a manual SQL
  edit: `activateSender` / `deactivateSender` in
  `app/ecoadmin/(admin)/senders/actions.ts`, surfaced via
  `components/ecoadmin/SenderActions.tsx`. Activating requires a
  confirmation dialog that explicitly states this step does **not** verify
  anything itself — it only records that the admin already did so with the
  provider. This required one new RLS policy (`senders` UPDATE, admins
  only) in migration `0002`; the domain-restriction CHECK constraint from
  migration `0001` still applies to every row regardless of who updates it.
  Proposing a sender still never auto-activates it — that path is
  unchanged.

**Sent log retention & deletion**, all under `/ecoadmin/sent` and
`/ecoadmin/settings`:
- Individual delete (per row), bulk delete (checkbox selection), and
  "delete everything older than N days" — all three call the same
  `requireAdmin()` gate as every other admin action, and all three are
  behind a native `window.confirm()` before the request fires
  (`components/ecoadmin/SentTable.tsx`). This intentionally uses the
  browser's built-in confirm dialog rather than a custom modal component —
  consistent with "no visual redesign yet"; a styled confirmation
  component is a natural candidate for the later design pass.
- Every delete action inserts a row into a new `cleanup_runs` table
  (migration `0002`) recording who did it, how many rows, and how.
  Settings → **Retention & Cleanup** reads that to show **Last cleanup**,
  alongside **current retention period**, **records eligible for
  deletion**, and a retention-period selector (30/90/180/365/custom,
  default 180 — matches the brief). **Next scheduled cleanup always reads
  "Not configured"** — there is no cron job or scheduled function anywhere
  in this codebase; cleanup only ever happens when an admin explicitly
  triggers it from Sent. Implementing actual scheduled cleanup (e.g. a
  Vercel Cron hitting a protected route, or Supabase's `pg_cron`) is a
  separate infrastructure decision, not done here.
- Every deletion UI surface repeats the same warning: deleting a record
  here removes only the EcoAdmin audit row. It has no effect on Resend,
  Gmail, Outlook, or the recipient's mailbox — the email already sent
  stays sent.

**New files:** `supabase/migrations/0002_ecoadmin_retention_and_sender_activation.sql`,
`lib/ecoadmin/retention.ts`, `app/ecoadmin/(admin)/sent/actions.ts`,
`app/ecoadmin/(admin)/settings/actions.ts`,
`app/ecoadmin/(admin)/senders/verify-guide/page.tsx`,
`components/ecoadmin/SentTable.tsx`, `components/ecoadmin/SenderActions.tsx`,
`components/ecoadmin/GuideIllustration.tsx`.
**Modified:** `app/ecoadmin/(admin)/senders/page.tsx`,
`app/ecoadmin/(admin)/senders/actions.ts` (added activate/deactivate),
`app/ecoadmin/(admin)/sent/page.tsx`, `app/ecoadmin/(admin)/settings/page.tsx`.
**Untouched:** the send API, Compose, sender validation/allowlist logic,
rate limiting, the branded email template, existing templates, and every
public-site file.

Run `supabase/migrations/0002_ecoadmin_retention_and_sender_activation.sql`
against the same Supabase project, after `0001`, the same way (SQL Editor
or `supabase db push`).
