-- Script to check and add organization membership for a user
-- Replace the user_id and org_id values as needed

-- Step 1: Check if user has any memberships
SELECT 
  om.org_id,
  om.user_id,
  om.role,
  o.name as org_name
FROM public.org_members om
LEFT JOIN public.organizations o ON o.id = om.org_id
WHERE om.user_id = '09295a4a-b9d4-4f91-8950-1635ec99014b';

-- Step 2: Check what organizations exist
SELECT id, name, slug 
FROM public.organizations;

-- Step 3: Add membership (using the org ID from previous conversations)
-- This will add you to the organization with 'lead' role
INSERT INTO public.org_members (org_id, user_id, role)
VALUES ('b1af9a78-87e0-4cc0-b65e-df66ff87f2c9', '09295a4a-b9d4-4f91-8950-1635ec99014b', 'lead')
ON CONFLICT (org_id, user_id) DO UPDATE SET role = EXCLUDED.role;

-- Step 4: Verify the membership was added
SELECT 
  om.org_id,
  om.user_id,
  om.role,
  o.name as org_name,
  o.slug as org_slug
FROM public.org_members om
LEFT JOIN public.organizations o ON o.id = om.org_id
WHERE om.user_id = '09295a4a-b9d4-4f91-8950-1635ec99014b';
