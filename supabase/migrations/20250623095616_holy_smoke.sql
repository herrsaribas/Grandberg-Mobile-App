/*
  # Fix Orders-Users Relationship

  1. Database Changes
    - Clean up any orphaned orders that reference non-existent users
    - Ensure all users referenced in orders exist in the public.users table
    - Add foreign key constraint between orders.user_id and users.id

  2. Data Integrity
    - Remove orders that reference users not in public.users table
    - This ensures referential integrity before adding the constraint
*/

-- First, let's identify and remove any orders that reference users not in the public.users table
DELETE FROM orders 
WHERE user_id NOT IN (
  SELECT id FROM users
);

-- Also clean up any order_items that might be orphaned due to the above deletion
DELETE FROM order_items 
WHERE order_id NOT IN (
  SELECT id FROM orders
);

-- Now add the foreign key constraint between orders.user_id and users.id
DO $$
BEGIN
  -- Check if the foreign key constraint doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_user_id_users_fkey' 
    AND table_name = 'orders'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE orders 
    ADD CONSTRAINT orders_user_id_users_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

-- Update the order service query to use the correct relationship
-- This is handled in the application code, but we ensure the constraint exists