-- Temporarily disable RLS on all tables for debugging
-- WARNING: This removes security restrictions. Only use for development/debugging.

-- Disable RLS on all tables
alter table public.organizations disable row level security;
alter table public.profiles disable row level security;
alter table public.org_members disable row level security;
alter table public.tasks disable row level security;
alter table public.team_resources disable row level security;

comment on table public.organizations is 'RLS temporarily disabled for debugging';
comment on table public.profiles is 'RLS temporarily disabled for debugging';
comment on table public.org_members is 'RLS temporarily disabled for debugging';
comment on table public.tasks is 'RLS temporarily disabled for debugging';
comment on table public.team_resources is 'RLS temporarily disabled for debugging';
