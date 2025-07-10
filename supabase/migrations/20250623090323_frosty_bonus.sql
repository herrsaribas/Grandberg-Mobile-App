/*
  # Add admin policies for order_items table

  1. Security Changes
    - Add RLS policies to allow admin users to update, insert, and delete order items
    - Uses auth.jwt() function instead of jwt() for proper Supabase authentication
    
  2. Policies Added
    - Admin users can update any order items
    - Admin users can insert any order items  
    - Admin users can delete any order items
*/

-- Add admin policies for order_items table
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