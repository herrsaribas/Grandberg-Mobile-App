/*
  # Set up authentication schema

  1. Enable auth schema and create necessary tables
  2. Create RLS policies for user data protection
  3. Add custom user metadata fields for:
    - Full name
    - Company name
    - Phone number
    - Tax ID
    - Address

  Note: Most of the auth schema is automatically created by Supabase.
  We just need to add our custom metadata fields and policies.
*/

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Add custom metadata fields
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS raw_user_meta_data jsonb;

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';

-- Create a secure function to update user metadata
CREATE OR REPLACE FUNCTION auth.update_user_metadata(
  user_id uuid,
  metadata jsonb
)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = metadata
  WHERE id = user_id
  AND (
    auth.uid() = user_id -- User can update their own metadata
    OR auth.jwt()->>'role' = 'admin' -- Admin can update any user's metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;