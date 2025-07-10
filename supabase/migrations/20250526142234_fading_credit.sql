/*
  # Fix Categories RLS Policies

  1. Changes
    - Drop existing RLS policies for categories table
    - Create new, more specific policies for each operation type (SELECT, INSERT, UPDATE, DELETE)
    
  2. Security
    - Enable RLS on categories table (ensuring it's enabled)
    - Add separate policies for:
      - Anyone can view active categories
      - Admin users can create categories
      - Admin users can update categories
      - Admin users can delete categories
*/

-- First remove existing policies
DROP POLICY IF EXISTS "Admin users can manage categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create specific policies for each operation
CREATE POLICY "Anyone can view active categories"
ON categories
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admin users can create categories"
ON categories
FOR INSERT
TO public
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admin users can update categories"
ON categories
FOR UPDATE
TO public
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admin users can delete categories"
ON categories
FOR DELETE
TO public
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);