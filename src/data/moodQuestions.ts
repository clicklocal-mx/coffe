export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: Array<{
    label: string;
    description: string;
    icon: string;
    tagMatch: string;
  }>;
}

export const MOOD_QUESTIONS: QuizQuestion[] = [
  {
    id: 'vibe',
    title: '¿Cuál es tu vibra en este momento?',
    subtitle: 'Selecciona cómo te sientes o qué ambiente buscas',
    options: [
      {
        label: 'Buscando brisa frente al mar',
        description: 'Algo fresco, relajante y ligero para disfrutar la vista',
        icon: '🌊',
        tagMatch: 'cold-brew',
      },
      {
        label: 'Pura energía para surfear / trabajar',
        description: 'Un disparo de cafeína limpio y directo',
        icon: '⚡',
        tagMatch: 'espresso',
      },
      {
        label: 'Apreciar notas y método artesanal',
        description: 'Taza limpia, aromática y para tomar con calma',
        icon: '🧪',
        tagMatch: 'methods',
      },
      {
        label: 'Antojo dulce o desayuno reconfortante',
        description: 'Algo que acompañe un buen pan recién horneado',
        icon: '🥐',
        tagMatch: 'bakery',
      },
    ],
  },
  {
    id: 'temperature',
    title: '¿Cómo prefieres la temperatura hoy?',
    subtitle: 'El clima de Rosarito cambia rápido con la neblina marina',
    options: [
      {
        label: 'Frío con hielo o frappé refrescante',
        description: 'Ideal para sol o caminata en la playa',
        icon: '🧊',
        tagMatch: 'cold-brew',
      },
      {
        label: 'Calientito y reconfortante',
        description: 'Para la mañana fresca o brisa costera',
        icon: '☕',
        tagMatch: 'hot',
      },
      {
        label: 'Neutro / Acompañado con comida',
        description: 'Quiero algo sólido o un maridaje',
        icon: '🥑',
        tagMatch: 'food',
      },
    ],
  },
  {
    id: 'profile',
    title: '¿Qué notas de sabor te provocan más?',
    subtitle: 'Elige tu perfil sensorial favorito',
    options: [
      {
        label: 'Cacao, avellana y caramelo',
        description: 'Perfil clásico, dulce y sedoso',
        icon: '🍫',
        tagMatch: 'chocolate',
      },
      {
        label: 'Flores, cítricos y jazmín',
        description: 'Perfil brillante, frutal y exótico',
        icon: '🌸',
        tagMatch: 'floral',
      },
      {
        label: 'Especias, lavanda o matcha',
        description: 'Combinaciones botánicas de autor',
        icon: '🌿',
        tagMatch: 'botanical',
      },
    ],
  },
];
