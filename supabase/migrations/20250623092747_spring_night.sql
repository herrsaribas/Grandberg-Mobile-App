/*
  # Fix order_items admin policies

  1. Changes
    - Drop existing admin policies if they exist to avoid conflicts
    - Create new admin policies for order_items table
    
  2. Security
    - Admin users can perform all operations on order_items
    - Ensures no duplicate policy errors
*/

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admin users can update any order items" ON order_items;
DROP POLICY IF EXISTS "Admin users can insert any order items" ON order_items;
DROP POLICY IF EXISTS "Admin users can delete any order items" ON order_items;

-- Create admin policies for order_items table
CREATE POLICY "Admin users can update any order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admin users can insert any order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admin users can delete any order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);