import React, { useState, useMemo } from 'react';
import type { Product, SizeOption, MilkOption, SweetnessOption, IceOption, RoastOrigin } from '../../types/menu';
import type { SelectedCustomizations } from '../../types/cart';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerOrderConfetti } from '../../utils/confetti';
import { X, Plus, Minus, Sparkles, Coffee } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return <ProductDetailModalContent key={product.id} product={product} onClose={onClose} />;
};

interface ProductDetailModalContentProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModalContent: React.FC<ProductDetailModalContentProps> = ({ product, onClose }) => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { currency } = useBarista();

  const custConfig = product.customization;

  // Defaults
  const initialSize: SizeOption = custConfig?.hasSize && custConfig.sizePrices
    ? (Object.keys(custConfig.sizePrices)[0] as SizeOption)
    : 'standard';

  const [size, setSize] = useState<SizeOption>(initialSize);
  const [milk, setMilk] = useState<MilkOption>(custConfig?.hasMilk ? 'entera' : 'ninguna');
  const [ice, setIce] = useState<IceOption>(custConfig?.hasIce ? 'regular' : 'caliente');
  const [sweetness, setSweetness] = useState<SweetnessOption>('0%');
  const [extraShots, setExtraShots] = useState<number>(0);
  const [roastOrigin, setRoastOrigin] = useState<RoastOrigin>('Pluma Hidalgo (Oaxaca)');
  const [selectedSyrups, setSelectedSyrups] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Price Calculation
  const unitPrice = useMemo(() => {
    let price = product.basePrice;

    // Size adjustment
    if (custConfig?.hasSize && custConfig.sizePrices && custConfig.sizePrices[size]) {
      price = custConfig.sizePrices[size]!;
    }

    // Milk surcharge
    if (custConfig?.hasMilk && custConfig.milkPrices && custConfig.milkPrices[milk]) {
      price += custConfig.milkPrices[milk];
    }

    // Extra shots ($20 each by default)
    if (custConfig?.hasExtraShots && extraShots > 0) {
      const shotPrice = custConfig.extraShotPrice || 20;
      price += extraShots * shotPrice;
    }

    // Syrups
    if (custConfig?.hasSyrups && custConfig.syrupOptions) {
      selectedSyrups.forEach((syrupName) => {
        const option = custConfig.syrupOptions?.find((s) => s.name === syrupName);
        if (option) price += option.price;
      });
    }

    return price;
  }, [product, custConfig, size, milk, extraShots, selectedSyrups]);

  const totalPrice = unitPrice * quantity;

  const handleToggleSyrup = (name: string) => {
    setSelectedSyrups((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleAddToCart = () => {
    const customizations: SelectedCustomizations = {
      size,
      milk,
      sweetness,
      ice,
      extraShots,
      roastOrigin: custConfig?.hasRoastOrigin ? roastOrigin : undefined,
      syrups: selectedSyrups,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    addToCart(product, quantity, customizations, unitPrice);
    triggerOrderConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl max-h-[90dvh] flex flex-col ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl overflow-hidden relative`}
      >
        {/* Header with image */}
        <div className="relative h-40 sm:h-52 w-full bg-neutral-900 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider">
                {product.categoryId}
              </span>
              {product.isHouseFavorite && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Favorito Rosarito</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black leading-tight">{product.name}</h2>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 flex-1 text-xs">
          {/* Description & Origin */}
          <div className="space-y-1 border-b border-black/10 dark:border-white/10 pb-3">
            <p className={`${theme.styles.textSecondary} text-xs leading-relaxed font-medium`}>
              {product.fullDescription}
            </p>
            {product.origin && (
              <p className={`text-xs ${theme.styles.accentText} font-bold flex items-center gap-1.5 pt-0.5`}>
                <Coffee className="w-3.5 h-3.5" />
                <span>Origen: {product.origin}</span>
              </p>
            )}
          </div>

          {/* Size Options */}
          {custConfig?.hasSize && custConfig.sizePrices && (
            <div className="space-y-1.5">
              <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
                1. Selecciona Tamaño
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(custConfig.sizePrices) as SizeOption[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`py-2 px-2.5 rounded-xl border-2 text-xs font-black flex flex-col items-center gap-0.5 transition-all ${
                      size === sz
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} hover:border-neutral-400`
                    }`}
                  >
                    <span>{sz}</span>
                    <span className="text-[10px] opacity-90">
                      {formatCurrency(custConfig.sizePrices![sz]!, currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {custConfig?.hasMilk && (
            <div className="space-y-1.5">
              <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
                2. Tipo de Leche
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'entera', label: 'Entera de Rancho', price: 0 },
                  { id: 'deslactosada', label: 'Deslactosada', price: 0 },
                  { id: 'avena', label: 'Avena Barista', price: 15 },
                  { id: 'almendra', label: 'Almendra Orgánica', price: 15 },
                  { id: 'coco', label: 'Coco Sedoso', price: 15 },
                  { id: 'ninguna', label: 'Solo Agua / Negro', price: 0 },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMilk(m.id as MilkOption)}
                    className={`py-2 px-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-between transition-all ${
                      milk === m.id
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} hover:border-neutral-400`
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.price > 0 && <span className="text-[10px] opacity-90">+${m.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ice / Temperature */}
          {custConfig?.hasIce && (
            <div className="space-y-1.5">
              <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
                3. Temperatura y Hielo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'caliente', label: '🔥 Caliente' },
                  { id: 'regular', label: '🧊 Regular' },
                  { id: 'extra', label: '❄️ Extra Hielo' },
                  { id: 'sin-hielo', label: '💧 Sin Hielo' },
                ].map((ic) => (
                  <button
                    key={ic.id}
                    onClick={() => setIce(ic.id as IceOption)}
                    className={`py-2 px-2 rounded-xl border-2 text-xs font-black text-center transition-all ${
                      ice === ic.id
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} hover:border-neutral-400`
                    }`}
                  >
                    {ic.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {custConfig?.hasSweetness && (
            <div className="space-y-1.5">
              <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
                4. Nivel de Dulzor
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['0%', '25%', '50%', '100%'] as SweetnessOption[]).map((sw) => (
                  <button
                    key={sw}
                    onClick={() => setSweetness(sw)}
                    className={`py-2 rounded-xl border-2 text-xs font-black transition-all ${
                      sweetness === sw
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} hover:border-neutral-400`
                    }`}
                  >
                    {sw === '0%' ? 'Sin Azúcar' : sw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Roast Origin Selector */}
          {custConfig?.hasRoastOrigin && (
            <div className="space-y-1.5">
              <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
                Origen del Grano
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Pluma Hidalgo (Oaxaca)',
                  'Jaltenango (Chiapas)',
                  'Coatepec (Veracruz)',
                  'Geisha Finca Rosarito (Especial)',
                ].map((orig) => (
                  <button
                    key={orig}
                    onClick={() => setRoastOrigin(orig as RoastOrigin)}
                    className={`py-2 px-2.5 rounded-xl border-2 text-xs font-bold text-left transition-all ${
                      roastOrigin === orig
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} hover:border-neutral-400`
                    }`}
                  >
                    {orig}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Espresso Shots */}
          {custConfig?.hasExtraShots && (
            <div className={`flex items-center justify-between p-3 rounded-xl border-2 ${theme.styles.border} ${theme.styles.bgCard}`}>
              <div>
                <span className={`font-black text-xs block ${theme.styles.textPrimary}`}>Shots Extra de Espresso</span>
                <span className={`text-[11px] ${theme.styles.textMuted}`}>
                  +${custConfig.extraShotPrice || 20} MXN por shot
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExtraShots(Math.max(0, extraShots - 1))}
                  className="w-7 h-7 rounded-lg border border-neutral-400 flex items-center justify-center hover:bg-black/10 active:scale-95 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center font-black text-sm">{extraShots}</span>
                <button
                  onClick={() => setExtraShots(Math.min(4, extraShots + 1))}
                  className="w-7 h-7 rounded-lg border border-neutral-400 flex items-center justify-center hover:bg-black/10 active:scale-95 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Artisanal Syrups */}
          {custConfig?.hasSyrups && custConfig.syrupOptions && (
            <div className="space-y-1.5">
              <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
                Jarabes & Sabores
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {custConfig.syrupOptions.map((syr) => {
                  const isChecked = selectedSyrups.includes(syr.name);
                  return (
                    <button
                      key={syr.id}
                      onClick={() => handleToggleSyrup(syr.name)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? `${theme.styles.accent} border-transparent shadow-xs`
                          : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} hover:border-neutral-400`
                      }`}
                    >
                      <span>{syr.name}</span>
                      <span className="text-[10px] opacity-90 font-mono">+${syr.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes for Barista */}
          <div className="space-y-1">
            <label className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 block">
              Notas para el Barista
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej. 'Extra caliente', 'Poco hielo', 'Mug para llevar'..."
              className={`w-full px-3 py-2 text-xs font-medium rounded-xl border-2 ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary} focus:outline-none focus:border-amber-500`}
            />
          </div>
        </div>

        {/* Modal Footer: Qty + Add to Cart */}
        <div className="p-3 sm:p-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3 bg-neutral-100 dark:bg-neutral-900 shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95 font-black"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-black text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95 font-black"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-black flex items-center justify-between ${theme.styles.accent} ${theme.styles.buttonStyle} shadow-lg`}
          >
            <span>Agregar a Comanda</span>
            <span className="font-black text-sm">{formatCurrency(totalPrice, currency)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
