-- Event people table for storing volunteers, mentors, judges, sponsors, and partners
-- Organizers are stored in org_members, this table is for other event participants

create table if not exists public.event_people (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  person_type text not null check (person_type in ('volunteer', 'mentor', 'judge', 'sponsor', 'partner')),
  full_name text not null,
  email text,
  phone text,
  company text,
  role_title text,
  bio text,
  skills text[], -- Array of skills/tags
  notes text,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.event_people is 'Non-organizer event participants: volunteers, mentors, judges, sponsors, and partners associated with an organization.';

comment on column public.event_people.person_type is 'Type of person: volunteer, mentor, judge, sponsor, or partner.';
comment on column public.event_people.skills is 'Array of skills, tracks, or tags associated with this person.';

-- Indexes for efficient queries
create index if not exists event_people_org_type_idx on public.event_people (org_id, person_type);
create index if not exists event_people_type_idx on public.event_people (person_type);
create index if not exists event_people_org_idx on public.event_people (org_id);

-- Enable Row Level Security
alter table public.event_people enable row level security;

-- RLS Policies
-- Org members can read all event people for their org
create policy "Event people are readable by org members"
  on public.event_people
  for select
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = event_people.org_id
        and m.user_id = auth.uid()
    )
  );

-- Org members can create event people
create policy "Org members can create event people"
  on public.event_people
  for insert
  with check (
    exists (
      select 1
      from public.org_members m
      where m.org_id = event_people.org_id
        and m.user_id = auth.uid()
    )
    and created_by = auth.uid()
  );

-- Org members can update event people
create policy "Org members can update event people"
  on public.event_people
  for update
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = event_people.org_id
        and m.user_id = auth.uid()
    )
  );

-- Org members can delete event people
create policy "Org members can delete event people"
  on public.event_people
  for delete
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = event_people.org_id
        and m.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
create or replace function update_event_people_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger event_people_updated_at
  before update on public.event_people
  for each row
  execute function update_event_people_updated_at();
