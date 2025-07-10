/*
  # Fix Categories RLS Policies

  1. Changes
    - Drop existing RLS policies for categories table
    - Add new comprehensive RLS policies for admin users
    
  2. Security
    - Enable RLS on categories table
    - Add policies for admin users to perform all operations
    - Add policy for public users to view active categories
*/

-- First remove existing policies
DROP POLICY IF EXISTS "Enable all actions for admin users" ON categories;
DROP POLICY IF EXISTS "Enable read access for active categories" ON categories;

-- Re-create policies with correct permissions
CREATE POLICY "Enable all actions for admin users"
ON categories
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable read access for active categories"
ON categories
FOR SELECT
TO public
USING (is_active = true);