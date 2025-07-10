/*
  # Add test users

  1. Creates two users:
    - Admin user (admin@example.com / admin123)
    - Regular user (user@example.com / user123)
  
  2. Creates corresponding user profiles in public.users table
*/

-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ad3d1e2f-5b3c-4d3e-9a1b-2c3d4e5f6a7b',
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"], "role": "admin"}',
  '{"full_name": "Admin User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create regular user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'bd4e2f3f-6c4d-5e4f-ab2c-3d4e5f6a7b8c',
  'authenticated',
  'authenticated',
  'user@example.com',
  crypt('user123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Add user profiles
INSERT INTO public.users (
  id,
  email,
  full_name,
  company_name,
  phone,
  tax_id,
  address
) VALUES 
(
  'ad3d1e2f-5b3c-4d3e-9a1b-2c3d4e5f6a7b',
  'admin@example.com',
  'Admin User',
  'Admin Company GmbH',
  '+49123456789',
  'DE123456789',
  'Musterstraße 1, 10115 Berlin'
),
(
  'bd4e2f3f-6c4d-5e4f-ab2c-3d4e5f6a7b8c',
  'user@example.com',
  'Test User',
  'Test Company GmbH',
  '+49987654321',
  'DE987654321',
  'Beispielweg 2, 10117 Berlin'
);