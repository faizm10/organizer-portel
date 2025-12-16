## HackPortal – Organizer Portal (Next.js + Supabase)

HackPortal is a multi-tenant hackathon organizer portal built on top of the
Supabase password-auth starter for Next.js (App Router).

This document focuses on how authentication and organization selection work
today. **Subdomain-based routing is not enabled yet**; see below for how the
schema is prepared for it.

### Environment variables

Create a `.env.local` file in the `frontend` directory with at least:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY="your-anon-or-publishable-key"
```

These are the same values you see in your Supabase project settings under
API → Project URL and `anon` (or publishable) key.

### Authentication flow

- Supabase password-based auth is used via the existing forms under `app/auth/*`.
- Server-side code uses `@/lib/supabase/server` to create an SSR-safe client.
- The helper `requireUser()` in `lib/auth.ts`:
  - calls `supabase.auth.getUser()` on the server
  - redirects to `/auth/login` if there is no authenticated user
  - returns `{ id, email }` for the current user otherwise

Use `requireUser()` at the top of any server component that should only be
reachable by authenticated users.

### Organization model & selection (no subdomains yet)

The Supabase migration in `supabase/migrations/0001_hackportal_schema.sql`
creates three core tables:

- `organizations` – one row per hackathon org / event (with a unique `slug`
  reserved for future subdomains)
- `profiles` – 1:1 with `auth.users`
- `org_members` – mapping of `user_id` to `org_id` plus a `role` string

Row Level Security (RLS) policies ensure that:

- users can only see organizations they are a member of
- users can only read their own profile row
- users can only read `org_members` rows where `user_id = auth.uid()`

#### How org selection works

We deliberately **do not** use subdomains yet. Instead:

- After login, protected app routes call:
  - `requireUser()` from `lib/auth.ts`
  - `requireSelectedOrg(user)` from `lib/org.ts`
- `requireSelectedOrg`:
  - loads all memberships for the user from `org_members`
  - if there are **no orgs**, redirects to `/join`
  - if there is **one org**, auto-selects it and stores its `org_id` in a
    signed, HTTP-only cookie (`hp_org_id`)
  - if there are **multiple orgs**, checks the cookie; if none is set or the
    id is invalid, redirects to `/select-org`

The selected organization id is stored in the `hp_org_id` cookie so that
server components (like `/dashboard`) can read it without relying on client
state or query strings.

### Routes

- `/auth/*` – existing Supabase auth pages (login, sign-up, etc.)
- `/select-org` – lets a multi-org user pick which organization to work in
- `/join` – placeholder page when a user does not yet belong to any org
- `/dashboard` – main app surface:
  - guarded by `requireUser` + `requireSelectedOrg`
  - shows organization name, user email, and their role in that org
  - includes simple nav placeholders for **Tasks**, **Announcements**,
    and **People**

### Future: subdomain support

The `organizations.slug` column is reserved for future subdomain routing
(`{slug}.hackportal.app`). Because the selected org is already tracked by id
and enforced via RLS, we can later:

- derive the current org from the request host instead of the `hp_org_id`
  cookie, and
- keep the same `org_members` checks and `requireSelectedOrg` logic with
  minimal refactoring.

