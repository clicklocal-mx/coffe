import React from 'react';
import type { CartItem } from '../../types/cart';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { currency } = useBarista();

  const cust = item.customizations;
  const tags: string[] = [];
  if (cust.size && cust.size !== 'standard') tags.push(cust.size);
  if (cust.milk && cust.milk !== 'ninguna') tags.push(`Leche ${cust.milk}`);
  if (cust.ice && cust.ice !== 'caliente') tags.push(cust.ice);
  if (cust.sweetness && cust.sweetness !== '0%') tags.push(`Dulzura ${cust.sweetness}`);
  if (cust.extraShots > 0) tags.push(`+${cust.extraShots} shot(s)`);
  if (cust.roastOrigin) tags.push(cust.roastOrigin.split(' ')[0]);
  if (cust.syrups && cust.syrups.length > 0) tags.push(cust.syrups.join(', '));

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
      {/* Product Thumbnail */}
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
      />

      {/* Item info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-bold text-xs sm:text-sm truncate">{item.product.name}</h4>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
            title="Eliminar de la comanda"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Customization pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-md font-medium text-neutral-600 dark:text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {cust.specialInstructions && (
          <p className="text-[10px] italic text-amber-600 dark:text-amber-400">
            "{cust.specialInstructions}"
          </p>
        )}

        {/* Price & Quantity Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-extrabold text-xs sm:text-sm text-amber-600 dark:text-amber-400">
            {formatCurrency(item.totalPrice, currency)}
          </span>

          <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 p-0.5 shadow-xs">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 active:scale-95 text-neutral-600 dark:text-neutral-300"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-4 text-center font-bold text-xs">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 active:scale-95 text-neutral-600 dark:text-neutral-300"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
