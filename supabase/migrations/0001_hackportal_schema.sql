-- HackPortal core schema

-- Organizations represent hackathon organizing teams or events.
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- Reserved for future subdomains, must be unique across all orgs.
  slug text unique,
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.organizations is 'HackPortal organizations / hackathon teams. Slug is reserved for future subdomain routing.';

-- Profiles mirror auth.users with additional organizer metadata.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'Per-user profile data linked 1:1 with auth.users.';

-- Organization membership and roles.
create table if not exists public.org_members (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (org_id, user_id)
);

comment on table public.org_members is 'Membership and role mapping between users and organizations.';

-- Enable Row Level Security
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.org_members enable row level security;

-- RLS Policies

-- Users can read organizations they are members of.
create policy "Organizations are readable by members only"
  on public.organizations
  for select
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = organizations.id
        and m.user_id = auth.uid()
    )
  );

-- Users can read their own profile.
create policy "Users can read their own profile"
  on public.profiles
  for select
  using (id = auth.uid());

-- Users can read their own org_members rows.
create policy "Users can read their own org memberships"
  on public.org_members
  for select
  using (user_id = auth.uid());

-- NOTE: Insert/update/delete policies for these tables should be added
-- in a later migration once we design invitations and org creation flows.


