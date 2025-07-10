export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vat: number;
  image: string;
  category: string;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Cola Light',
    description: '24x0,33L Kiste',
    price: 19.99,
    vat: 19,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop',
    category: 'Getränke',
  },
  {
    id: '2',
    name: 'Apfel Royal Gala',
    description: '1kg Premium',
    price: 2.99,
    vat: 7,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
    category: 'Gemüse & Obst',
  },
  {
    id: '3',
    name: 'Karton Box',
    description: '30x20x15cm | 10 Stück',
    price: 4.99,
    vat: 19,
    image: 'https://images.unsplash.com/photo-1530751127259-074b0cdc0469?w=300&h=300&fit=crop',
    category: 'Verpackung',
  },
  {
    id: '4',
    name: 'Mineralwasser',
    description: '12x1L Kiste',
    price: 8.99,
    vat: 19,
    image: 'https://images.unsplash.com/photo-1560704429-509c3d5a7866?w=300&h=300&fit=crop',
    category: 'Getränke',
  },
  {
    id: '5',
    name: 'Bananen',
    description: '1kg Bio',
    price: 2.49,
    vat: 7,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
    category: 'Gemüse & Obst',
  },
  {
    id: '6',
    name: 'Fanta',
    description: '24x0,33L Kiste',
    price: 18.99,
    vat: 19,
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=300&h=300&fit=crop',
    category: 'Getränke',
  },
  {
    id: '7',
    name: 'Orangen',
    description: '1kg Premium',
    price: 3.49,
    vat: 7,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
    category: 'Gemüse & Obst',
  },
  {
    id: '8',
    name: 'Geschenkbox',
    description: '20x20x20cm | 5 Stück',
    price: 6.99,
    vat: 19,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop',
    category: 'Verpackung',
  },
];