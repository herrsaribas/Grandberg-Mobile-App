/*
  # Fix categories RLS policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new comprehensive policies for admin users and public access
    - Ensure proper role checks using auth.jwt()

  2. Security
    - Admin users can perform all operations
    - Public users can only view active categories
*/

-- First remove any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin users can create categories" ON categories;
DROP POLICY IF EXISTS "Enable all actions for admin users" ON categories;
DROP POLICY IF EXISTS "Enable read access for active categories" ON categories;

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create comprehensive admin policy
CREATE POLICY "Enable all actions for admin users" ON categories
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create public read policy for active categories
CREATE POLICY "Enable read access for active categories" ON categories
  FOR SELECT
  TO public
  USING (is_active = true);