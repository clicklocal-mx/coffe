import type { Product, SizeOption, MilkOption, SweetnessOption, IceOption, RoastOrigin } from './menu';

export interface SelectedCustomizations {
  size: SizeOption;
  milk: MilkOption;
  sweetness: SweetnessOption;
  ice: IceOption;
  extraShots: number;
  roastOrigin?: RoastOrigin;
  syrups: string[];
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // Unique cart item ID (product.id + hash of customizations)
  product: Product;
  quantity: number;
  customizations: SelectedCustomizations;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'mesa' | 'barra-pickup' | 'playa-delivery';

export interface OrderCustomerInfo {
  name: string;
  phone?: string;
  tableNumber?: string;
  deliverySpot?: string; // e.g. "Frente a las dunas / Muelle de Rosarito"
  notes?: string;
}

export interface CompletedOrder {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  tipAmount: number;
  tipPercentage: number;
  total: number;
  orderType: OrderType;
  customer: OrderCustomerInfo;
  status: 'recibido' | 'preparando' | 'listo' | 'entregado';
}
