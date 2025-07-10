/*
  # Fix order_items RLS policies

  1. Changes
    - Drop existing RLS policies for order_items table
    - Create new, more specific policies for different operations
    - Ensure admin users have full access
    
  2. Security
    - Enable RLS on order_items table
    - Add policies for:
      - Admin users (full access)
      - Regular users (read/write their own orders)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin users can do anything with order items" ON order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

-- Create new policies
CREATE POLICY "Admin users have full access to order items"
ON order_items
FOR ALL
TO public
USING (
  (auth.jwt() ->> 'role'::text) = 'admin'::text
)
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'admin'::text
);

CREATE POLICY "Users can view their own order items"
ON order_items
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own order items"
ON order_items
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own order items"
ON order_items
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);