import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, CompletedOrder, SelectedCustomizations } from '../types/cart';
import type { Product } from '../types/menu';
import { get, set } from 'idb-keyval';
import { generateOrderId } from '../utils/formatters';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomizations, unitPrice: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  
  // Favorites
  favorites: string[]; // Product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Cart Drawer UI
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders history
  orders: CompletedOrder[];
  addOrder: (orderData: Omit<CompletedOrder, 'id' | 'createdAt' | 'status'>) => CompletedOrder;

  // Thermal Ticket Modal
  activeTicketOrder: CompletedOrder | null;
  setActiveTicketOrder: (order: CompletedOrder | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'costa_bruma_cart';
const FAVORITES_STORAGE_KEY = 'costa_bruma_favorites';
const ORDERS_IDB_KEY = 'costa_bruma_orders_history';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['flat-white-marea', 'croissant-guayaba-queso'];
    } catch {
      return ['flat-white-marea', 'croissant-guayaba-queso'];
    }
  });

  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTicketOrder, setActiveTicketOrder] = useState<CompletedOrder | null>(null);

  // Load orders from IndexedDB on mount
  useEffect(() => {
    get<CompletedOrder[]>(ORDERS_IDB_KEY).then((savedOrders) => {
      if (savedOrders && Array.isArray(savedOrders)) {
        setOrders(savedOrders);
      }
    }).catch((err) => console.warn('Could not load orders from IndexedDB', err));
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Could not save cart to localStorage', err);
    }
  }, [cart]);

  // Save favorites changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.warn('Could not save favorites to localStorage', err);
    }
  }, [favorites]);

  const addToCart = (
    product: Product,
    quantity: number,
    customizations: SelectedCustomizations,
    unitPrice: number
  ) => {
    // Generate a unique ID based on product ID and customization snapshot
    const customHash = JSON.stringify(customizations);
    const cartItemId = `${product.id}_${btoa(encodeURIComponent(customHash)).slice(0, 16)}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          customizations,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const addOrder = (orderData: Omit<CompletedOrder, 'id' | 'createdAt' | 'status'>): CompletedOrder => {
    const newOrder: CompletedOrder = {
      ...orderData,
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: 'recibido',
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    set(ORDERS_IDB_KEY, updatedOrders).catch((err) =>
      console.warn('Could not save order to IndexedDB', err)
    );

    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        favorites,
        toggleFavorite,
        isFavorite,
        isCartOpen,
        setIsCartOpen,
        orders,
        addOrder,
        activeTicketOrder,
        setActiveTicketOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
