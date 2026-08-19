import React, { useState } from 'react';
import type { Product, MilkOption, SizeOption } from '../../../types/menu';
import { useCart } from '../../../context/CartContext';
import { useBarista } from '../../../context/BaristaContext';
import { useLanguage } from '../../../context/LanguageContext';
import { formatCurrency } from '../../../utils/formatters';
import { triggerOrderConfetti } from '../../../utils/confetti';
import {
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Globe,
} from 'lucide-react';

interface McCafeShowcaseLayoutProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
}

export const McCafeShowcaseLayout: React.FC<McCafeShowcaseLayoutProps> = ({
  products,
  onOpenDetail,
}) => {
  const { totalItems, addToCart, setIsCartOpen } = useCart();
  const { currency } = useBarista();
  const { language, toggleLanguage, t } = useLanguage();

  const displayProducts = products.length > 0 ? products : [];
  const [activeIndex, setActiveIndex] = useState(0);

  // Active item customization state
  const [selectedSize, setSelectedSize] = useState<SizeOption>('12oz');
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>('entera');
  const [selectedDrinkType, setSelectedDrinkType] = useState<string>('Iced & Cold');
  const [addedToast, setAddedToast] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentActiveProduct = displayProducts[activeIndex] || displayProducts[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayProducts.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < displayProducts.length - 1 ? prev + 1 : 0));
  };

  const handleAddToBasket = () => {
    if (!currentActiveProduct) return;

    const defaultCustomizations = {
      size: (currentActiveProduct.customization?.hasSize ? selectedSize : 'standard') as any,
      milk: (currentActiveProduct.customization?.hasMilk ? selectedMilk : 'ninguna') as any,
      sweetness: '0%' as any,
      ice: 'regular' as any,
      extraShots: 0,
      syrups: ['Caramelo Artesanal de San Felipe'],
    };

    addToCart(currentActiveProduct, 1, defaultCustomizations, currentActiveProduct.basePrice);
    triggerOrderConfetti();
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1200);
  };

  if (displayProducts.length === 0) return null;

  // Compute visible items around the active index for the 4-card display
  const getCardProduct = (offset: number) => {
    const idx = (activeIndex + offset + displayProducts.length) % displayProducts.length;
    return { product: displayProducts[idx], index: idx };
  };

  const leftCard2 = getCardProduct(-2);
  const leftCard1 = getCardProduct(-1);
  const rightCard1 = getCardProduct(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      {/* Outer Dotted Chocolate Frame Container */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-[#2E180E] p-2 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Polka Dot Pattern matching image */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#DFB794 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Inner Main White Canvas Card */}
        <div className="relative z-10 bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 lg:p-10 shadow-xl overflow-hidden min-h-[640px] flex flex-col justify-between">
          {/* Giant Faint Brand Watermark in Background */}
          <div className="absolute inset-x-0 top-16 sm:top-20 text-center select-none pointer-events-none z-0">
            <span className="text-7xl sm:text-9xl lg:text-[150px] font-black tracking-tighter text-neutral-100 font-serif leading-none opacity-80">
              CostaCafé
            </span>
          </div>

          {/* Top McCafé Style Header Navigation Bar */}
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            {/* Red Script Logo: Costa Café Rosarito */}
            <div className="flex items-center gap-2.5">
              <span className="text-3xl sm:text-4xl font-serif italic font-black text-[#D9381E] tracking-tight">
                CostaCafé.
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#381F13] bg-[#DFB794]/30 px-2 py-0.5 rounded-full">
                Playas de Rosarito
              </span>
            </div>

            {/* Middle Nav Links & Search */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs font-black text-[#381F13] uppercase tracking-wider">
              <span className="cursor-pointer hover:text-[#D9381E] transition-colors border-b-2 border-[#D9381E] pb-0.5">
                {t('showcase.ourMenu')}
              </span>
              <span className="cursor-pointer hover:text-[#D9381E] transition-colors text-neutral-400 hover:text-neutral-700">
                {t('showcase.ourCafe')}
              </span>

              {/* Search input with icon */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t('showcase.search')}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-24 sm:w-36 text-xs uppercase tracking-wider bg-transparent border-b border-neutral-300 py-1 pr-6 focus:outline-none focus:border-[#381F13] placeholder:text-neutral-400 font-bold"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-1 pointer-events-none" />
              </div>
            </div>

            {/* Right Basket & Language Toggle */}
            <div className="flex items-center gap-2.5">
              {/* Language Switcher Pill */}
              <button
                onClick={toggleLanguage}
                title="Cambiar idioma / Switch language"
                className="px-2.5 py-1 rounded-full border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-xs font-black text-[#381F13] flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#D9381E]" />
                <span>{language === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}</span>
              </button>

              {/* Basket Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#381F13] hover:text-[#D9381E] transition-colors bg-[#DFB794]/20 px-3 py-1.5 rounded-full"
              >
                <ShoppingBag className="w-4 h-4 text-[#D9381E]" />
                <span>{t('showcase.myBasket')}</span>
                {totalItems > 0 && (
                  <span className="bg-[#D9381E] text-white font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Carousel Section Controls & Swiper */}
          <div className="relative z-10 py-6 sm:py-8 flex-1 flex flex-col justify-center">
            {/* Left & Right Chevron Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center z-30">
              <button
                onClick={handlePrev}
                aria-label="Previous Coffee"
                className="p-2 sm:p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-[#381F13] hover:scale-110 active:scale-95 transition-all -ml-2 sm:-ml-4"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center z-30">
              <button
                onClick={handleNext}
                aria-label="Next Coffee"
                className="p-2 sm:p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-[#381F13] hover:scale-110 active:scale-95 transition-all -mr-2 sm:-mr-4"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Horizontal Cards Grid matching layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-center px-4 sm:px-8">
              {/* Card 1 (Left Inactive) */}
              <div
                onClick={() => setActiveIndex(leftCard2.index)}
                className="hidden md:flex flex-col justify-between rounded-3xl bg-[#F0EFEB] p-5 h-[340px] text-left cursor-pointer hover:shadow-md transition-all group opacity-85 hover:opacity-100"
              >
                <div className="relative h-40 w-full flex items-center justify-center">
                  <img
                    src={leftCard2.product.imageUrl}
                    alt={leftCard2.product.name}
                    className="max-h-36 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-black text-sm text-[#381F13] leading-snug">
                    {leftCard2.product.name}
                  </h4>
                  <span className="text-[11px] font-bold text-[#876757] block">
                    {leftCard2.product.prepTimeMinutes ? `${leftCard2.product.prepTimeMinutes * 30} Cal` : '120 Cal'}
                  </span>
                  <p className="text-[11px] text-[#614131] line-clamp-3 leading-relaxed">
                    {leftCard2.product.shortDescription}
                  </p>
                </div>
              </div>

              {/* Card 2 (Left Inactive) */}
              <div
                onClick={() => setActiveIndex(leftCard1.index)}
                className="hidden md:flex flex-col justify-between rounded-3xl bg-[#F0EFEB] p-5 h-[340px] text-left cursor-pointer hover:shadow-md transition-all group opacity-90 hover:opacity-100"
              >
                <div className="relative h-40 w-full flex items-center justify-center">
                  <img
                    src={leftCard1.product.imageUrl}
                    alt={leftCard1.product.name}
                    className="max-h-36 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-black text-sm text-[#381F13] leading-snug">
                    {leftCard1.product.name}
                  </h4>
                  <span className="text-[11px] font-bold text-[#876757] block">
                    {leftCard1.product.prepTimeMinutes ? `${leftCard1.product.prepTimeMinutes * 40} Cal` : '280 Cal'}
                  </span>
                  <p className="text-[11px] text-[#614131] line-clamp-3 leading-relaxed">
                    {leftCard1.product.shortDescription}
                  </p>
                </div>
              </div>

              {/* Card 3 (CENTER ACTIVE SPOTLIGHT CARD - Warm Caramel Container) */}
              <div className="md:col-span-1 md:-mt-8 flex flex-col justify-between rounded-[28px] bg-[#DFB794] p-6 shadow-2xl text-left relative z-20 min-h-[460px] border-2 border-[#CFA17A] text-[#381F13]">
                {/* Product Big Glass Visual with Caramel Beans accent */}
                <div className="relative h-48 w-full flex items-center justify-center -mt-10">
                  <img
                    src={currentActiveProduct.imageUrl}
                    alt={currentActiveProduct.name}
                    className="max-h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
                  />
                  {/* Subtle Caramel & Coffee Beans Badge */}
                  <div className="absolute bottom-0 left-2 bg-[#381F13]/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>Caramelo & Espresso Rosarito</span>
                  </div>
                </div>

                {/* Title & Price */}
                <div className="pt-2 text-center">
                  <h3 className="font-black text-lg sm:text-xl text-white drop-shadow-sm leading-tight">
                    {currentActiveProduct.name}
                  </h3>
                  <span className="text-sm font-black text-[#381F13] block mt-0.5">
                    {formatCurrency(currentActiveProduct.basePrice, currency)}
                  </span>
                </div>

                {/* Interactive Selectors Matching Image UI with Bilingual options */}
                <div className="space-y-2 pt-3 text-xs font-black">
                  {/* Size selector */}
                  <div className="flex items-center justify-between border-b border-[#381F13]/20 pb-1.5">
                    <span className="text-[#4A2612] font-black">{t('product.size')}</span>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value as SizeOption)}
                      className="bg-transparent text-right font-black text-[#381F13] focus:outline-none cursor-pointer"
                    >
                      <option value="8oz">{language === 'es' ? 'Chico (8oz)' : 'Small (8oz)'}</option>
                      <option value="12oz">{language === 'es' ? 'Mediano (12oz)' : 'Medium (12oz)'}</option>
                      <option value="16oz">{language === 'es' ? 'Grande (16oz)' : 'Large (16oz)'}</option>
                    </select>
                  </div>

                  {/* Milk selector */}
                  <div className="flex items-center justify-between border-b border-[#381F13]/20 pb-1.5">
                    <span className="text-[#4A2612] font-black">{t('product.milk')}</span>
                    <select
                      value={selectedMilk}
                      onChange={(e) => setSelectedMilk(e.target.value as MilkOption)}
                      className="bg-transparent text-right font-black text-[#381F13] focus:outline-none cursor-pointer capitalize"
                    >
                      <option value="entera">{language === 'es' ? 'Leche Entera de Ranzo' : 'Whole Milk'}</option>
                      <option value="deslactosada">{language === 'es' ? 'Deslactosada / Light' : 'Non-fat / Light'}</option>
                      <option value="avena">{language === 'es' ? 'Leche de Avena' : 'Oat Milk'}</option>
                      <option value="almendra">{language === 'es' ? 'Leche de Almendra' : 'Almond Milk'}</option>
                      <option value="coco">{language === 'es' ? 'Leche de Coco' : 'Coconut Milk'}</option>
                    </select>
                  </div>

                  {/* Drink Type selector */}
                  <div className="flex items-center justify-between border-b border-[#381F13]/20 pb-1.5">
                    <span className="text-[#4A2612] font-black">{t('showcase.drinkType')}</span>
                    <select
                      value={selectedDrinkType}
                      onChange={(e) => setSelectedDrinkType(e.target.value)}
                      className="bg-transparent text-right font-black text-[#381F13] focus:outline-none cursor-pointer"
                    >
                      <option value="Iced & Cold">{language === 'es' ? 'Frío con Hielo' : 'Iced & Cold'}</option>
                      <option value="Hot Steamed">{language === 'es' ? 'Caliente Vaporizado' : 'Hot Steamed'}</option>
                      <option value="Extra Foam">{language === 'es' ? 'Con Extra Espuma' : 'Extra Foam'}</option>
                    </select>
                  </div>
                </div>

                {/* Big White Pill "ADD TO BASKET" Button */}
                <div className="pt-4">
                  <button
                    onClick={handleAddToBasket}
                    className="w-full py-3 rounded-full bg-white text-[#381F13] hover:bg-neutral-50 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {addedToast ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                        <span className="text-emerald-700">{t('showcase.added')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('showcase.addToBasket')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 4 (Right Inactive) */}
              <div
                onClick={() => setActiveIndex(rightCard1.index)}
                className="hidden md:flex flex-col justify-between rounded-3xl bg-[#F0EFEB] p-5 h-[340px] text-left cursor-pointer hover:shadow-md transition-all group opacity-90 hover:opacity-100"
              >
                <div className="relative h-40 w-full flex items-center justify-center">
                  <img
                    src={rightCard1.product.imageUrl}
                    alt={rightCard1.product.name}
                    className="max-h-36 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-black text-sm text-[#381F13] leading-snug">
                    {rightCard1.product.name}
                  </h4>
                  <span className="text-[11px] font-bold text-[#876757] block">
                    {rightCard1.product.prepTimeMinutes ? `${rightCard1.product.prepTimeMinutes * 45} Cal` : '280 Cal'}
                  </span>
                  <p className="text-[11px] text-[#614131] line-clamp-3 leading-relaxed">
                    {rightCard1.product.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Indicators & Full Recipe Modal Shortcut */}
          <div className="relative z-20 pt-4 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100">
            <span className="font-bold">
              {language === 'es' ? 'Café' : 'Coffee'} <strong>{activeIndex + 1}</strong> {language === 'es' ? 'de' : 'of'} {displayProducts.length}
            </span>

            <div className="flex items-center gap-1.5">
              {displayProducts.slice(0, Math.min(8, displayProducts.length)).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === i ? 'w-6 bg-[#D9381E]' : 'w-2 bg-neutral-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => onOpenDetail(currentActiveProduct)}
              className="text-xs font-black text-[#381F13] hover:text-[#D9381E] underline uppercase tracking-wider"
            >
              {t('showcase.viewRecipe')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
