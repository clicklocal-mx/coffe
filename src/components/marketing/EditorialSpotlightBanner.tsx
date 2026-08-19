import React from 'react';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { PRODUCTS } from '../../data/products';
import { triggerOrderConfetti } from '../../utils/confetti';
import { formatCurrency } from '../../utils/formatters';
import { Sparkles, ShoppingBag, Droplets, Zap, Tag } from 'lucide-react';

export const EditorialSpotlightBanner: React.FC = () => {
  const { addToCart } = useCart();
  const { currency } = useBarista();

  const icedLatteProduct = PRODUCTS.find((p) => p.id === 'horchata-cold-brew-baja') || PRODUCTS[0];

  const handleQuickAdd = () => {
    const defaultCustomizations = {
      size: '16oz' as any,
      milk: 'entera' as any,
      sweetness: '0%' as any,
      ice: 'regular' as any,
      extraShots: 0,
      syrups: ['Vainilla Francesa', 'Caramelo Artesanal'],
    };
    addToCart(icedLatteProduct, 1, defaultCustomizations, 85);
    triggerOrderConfetti();
  };

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F5C2B4] via-[#F8D2C7] to-[#FBE7E1] border-2 border-[#E7A898] shadow-xl p-6 sm:p-10 text-[#2B1B14]">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Details */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-xs uppercase">
                  New
                </span>
                <span className="text-2xl sm:text-3xl font-serif italic text-[#8B452E]">
                  edición especial
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2A160F] leading-none uppercase mt-1">
                Drink
              </h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#3A1E14]">
                Iced Vanilla & Caramel Latte
              </h3>
              <p className="text-xs sm:text-sm text-[#543023] font-medium leading-relaxed max-w-xl">
                Bebida refrescante elaborada con doble shot de espresso de altura, leche fría de rancho y cubos de hielo cristalinos. El balance perfecto entre la intensidad del grano tostado y la cremosidad dulce de nuestros jarabes de la casa.
              </p>
            </div>

            {/* 3 Metric Badges matching photo */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/50 backdrop-blur-xs p-3 rounded-2xl border border-[#E7A898]/60">
                <div className="flex items-center gap-1 text-[#8B452E]">
                  <Droplets className="w-3.5 h-3.5" />
                  <span className="text-base sm:text-lg font-black leading-none">3</span>
                </div>
                <span className="text-[11px] font-black block mt-0.5 text-[#3A1E14]">Jarabes</span>
                <span className="text-[9px] text-[#6E4233] leading-none block mt-0.5">Vainilla, Caramelo & Avellana</span>
              </div>

              <div className="bg-white/50 backdrop-blur-xs p-3 rounded-2xl border border-[#E7A898]/60">
                <div className="flex items-center gap-1 text-[#8B452E]">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-base sm:text-lg font-black leading-none">Doble</span>
                </div>
                <span className="text-[11px] font-black block mt-0.5 text-[#3A1E14]">Espresso</span>
                <span className="text-[9px] text-[#6E4233] leading-none block mt-0.5">Leche fría + hielo</span>
              </div>

              <div className="bg-white/50 backdrop-blur-xs p-3 rounded-2xl border border-[#E7A898]/60">
                <div className="flex items-center gap-1 text-[#8B452E]">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-base sm:text-lg font-black leading-none">20%</span>
                </div>
                <span className="text-[11px] font-black block mt-0.5 text-[#3A1E14]">Descuento</span>
                <span className="text-[9px] text-[#6E4233] leading-none block mt-0.5">Promo Playas Rosarito</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleQuickAdd}
                className="px-6 py-3 rounded-full bg-[#2A160F] text-white hover:bg-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pedir Iced Latte Especial</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Drink & Price Tag */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative">
            {/* Big price tag */}
            <div className="text-center lg:text-right pb-2">
              <div className="text-4xl sm:text-5xl font-black text-[#2A160F] tracking-tight">
                {formatCurrency(85, currency)}
              </div>
              <div className="text-sm font-bold text-[#8B452E] line-through">
                {formatCurrency(105, currency)}
              </div>
            </div>

            {/* Coffee Glass Image */}
            <div className="relative w-64 sm:w-72 h-72 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80">
              <img
                src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
                alt="Iced Latte Specialty"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#2A160F] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Bebida Destacada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
