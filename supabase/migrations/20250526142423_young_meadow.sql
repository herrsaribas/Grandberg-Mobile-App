/*
  # Fix Categories Table RLS Policies

  1. Changes
    - Drop existing RLS policies for categories table
    - Create new comprehensive RLS policies for categories table
    
  2. Security
    - Enable RLS on categories table
    - Add policies for:
      - Admin users can perform all operations
      - Public users can view active categories
      - Prevent non-admin users from modifying categories
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Admin users can create categories" ON categories;
DROP POLICY IF EXISTS "Admin users can delete categories" ON categories;
DROP POLICY IF EXISTS "Admin users can update categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create new comprehensive policies

-- Admin users can do anything
CREATE POLICY "Enable all actions for admin users" ON categories
  FOR ALL
  TO public
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Anyone can view active categories
CREATE POLICY "Enable read access for active categories" ON categories
  FOR SELECT
  TO public
  USING (is_active = true);