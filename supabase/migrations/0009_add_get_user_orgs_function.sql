-- Create a SECURITY DEFINER function to bypass RLS recursion
-- This function will be used to get user organizations without triggering RLS recursion

create or replace function public.get_user_organizations(p_user_id uuid)
returns table (
  org_id uuid,
  role text,
  team text,
  org_name text,
  org_slug text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select 
    om.org_id,
    om.role,
    om.team,
    o.name as org_name,
    o.slug as org_slug
  from public.org_members om
  inner join public.organizations o on o.id = om.org_id
  where om.user_id = p_user_id;
end;
$$;

comment on function public.get_user_organizations(uuid) is 
  'Returns organization memberships for a user. Uses SECURITY DEFINER to bypass RLS recursion issues.';

-- Grant execute permission to authenticated users
grant execute on function public.get_user_organizations(uuid) to authenticated;
