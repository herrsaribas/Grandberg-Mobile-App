/*
  # Add sample products

  1. New Data
    - Adds 8 sample products to the products table with realistic data
    - Includes various categories and VAT rates
    - Uses high-quality Pexels image URLs
*/

INSERT INTO public.products (
  name,
  description,
  price,
  vat,
  image,
  category
) VALUES 
(
  'Premium Cola Light',
  '24x0,33L Kiste, Zuckerfrei',
  21.99,
  19,
  'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg',
  'Getränke'
),
(
  'Bio Apfel Royal Gala',
  '1kg Premium Qualität aus regionalem Anbau',
  3.49,
  7,
  'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg',
  'Gemüse & Obst'
),
(
  'Premium Karton Box',
  '30x20x15cm | 10 Stück, Extra stabil',
  6.99,
  19,
  'https://images.pexels.com/photos/4498135/pexels-photo-4498135.jpeg',
  'Verpackung'
),
(
  'Natürliches Mineralwasser',
  '12x1L Glasflaschen, Kohlensäurehaltig',
  9.99,
  19,
  'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg',
  'Getränke'
),
(
  'Bio Bananen',
  '1kg Fair Trade, Premium Qualität',
  2.99,
  7,
  'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
  'Gemüse & Obst'
),
(
  'Premium Orangensaft',
  '6x1L, 100% Direktsaft',
  15.99,
  19,
  'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
  'Getränke'
),
(
  'Bio Tomaten',
  '500g Cocktailtomaten aus Gewächshaus',
  3.99,
  7,
  'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
  'Gemüse & Obst'
),
(
  'Geschenkbox Premium',
  '20x20x20cm | 5 Stück, Mit Schleife',
  8.99,
  19,
  'https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg',
  'Verpackung'
);