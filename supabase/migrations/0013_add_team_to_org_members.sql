-- Add team field to org_members table
-- This allows organizers to be assigned to specific teams (tech, logistics, sponsorship, outreach)

alter table public.org_members
add column if not exists team text check (team in ('tech', 'logistics', 'sponsorship', 'outreach'));

comment on column public.org_members.team is 'Team assignment for the organizer. Used to filter organizers by team workspace. Null means no specific team assignment.';

create index if not exists org_members_team_idx on public.org_members (team) where team is not null;
create index if not exists org_members_org_team_idx on public.org_members (org_id, team) where team is not null;
