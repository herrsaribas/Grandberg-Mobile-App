/*
  # Create categories table and update products

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `slug` (text, not null, unique)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Changes
    - Add foreign key to products table linking to categories
    - Migrate existing category data
    - Add RLS policies for categories

  3. Security
    - Enable RLS on categories table
    - Add policies for:
      - Anyone can view active categories
      - Only admin users can manage categories
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin users can manage categories" ON categories
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add updated_at trigger
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing categories
INSERT INTO categories (name, slug)
SELECT DISTINCT category, lower(regexp_replace(category, '\s+', '-', 'g'))
FROM products;

-- Add category_id to products
ALTER TABLE products ADD COLUMN category_id uuid REFERENCES categories(id);

-- Update products with new category_id
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE lower(regexp_replace(p.category, '\s+', '-', 'g')) = c.slug;