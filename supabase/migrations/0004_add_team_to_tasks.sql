-- Add team field to tasks table
-- Allows filtering tasks by team (tech, logistics, sponsorship, outreach)

alter table public.tasks 
add column if not exists team text check (team in ('tech', 'logistics', 'sponsorship', 'outreach'));

comment on column public.tasks.team is 'Team assignment for the task. Used to filter tasks by team workspace.';

-- Index for efficient team-scoped queries
create index if not exists tasks_team_idx on public.tasks (team) where team is not null;
