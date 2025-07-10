/*
  # Kullanıcılar tablosu oluşturma

  1. Yeni Tablolar
    - `users`
      - `id` (uuid, primary key) - Supabase auth.users tablosuyla eşleşir
      - `email` (text, unique)
      - `full_name` (text)
      - `company_name` (text)
      - `phone` (text)
      - `tax_id` (text, nullable)
      - `address` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Güvenlik
    - RLS aktif
    - Kullanıcılar kendi verilerini okuyabilir
    - Admin tüm kullanıcıları yönetebilir
*/

CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  company_name text NOT NULL,
  phone text NOT NULL,
  tax_id text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi verilerini okuyabilir
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Kullanıcılar kendi verilerini güncelleyebilir
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin tüm kullanıcıları yönetebilir
CREATE POLICY "Admins can do anything" ON public.users
  FOR ALL
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- updated_at kolonunu otomatik güncelle
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();