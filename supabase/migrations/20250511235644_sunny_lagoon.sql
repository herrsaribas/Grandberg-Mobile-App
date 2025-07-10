/*
  # Add user profile creation policy

  1. Security Changes
    - Add RLS policy to allow authenticated users to insert their own profile data
    - Policy ensures users can only create a profile with their own auth.uid()
    
  2. Notes
    - This policy complements existing policies for reading and updating own data
    - The policy specifically targets the initial profile creation during signup
*/

CREATE POLICY "Users can create their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);