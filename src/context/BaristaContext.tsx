import React, { createContext, useContext, useEffect, useState } from 'react';

interface BaristaContextType {
  outOfStockIds: string[];
  toggleOutOfStock: (productId: string) => void;
  isOutOfStock: (productId: string) => boolean;
  currency: 'MXN' | 'USD';
  toggleCurrency: () => void;
  isBaristaModalOpen: boolean;
  setIsBaristaModalOpen: (open: boolean) => void;
}

const BaristaContext = createContext<BaristaContextType | undefined>(undefined);

const STOCK_STORAGE_KEY = 'costa_bruma_out_of_stock';
const CURRENCY_STORAGE_KEY = 'costa_bruma_currency';

export const BaristaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [outOfStockIds, setOutOfStockIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STOCK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState<'MXN' | 'USD'>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return saved === 'USD' ? 'USD' : 'MXN';
    } catch {
      return 'MXN';
    }
  });

  const [isBaristaModalOpen, setIsBaristaModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(outOfStockIds));
    } catch (err) {
      console.warn('Could not save stock state', err);
    }
  }, [outOfStockIds]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch (err) {
      console.warn('Could not save currency', err);
    }
  }, [currency]);

  const toggleOutOfStock = (productId: string) => {
    setOutOfStockIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isOutOfStock = (productId: string) => outOfStockIds.includes(productId);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'MXN' ? 'USD' : 'MXN'));
  };

  return (
    <BaristaContext.Provider
      value={{
        outOfStockIds,
        toggleOutOfStock,
        isOutOfStock,
        currency,
        toggleCurrency,
        isBaristaModalOpen,
        setIsBaristaModalOpen,
      }}
    >
      {children}
    </BaristaContext.Provider>
  );
};

export const useBarista = (): BaristaContextType => {
  const context = useContext(BaristaContext);
  if (!context) {
    throw new Error('useBarista must be used within a BaristaProvider');
  }
  return context;
};
