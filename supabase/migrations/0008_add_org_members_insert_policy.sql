-- Add INSERT policy for org_members table
-- This allows authenticated users to be added to organizations.
-- For now, we allow any authenticated user to insert memberships.
-- TODO: Tighten this policy later to only allow org leads/admins to add members,
-- or implement an invitation system.

-- Allow authenticated users to insert org_members rows
-- This is needed so users can be added to organizations via the application
create policy "Authenticated users can insert org memberships"
  on public.org_members
  for insert
  to authenticated
  with check (true);

comment on policy "Authenticated users can insert org memberships" on public.org_members is 
  'Allows authenticated users to add memberships. This is a temporary permissive policy for setup. Should be restricted to org admins/leads or replaced with an invitation system.';
