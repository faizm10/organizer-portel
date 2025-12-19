-- Drop storage RLS policies that were causing upload failures
-- These policies are disabled until proper implementation (see ISSUE_storage_rls_policies.md)
--
-- IMPORTANT: After running this migration, configure bucket-level access in Supabase Dashboard:
-- 1. Go to Storage → team-documents bucket → Policies
-- 2. Add bucket policy to allow authenticated users:
--    - Select: "Allow authenticated users to upload files"
--    - Select: "Allow authenticated users to download files"  
--    - Delete: "Allow authenticated users to delete files"
-- 
-- OR temporarily make the bucket public (Settings → toggle "Public bucket")
-- Note: Public bucket is less secure but will work immediately. Bucket policies are preferred.

-- Drop the policies if they exist
DROP POLICY IF EXISTS "Org members can upload team documents" ON storage.objects;
DROP POLICY IF EXISTS "Org members can read team documents" ON storage.objects;
DROP POLICY IF EXISTS "Org members can delete team documents" ON storage.objects;
