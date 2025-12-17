-- Tasks table for hackathon organizing workflow
-- Part of Tasks MVP (#8), sub-issue #9

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text check (priority in ('low', 'medium', 'high')),
  due_date timestamptz,
  created_by uuid not null references auth.users (id) on delete set null,
  assigned_to uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.tasks is 'Tasks for hackathon organizing, scoped to organizations.';

-- Index for efficient org-scoped queries
create index if not exists tasks_org_id_idx on public.tasks (org_id);
create index if not exists tasks_assigned_to_idx on public.tasks (assigned_to);
create index if not exists tasks_status_idx on public.tasks (status);

-- Trigger to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger update_tasks_updated_at
before update on public.tasks
for each row
execute function public.update_updated_at_column();

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- RLS Policies

-- Org members can read tasks for their organization
create policy "Org members can read tasks for their org"
  on public.tasks
  for select
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = tasks.org_id
        and m.user_id = auth.uid()
    )
  );

-- Org members can create tasks in their organization
create policy "Org members can create tasks"
  on public.tasks
  for insert
  with check (
    exists (
      select 1
      from public.org_members m
      where m.org_id = tasks.org_id
        and m.user_id = auth.uid()
    )
    and created_by = auth.uid()
  );

-- Org members can update tasks in their organization
-- (Simplified: all org members can update. Can be tightened later to creator/assignee/leads only)
create policy "Org members can update tasks"
  on public.tasks
  for update
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = tasks.org_id
        and m.user_id = auth.uid()
    )
  );

-- Org members can delete tasks in their organization
-- (Simplified: all org members can delete. Can be tightened later to creator/leads only)
create policy "Org members can delete tasks"
  on public.tasks
  for delete
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = tasks.org_id
        and m.user_id = auth.uid()
    )
  );


