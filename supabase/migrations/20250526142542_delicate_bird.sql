/*
  # Fix Categories RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new comprehensive policies for admin access and public read
    - Ensure proper role checking using auth.jwt()

  2. Security
    - Enable RLS on categories table
    - Allow admin users full access to all operations
    - Allow public users to view active categories only
*/

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all actions for admin users" ON categories;
DROP POLICY IF EXISTS "Enable read access for active categories" ON categories;
DROP POLICY IF EXISTS "Admin users can create categories" ON categories;
DROP POLICY IF EXISTS "Admin users can update categories" ON categories;
DROP POLICY IF EXISTS "Admin users can delete categories" ON categories;

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