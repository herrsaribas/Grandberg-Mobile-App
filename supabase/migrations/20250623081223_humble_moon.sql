/*
  # Add sector field to users table

  1. Changes
    - Add `sector` column to users table
    - Update existing policies to handle the new field
    
  2. Security
    - Maintain existing RLS policies
    - Allow users to set their own sector during registration
*/

-- Add sector column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sector text;

-- Update the existing policy to allow sector updates
-- No need to create new policies as existing ones cover this field