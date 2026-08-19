import type { Category } from '../types/menu';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'Todo el Menú',
    shortName: 'Todo',
    icon: '✨',
    description: 'Explora nuestra selección completa de cafés clásicos, especialidad y cocina',
  },
  {
    id: 'classics',
    name: 'Cafés Clásicos & Espresso',
    shortName: 'Clásicos',
    icon: '☕',
    description: 'Americano, Espresso, Latte, Capuchino, Moka, Caramel Macchiato y Café de Olla',
  },
  {
    id: 'frappes-cold',
    name: 'Frappés, Iced & Fríos',
    shortName: 'Frappés & Fríos',
    icon: '🧊',
    description: 'Frappés cremosos, Cold Brew 18h, Iced Lattes y bebidas refrescantes',
  },
  {
    id: 'tea-chocolate',
    name: 'Chai, Matcha, Tés & Chocolate',
    shortName: 'Tés & Chocolate',
    icon: '🍵',
    description: 'Chocolate oaxaqueño tradicional, Chai latte especiado, Matcha y tisanas',
  },
  {
    id: 'methods',
    name: 'Métodos Artesanales',
    shortName: 'Filtrados',
    icon: '🧪',
    description: 'V60, Chemex, AeroPress y Prensa Francesa de especialidad',
  },
  {
    id: 'bakery',
    name: 'Panadería de Masa Madre',
    shortName: 'Panadería',
    icon: '🥐',
    description: 'Croissants hojaldrados, galletas estilo NYC y panes recién horneados',
  },
  {
    id: 'brunch',
    name: 'Toasts & Desayunos Baja',
    shortName: 'Brunch & Toasts',
    icon: '🥑',
    description: 'Avocado toasts con sal marina, brioche de desayuno y bowls de açai',
  },
  {
    id: 'beans',
    name: 'Granos Tostados en Casa',
    shortName: 'Café en Grano',
    icon: '🌱',
    description: 'Bolsas de 250g tostadas semanalmente en nuestro taller en Rosarito',
  },
];
