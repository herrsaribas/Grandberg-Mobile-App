/*
  # Add policy for admin users to create categories (if not exists)

  1. Security Changes
    - Add RLS policy to allow admin users to create categories
    - Only if the policy doesn't already exist
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Admin users can create categories'
  ) THEN
    CREATE POLICY "Admin users can create categories"
    ON categories
    FOR INSERT
    TO public
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
  END IF;
END $$;