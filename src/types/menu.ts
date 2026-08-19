export type CategoryId = 
  | 'all'
  | 'classics'
  | 'frappes-cold'
  | 'tea-chocolate'
  | 'methods'
  | 'bakery' 
  | 'brunch' 
  | 'beans';

export interface Category {
  id: CategoryId;
  name: string;
  nameEn?: string;
  shortName: string;
  icon: string;
  description: string;
}

export type MilkOption = 'entera' | 'deslactosada' | 'avena' | 'almendra' | 'coco' | 'ninguna';
export type SizeOption = '8oz' | '12oz' | '16oz' | 'standard';
export type SweetnessOption = '0%' | '25%' | '50%' | '100%';
export type IceOption = 'caliente' | 'regular' | 'extra' | 'sin-hielo';
export type RoastOrigin = 'Pluma Hidalgo (Oaxaca)' | 'Jaltenango (Chiapas)' | 'Coatepec (Veracruz)' | 'Geisha Finca Rosarito (Especial)';

export interface CustomizationConfig {
  hasSize?: boolean;
  sizePrices?: {
    '8oz'?: number;
    '12oz'?: number;
    '16oz'?: number;
    'standard'?: number;
  };
  hasMilk?: boolean;
  milkPrices?: {
    entera: number;
    deslactosada: number;
    avena: number;
    almendra: number;
    coco: number;
    ninguna: number;
  };
  hasSweetness?: boolean;
  hasIce?: boolean;
  hasExtraShots?: boolean;
  extraShotPrice?: number;
  hasRoastOrigin?: boolean;
  hasSyrups?: boolean;
  syrupOptions?: Array<{ id: string; name: string; price: number }>;
}

export interface DietaryTag {
  id: 'vegan' | 'gluten-free' | 'house-special' | 'local-beans' | 'bestseller' | 'seasonal' | 'sugar-free';
  label: string;
  colorClass?: string;
  icon?: string;
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  name: string;
  nameEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  fullDescription: string;
  fullDescriptionEn?: string;
  basePrice: number;
  imageUrl: string;
  tags: DietaryTag['id'][];
  notes?: string;
  notesEn?: string;
  origin?: string;
  calories?: number;
  customization?: CustomizationConfig;
  isPopular?: boolean;
  isHouseFavorite?: boolean;
  prepTimeMinutes?: number;
}
