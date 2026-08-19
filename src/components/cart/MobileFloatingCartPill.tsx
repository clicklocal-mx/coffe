import React from 'react';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { useTheme } from '../../theme/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileFloatingCartPill: React.FC = () => {
  const { totalItems, subtotal, setIsCartOpen, isCartOpen } = useCart();
  const { currency } = useBarista();
  const { theme } = useTheme();

  if (totalItems === 0 || isCartOpen) return null;

  return (
    <div className="fixed bottom-4 inset-x-3 z-30 sm:hidden animate-in slide-in-from-bottom duration-300">
      <button
        onClick={() => setIsCartOpen(true)}
        className={`w-full py-3 px-4 rounded-2xl ${theme.styles.accent} text-white flex items-center justify-between shadow-2xl border border-white/20 active:scale-98 transition-transform`}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-white text-black text-xs font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            <span>{totalItems}</span>
          </div>
          <span className="font-extrabold text-sm">Ver Comanda</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-sm">{formatCurrency(subtotal, currency)}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
