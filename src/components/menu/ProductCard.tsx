import React from 'react';
import type { Product } from '../../types/menu';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { formatCurrency } from '../../utils/formatters';
import { Heart, Plus, Sparkles, Clock, Ban } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { theme, fontSizeScale } = useTheme();
  const { isFavorite, toggleFavorite } = useCart();
  const { isOutOfStock, currency } = useBarista();

  const outOfStock = isOutOfStock(product.id);
  const favorite = isFavorite(product.id);
  const isEnlarged = fontSizeScale !== 'normal';

  return (
    <div
      onClick={() => !outOfStock && onOpenDetail(product)}
      className={`group relative overflow-hidden ${theme.styles.bgCard} ${theme.styles.radius} ${theme.styles.cardStyle} ${theme.styles.bgCardHover} cursor-pointer transition-all duration-200 shadow-sm`}
    >
      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< sm): Smart Adaptive View (Clean & High Readability)      */}
      {/* ========================================================================= */}
      <div className="flex sm:hidden p-3.5 gap-3 items-center justify-between">
        {/* Left: Product Info */}
        <div className="flex-1 min-w-0 space-y-1 pr-1">
          {/* Badges (Only in normal mode or if house favorite) */}
          {(!isEnlarged || product.isHouseFavorite) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.isHouseFavorite && (
                <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Favorito</span>
                </span>
              )}
              {!isEnlarged && product.origin && (
                <span className={`text-[10px] font-bold ${theme.styles.badgeBg} ${theme.styles.badgeText} px-1.5 py-0.2 rounded`}>
                  {product.origin.split(' ')[0]}
                </span>
              )}
              {!isEnlarged && product.prepTimeMinutes && (
                <span className={`text-[10px] ${theme.styles.textMuted} font-semibold flex items-center gap-0.5`}>
                  <Clock className="w-2.5 h-2.5" />
                  <span>{product.prepTimeMinutes}m</span>
                </span>
              )}
            </div>
          )}

          {/* Full Title (Never truncated in enlarged mode for 100% readability) */}
          <h3
            className={`font-black text-sm sm:text-base leading-tight ${theme.styles.textPrimary} ${
              isEnlarged ? 'line-clamp-2' : 'line-clamp-1'
            }`}
          >
            {product.name}
          </h3>

          {/* Description (Omitted in enlarged mode to eliminate clutter) */}
          {!isEnlarged && (
            <p className={`text-xs ${theme.styles.textSecondary} line-clamp-2 leading-relaxed font-medium`}>
              {product.shortDescription}
            </p>
          )}

          {/* Price & Action Button */}
          <div className="flex items-center gap-2 pt-1">
            <span className={`text-base font-black ${theme.styles.textPrimary}`}>
              {formatCurrency(product.basePrice, currency)}
            </span>

            {outOfStock ? (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Ban className="w-2.5 h-2.5" />
                <span>Agotado</span>
              </span>
            ) : (
              <span className={`text-xs font-black ${theme.styles.accentText}`}>
                {product.customization?.hasMilk || product.customization?.hasSize ? 'Personalizar ›' : 'Agregar +'}
              </span>
            )}
          </div>
        </div>

        {/* Right: Image & Favorite & Quick Plus */}
        <div
          className={`relative rounded-2xl overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800 shadow-inner ${
            isEnlarged ? 'w-20 h-20' : 'w-24 h-24'
          }`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              outOfStock ? 'grayscale opacity-60' : ''
            }`}
          />

          {/* Favorite heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label="Guardar en favoritos"
            className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 backdrop-blur-xs text-white hover:bg-black/90 transition-all active:scale-90 shadow-sm"
          >
            <Heart
              className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
            />
          </button>

          {/* Plus action pill */}
          {!outOfStock && (
            <div
              className={`absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-xl ${theme.styles.accent} flex items-center justify-center shadow-md active:scale-90 transition-transform`}
            >
              <Plus className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP / TABLET LAYOUT (sm: and up)                                      */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex flex-col justify-between h-full">
        {/* Top Image */}
        <div className="relative h-40 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              outOfStock ? 'grayscale opacity-60' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            {product.isHouseFavorite && (
              <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Favorito</span>
              </span>
            )}
            {!isEnlarged && product.origin && (
              <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {product.origin.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 hover:scale-110 active:scale-90 transition-all shadow-sm"
          >
            <Heart
              className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
            />
          </button>

          {/* Out of Stock banner */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 text-center">
              <div className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                <Ban className="w-4 h-4" />
                <span>Agotado por hoy</span>
              </div>
            </div>
          )}

          {product.prepTimeMinutes && !outOfStock && !isEnlarged && (
            <div className="absolute bottom-2 left-2.5 text-[10px] text-white font-semibold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Clock className="w-3 h-3" />
              <span>~{product.prepTimeMinutes} min</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <h3 className={`font-black text-base leading-snug ${theme.styles.textPrimary} group-hover:text-amber-600 transition-colors`}>
              {product.name}
            </h3>

            {!isEnlarged && (
              <p className={`text-xs ${theme.styles.textSecondary} line-clamp-2 mt-1 leading-relaxed font-medium`}>
                {product.shortDescription}
              </p>
            )}

            {!isEnlarged && product.notes && (
              <p className={`text-[11px] ${theme.styles.textMuted} italic mt-1 line-clamp-1 font-medium`}>
                🌿 {product.notes}
              </p>
            )}
          </div>

          {/* Card Footer */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            <div>
              <span className={`text-[10px] ${theme.styles.textMuted} font-bold block leading-none`}>Precio</span>
              <span className={`text-base font-black tracking-tight ${theme.styles.textPrimary}`}>
                {formatCurrency(product.basePrice, currency)}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!outOfStock) onOpenDetail(product);
              }}
              disabled={outOfStock}
              className={`px-3.5 py-2 text-xs font-black flex items-center gap-1.5 ${
                outOfStock
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : `${theme.styles.accent} ${theme.styles.buttonStyle}`
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{product.customization?.hasMilk || product.customization?.hasSize ? 'Personalizar' : 'Agregar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
