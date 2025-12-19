-- Storage bucket policies for team-documents
-- TODO: Re-implement storage RLS policies (see ISSUE_storage_rls_policies.md)
-- 
-- IMPORTANT: Create the 'team-documents' bucket in Supabase Dashboard first:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named 'team-documents'
-- 3. Set it to private (not public)
-- 4. After running migration 0007_drop_storage_rls_policies.sql, configure bucket-level policies:
--    - In bucket Settings → Policies, add policies for authenticated users to upload/read/delete
--    - OR temporarily enable "Public bucket" (less secure but works immediately)
-- 
-- NOTE: Storage policies are currently disabled due to RLS policy conflicts.
-- The bucket should be set to allow authenticated users to access it via bucket policies
-- in the Supabase Dashboard until proper RLS policies can be implemented.

-- Storage policies disabled temporarily - they were causing RLS violations
-- Will be re-implemented after fixing the policy structure

/*
-- Storage policy: Users can upload files for orgs they are members of
CREATE POLICY IF NOT EXISTS "Org members can upload team documents"
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

-- Storage policy: Users can read files for orgs they are members of
CREATE POLICY IF NOT EXISTS "Org members can read team documents"
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

-- Storage policy: Users can delete files for orgs they are members of
CREATE POLICY IF NOT EXISTS "Org members can delete team documents"
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
