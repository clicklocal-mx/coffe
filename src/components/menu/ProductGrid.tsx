import React from 'react';
import type { Product } from '../../types/menu';
import { ProductCard } from './ProductCard';
import { useTheme } from '../../theme/ThemeContext';
import { McCafeShowcaseLayout } from '../themes/mccafe/McCafeShowcaseLayout';
import { Coffee, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenDetail,
  onResetFilters,
}) => {
  const { theme } = useTheme();

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div
          className={`max-w-md mx-auto p-8 rounded-3xl border ${theme.styles.border} ${theme.styles.bgCard} space-y-4 shadow-sm`}
        >
          <div
            className={`w-14 h-14 mx-auto rounded-2xl ${theme.styles.badgeBg} ${theme.styles.badgeText} flex items-center justify-center`}
          >
            <Coffee className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold">No encontramos coincidencias</h3>
          <p className={`text-xs ${theme.styles.textSecondary}`}>
            Intenta con otro término de búsqueda o limpia los filtros para ver la carta completa de Costa Bruma.
          </p>
          <button
            onClick={onResetFilters}
            className={`px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 mx-auto ${theme.styles.accent} text-white ${theme.styles.buttonStyle}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      </div>
    );
  }

  // If McCafé theme is active, render the exact custom carousel UI structure
  if (theme.id === 'mccafe') {
    return <McCafeShowcaseLayout products={products} onOpenDetail={onOpenDetail} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  );
};
