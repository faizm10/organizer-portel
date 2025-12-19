-- Team resources table for storing links and document metadata
-- Documents are stored in Supabase Storage, links are stored as URLs

create table if not exists public.team_resources (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  team text not null check (team in ('tech', 'logistics', 'sponsorship', 'outreach')),
  title text not null,
  description text,
  resource_type text not null check (resource_type in ('document', 'link', 'guide', 'other')),
  -- For documents: path in storage bucket (e.g., 'team-documents/org_id/team/filename.pdf')
  -- For links: the URL
  url text not null,
  -- Storage path (null for links, set for documents)
  storage_path text,
  -- File metadata (for documents)
  file_name text,
  file_size bigint,
  file_type text,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.team_resources is 'Resources (documents and links) associated with teams within an organization. Documents are stored in Supabase Storage.';

comment on column public.team_resources.team is 'Team that this resource belongs to (tech, logistics, sponsorship, outreach).';
comment on column public.team_resources.resource_type is 'Type of resource: document (stored in storage), link (external URL), guide, or other.';
comment on column public.team_resources.url is 'For links: the external URL. For documents: the public URL to access the file in storage.';
comment on column public.team_resources.storage_path is 'For documents: the path within the storage bucket. Null for links.';

-- Indexes for efficient queries
create index if not exists team_resources_org_team_idx on public.team_resources (org_id, team);
create index if not exists team_resources_team_idx on public.team_resources (team);

-- Enable Row Level Security
alter table public.team_resources enable row level security;

-- RLS Policies

-- Users can read resources for orgs they are members of
create policy "Team resources are readable by org members"
  on public.team_resources
  for select
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = team_resources.org_id
        and m.user_id = auth.uid()
    )
  );

-- Users can insert resources for orgs they are members of
create policy "Org members can create team resources"
  on public.team_resources
  for insert
  with check (
    exists (
      select 1
      from public.org_members m
      where m.org_id = team_resources.org_id
        and m.user_id = auth.uid()
    )
    and created_by = auth.uid()
  );

-- Users can update resources they created (or if they're org members - adjust as needed)
create policy "Org members can update team resources"
  on public.team_resources
  for update
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = team_resources.org_id
        and m.user_id = auth.uid()
    )
  );

-- Users can delete resources they created (or if they're org members - adjust as needed)
create policy "Org members can delete team resources"
  on public.team_resources
  for delete
  using (
    exists (
      select 1
      from public.org_members m
      where m.org_id = team_resources.org_id
        and m.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
create or replace function update_team_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger team_resources_updated_at
  before update on public.team_resources
  for each row
  execute function update_team_resources_updated_at();

-- Storage bucket setup
-- Note: Bucket creation must be done manually in Supabase Dashboard or via API
-- This migration sets up storage policies for the 'team-documents' bucket

-- Storage policies are managed via SQL functions in Supabase
-- The bucket should be created with:
-- - Name: team-documents
-- - Public: false (private bucket, uses signed URLs or RLS)
-- - File size limit: adjust as needed
-- - Allowed MIME types: adjust as needed

-- Storage policy: Users can upload files for orgs they are members of
-- Note: Storage policies require the bucket to exist first
-- Run this after creating the bucket in Supabase Dashboard

-- Example storage policy (run after bucket creation):
/*
CREATE POLICY "Org members can upload team documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text
    FROM public.organizations o
    INNER JOIN public.org_members om ON om.org_id = o.id
    WHERE om.user_id = auth.uid()
  )
);

CREATE POLICY "Org members can read team documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'team-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text
    FROM public.organizations o
    INNER JOIN public.org_members om ON om.org_id = o.id
    WHERE om.user_id = auth.uid()
  )
);

CREATE POLICY "Org members can delete team documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text
    FROM public.organizations o
    INNER JOIN public.org_members om ON om.org_id = o.id
    WHERE om.user_id = auth.uid()
  )
);
*/
