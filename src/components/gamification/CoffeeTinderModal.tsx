import React, { useState, useMemo, useRef } from 'react';
import type { Product, MilkOption, SizeOption } from '../../types/menu';
import { PRODUCTS } from '../../data/products';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerOrderConfetti, triggerQuizMatchConfetti } from '../../utils/confetti';
import {
  Flame,
  Heart,
  X,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  ArrowUp,
  Coffee,
  Croissant,
  Utensils,
  CheckCircle2,
  Info,
  ChevronLeft,
  Check,
  Undo2,
} from 'lucide-react';

interface CoffeeTinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductDetail?: (product: Product) => void;
}

type TinderCategoryFilter = 'all' | 'drinks' | 'food';

// Witty, charismatic & picaresque punchlines for Playas de Rosarito
const PICARESQUE_PUNCHLINES: Record<string, string> = {
  'flat-white-marea': '🌊 2 shots de ristretto que te despiertan más rápido que meterte al mar de Rosarito a las 7 AM.',
  'cortado-calafia': '🥊 Chiquito pero peligroso. Mitad espresso, mitad leche y 100% de actitud de Baja.',
  'cafe-americano-clasico': '⚡ Sin rodeos ni dramas: café de altura para los que venimos a conquistar el día frente a la playa.',
  'cappuccino-italiano': '☁️ Una montaña de microespuma tan densa que podrías apoyar una moneda. Pura crema italiana.',
  'cafe-mocha-artesanal': '🍫 El pretexto perfecto para desayunar chocolate y jurar que solo viniste por cafeína.',
  'caramel-macchiato-baja': '🍯 Dulce, cremoso y con líneas de caramelo más fotogénicas que el atardecer del muelle.',
  'cafe-de-olla-tradicional': '🏺 Receta de abuela en olla de barro con piloncillo: te cura el frío de la brisa y las penas.',
  'affogato-rosarito-sea-salt': '🍨 Espresso hirviendo sobre helado artesanal y sal de mar: la mejor crisis de identidad en un vaso.',
  'v60-geisha-finca': '🏎️ El Ferrari de los cafés: notas a jazmín y durazno tan finas que vas a querer tomarlo con el meñique arriba.',
  'chemex-para-dos': '🧪 Cristalino y limpio como el cielo de Baja, pero con la energía necesaria para dos personas.',
  'aeropress-boost': '🚀 Extraído a presión manual con furia barista. Si necesitas energía para surfear, es este.',
  'prensa-francesa-tradicional': '💪 Cuerpo pesado, rústico y aceitoso como debe de ser. No apto para tímidos.',
  'cold-brew-rosarito-sunset': '🌅 18 horas de infusión lenta con cold foam de naranja. Más refrescante que una ola en la cara.',
  'horchata-cold-brew-baja': '🇲🇽 La combinación prohibida que se volvió adicción: horchata casera con float de cold brew.',
  'espresso-tonic-yuzu': '🍸 Burbujas, tónica y romero flameado. Para sentirte en la terraza más exclusiva de Baja.',
  'matcha-ceremonial-costa': '🍵 Matcha japonés ceremonial: paz mental, concentración zen y cero temblores de cafeína.',
  'chocolate-oaxaqueno-tradicional': '🪵 Batido con molinillo de madera real: sabe a hogar, a canela y a felicidad pura.',
  'chai-latte-masala-baja': '🌿 6 especias botánicas a fuego lento. Si te gusta el cardamomo, encontraste a tu alma gemela.',
  'tisana-frutos-rojos-valle': '🍓 Fruta deshidratada del Valle: te tomas la infusión y al final te comes las frutas del fondo.',
  'croissant-guayaba-queso': '🥐 Mantequilla hojaldrada con queso de Ojos Negros: si no te llenas la camisa de moronas, no cuenta.',
  'churro-cookie-valle': '🍪 Galleta gruesa estilo NYC con centro de dulce de leche que se derrite al partirla.',
  'cinnamon-roll-pecana': '🤤 Roll esponjoso bañado en glaseado de queso crema: tu nutriólogo no tiene por qué enterarse.',
  'toast-aguacate-san-felipe': '🥑 Masa madre, aguacate rústico y sal marina de San Felipe: el rey del brunch en Rosarito.',
  'toast-salmon-ensenada': '🐟 Salmón ahumado, queso crema al limón y alcaparras: elegante, fresco y bien costeño.',
  'sandwich-brioche-barista': '🥪 Brioche en mantequilla, tocino crujiente y aioli trufado: revive a cualquier desvelado.',
  'acai-bowl-rosarito-beach': '🫐 Açai orgánico espeso con fruta de temporada: salud, frescura y vibra playera en un solo bowl.',
  'granos-costa-bruma-250g': '🌱 Lleva la magia de nuestro taller a tu casa. Tostado fresco para que tu cocina huela a gloria.',
  'granos-geisha-reserva-250g': '🏆 Micro-lote de campeonato: pocos paquetes disponibles. Joya de la tostaduría.',
};

export const CoffeeTinderModal: React.FC<CoffeeTinderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { currency } = useBarista();

  const [categoryFilter, setCategoryFilter] = useState<TinderCategoryFilter | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAction, setSwipeAction] = useState<'left' | 'right' | 'up' | null>(null);
  const [addedItemsCount, setAddedItemsCount] = useState(0);
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  
  // In-Game Card Detail View State
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>('entera');
  const [selectedSize, setSelectedSize] = useState<SizeOption>('12oz');
  const [customAddedToast, setCustomAddedToast] = useState(false);

  // Drag Gesture States
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  if (!isOpen) return null;

  // Filter products by selected category
  const deck = useMemo(() => {
    if (!categoryFilter) return [];
    if (categoryFilter === 'drinks') {
      return PRODUCTS.filter((p) =>
        ['classics', 'frappes-cold', 'tea-chocolate', 'methods'].includes(p.categoryId)
      );
    }
    if (categoryFilter === 'food') {
      return PRODUCTS.filter((p) => ['bakery', 'brunch'].includes(p.categoryId));
    }
    return PRODUCTS;
  }, [categoryFilter]);

  const currentProduct = deck[currentIndex];
  const isFinished = categoryFilter && currentIndex >= deck.length;

  const punchline = currentProduct
    ? PICARESQUE_PUNCHLINES[currentProduct.id] || currentProduct.shortDescription
    : '';

  const handleSwipe = (action: 'left' | 'right' | 'up') => {
    if (!currentProduct) return;

    setSwipeAction(action);
    setIsDetailViewOpen(false);

    setTimeout(() => {
      if (action === 'right') {
        // Like / Favorite
        if (!isFavorite(currentProduct.id)) {
          toggleFavorite(currentProduct.id);
        }
        setLikedItems((prev) => [...prev, currentProduct]);
      } else if (action === 'up') {
        // Add to Cart with sensible defaults
        const defaultCustomizations = {
          size: (currentProduct.customization?.hasSize ? selectedSize : 'standard') as any,
          milk: (currentProduct.customization?.hasMilk ? selectedMilk : 'ninguna') as any,
          sweetness: '0%' as any,
          ice: (currentProduct.customization?.hasIce ? 'regular' : 'caliente') as any,
          extraShots: 0,
          syrups: [],
        };
        addToCart(currentProduct, 1, defaultCustomizations, currentProduct.basePrice);
        setAddedItemsCount((prev) => prev + 1);
        triggerOrderConfetti();
      }

      setSwipeAction(null);
      setDragOffset({ x: 0, y: 0 });
      setCurrentIndex((prev) => prev + 1);

      if (currentIndex + 1 >= deck.length) {
        triggerQuizMatchConfetti();
      }
    }, 220);
  };

  // Rewind / Undo previous card
  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSwipeAction(null);
      setDragOffset({ x: 0, y: 0 });
      setIsDetailViewOpen(false);
    }
  };

  // Touch handlers with calibrated gesture sensitivity
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDetailViewOpen) return;
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isDetailViewOpen) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartPos.current.x;
    const dy = touch.clientY - dragStartPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging || isDetailViewOpen) return;
    setIsDragging(false);

    const { x, y } = dragOffset;
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    // Strict directional disambiguation
    if (absX > 85 && absX > absY) {
      if (x > 85) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    } else if (y < -110 && absY > absX * 1.4) {
      // Deliberate upward swipe
      handleSwipe('up');
    } else if (absX < 12 && absY < 12) {
      // Intentional Tap -> Open detail view inside the game
      setIsDetailViewOpen(true);
      setDragOffset({ x: 0, y: 0 });
    } else {
      // Snap back smoothly
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse drag handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDetailViewOpen) return;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isDetailViewOpen) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging || isDetailViewOpen) return;
    setIsDragging(false);

    const { x, y } = dragOffset;
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX > 85 && absX > absY) {
      if (x > 85) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    } else if (y < -110 && absY > absX * 1.4) {
      handleSwipe('up');
    } else if (absX < 10 && absY < 10) {
      setIsDetailViewOpen(true);
      setDragOffset({ x: 0, y: 0 });
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setCategoryFilter(null);
    setCurrentIndex(0);
    setAddedItemsCount(0);
    setLikedItems([]);
    setSwipeAction(null);
    setIsDetailViewOpen(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleAddCustomizedAndNext = () => {
    if (!currentProduct) return;
    const defaultCustomizations = {
      size: (currentProduct.customization?.hasSize ? selectedSize : 'standard') as any,
      milk: (currentProduct.customization?.hasMilk ? selectedMilk : 'ninguna') as any,
      sweetness: '0%' as any,
      ice: (currentProduct.customization?.hasIce ? 'regular' : 'caliente') as any,
      extraShots: 0,
      syrups: [],
    };
    addToCart(currentProduct, 1, defaultCustomizations, currentProduct.basePrice);
    setAddedItemsCount((prev) => prev + 1);
    triggerOrderConfetti();
    setCustomAddedToast(true);

    setTimeout(() => {
      setCustomAddedToast(false);
      setIsDetailViewOpen(false);
      setCurrentIndex((prev) => prev + 1);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg h-[94dvh] sm:h-[88dvh] flex flex-col ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl overflow-hidden relative`}
      >
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-black text-sm ${theme.styles.textPrimary} flex items-center gap-1.5`}>
                <span>Coffee Match</span>
                <span className="text-[10px] bg-rose-500/15 text-rose-600 font-black px-1.5 py-0.2 rounded-full">
                  Swipe & Match
                </span>
              </h3>
              <p className={`text-[10px] ${theme.styles.textMuted}`}>
                {isDetailViewOpen ? 'Personalización del Producto' : 'Desliza con tu dedo o usa los botones'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!categoryFilter ? (
          /* Step 1: Filter Selection */
          <div className="p-6 text-center space-y-5 flex-1 flex flex-col justify-center overflow-y-auto">
            <div className="space-y-2">
              <span className="text-4xl">🃏</span>
              <h4 className={`text-2xl font-black ${theme.styles.textPrimary}`}>
                ¿Qué te apetece hoy en Rosarito?
              </h4>
              <p className={`text-xs sm:text-sm ${theme.styles.textSecondary} max-w-sm mx-auto font-medium`}>
                Desliza tarjetas para armar tu antojo de forma rápida y divertida frente a la playa.
              </p>
            </div>

            <div className="space-y-3 max-w-sm mx-auto w-full">
              <button
                onClick={() => {
                  setCategoryFilter('drinks');
                  setCurrentIndex(0);
                }}
                className={`w-full p-4 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-amber-500 flex items-center gap-3.5 font-black text-xs active:scale-98 transition-all shadow-sm`}
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Coffee className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-sm">Cafés, Frappés & Bebidas</span>
                  <span className={`text-[11px] ${theme.styles.textMuted} font-normal`}>
                    Espresso, Cold Brew, V60, Matcha y Tés
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setCategoryFilter('food');
                  setCurrentIndex(0);
                }}
                className={`w-full p-4 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-amber-500 flex items-center gap-3.5 font-black text-xs active:scale-98 transition-all shadow-sm`}
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Croissant className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-sm">Comida, Panadería & Brunch</span>
                  <span className={`text-[11px] ${theme.styles.textMuted} font-normal`}>
                    Croissants de masa madre, Toasts y Bowls
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setCurrentIndex(0);
                }}
                className={`w-full p-4 rounded-2xl border-2 border-dashed ${theme.styles.border} hover:border-rose-500 flex items-center justify-center gap-2 font-black text-xs active:scale-98 transition-all`}
              >
                <Utensils className="w-5 h-5 text-rose-500" />
                <span className="text-sm">✨ Sorpréndeme (Todo el Menú)</span>
              </button>
            </div>
          </div>
        ) : !isFinished && currentProduct ? (
          /* Step 2: Full-Size Split Card View with High Legibility & Center Stamps */
          isDetailViewOpen ? (
            /* IN-GAME CUSTOMIZER / DETAIL VIEW */
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                <button
                  onClick={() => setIsDetailViewOpen(false)}
                  className="px-3 py-1.5 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 flex items-center gap-1 text-xs font-black hover:bg-black/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Volver a la Carta</span>
                </button>
                <span className="text-sm font-black text-amber-600">
                  {formatCurrency(currentProduct.basePrice, currency)}
                </span>
              </div>

              {/* Header Info */}
              <div className="flex items-center gap-3">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="w-18 h-18 rounded-2xl object-cover shadow-md shrink-0 border-2 border-amber-500/20"
                />
                <div>
                  <h4 className={`text-base sm:text-lg font-black leading-tight ${theme.styles.textPrimary}`}>
                    {currentProduct.name}
                  </h4>
                  <p className={`text-xs text-amber-600 dark:text-amber-400 font-bold pt-0.5`}>
                    {currentProduct.origin || 'Café de Especialidad Costa Bruma'}
                  </p>
                </div>
              </div>

              {/* Punchline quote with solid contrast */}
              <div className="p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  La vibra de esta bebida:
                </span>
                <p className="text-xs font-bold leading-relaxed italic text-neutral-900 dark:text-white">
                  "{punchline}"
                </p>
              </div>

              {/* Full Description & Tasting Notes */}
              <div className="space-y-1.5 text-xs">
                <p className={`${theme.styles.textSecondary} leading-relaxed font-semibold`}>
                  {currentProduct.fullDescription}
                </p>
                {currentProduct.notes && (
                  <p className="text-xs font-black text-amber-600">
                    🌿 Notas de cata: {currentProduct.notes}
                  </p>
                )}
              </div>

              {/* Customization Options */}
              {currentProduct.customization?.hasMilk && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-neutral-400 block">
                    Tipo de Leche
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['entera', 'deslactosada', 'avena', 'almendra', 'coco'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMilk(m as MilkOption)}
                        className={`py-2 px-2 rounded-xl border-2 text-xs font-black capitalize transition-all ${
                          selectedMilk === m
                            ? `${theme.styles.accent} border-transparent shadow-xs`
                            : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border}`
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentProduct.customization?.hasSize && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-neutral-400 block">
                    Tamaño
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['8oz', '12oz', '16oz'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s as SizeOption)}
                        className={`py-2 px-2 rounded-xl border-2 text-xs font-black transition-all ${
                          selectedSize === s
                            ? `${theme.styles.accent} border-transparent shadow-xs`
                            : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border}`
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleAddCustomizedAndNext}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 ${theme.styles.accent} ${theme.styles.buttonStyle} shadow-lg active:scale-95 transition-transform`}
                >
                  {customAddedToast ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>¡Agregado! Siguiente carta...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar a Comanda & Continuar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* SWIPEABLE SPLIT CARD DECK VIEW */
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 overflow-hidden">
              {/* Progress & Undo Button Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 shrink-0 px-1">
                <span>
                  Carta <strong>{currentIndex + 1}</strong> de {deck.length}
                </span>

                <div className="flex items-center gap-2">
                  {/* Rewind / Undo button */}
                  {currentIndex > 0 && (
                    <button
                      onClick={handleUndo}
                      title="Deshacer último swipe / Volver a carta anterior"
                      className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 text-[11px] font-black flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Deshacer</span>
                    </button>
                  )}

                  <span className="text-emerald-600 font-black">
                    {addedItemsCount > 0 && `🛍️ ${addedItemsCount} en comanda`}
                  </span>
                </div>
              </div>

              {/* Main Card Container with Drag Gestures */}
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  transform: isDragging
                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.07}deg)`
                    : swipeAction === 'left'
                    ? 'translateX(-130%) rotate(-25deg)'
                    : swipeAction === 'right'
                    ? 'translateX(130%) rotate(25deg)'
                    : swipeAction === 'up'
                    ? 'translateY(-130%) scale(0.9)'
                    : 'none',
                  transition: isDragging ? 'none' : 'transform 0.25s ease-out, opacity 0.25s',
                  opacity: swipeAction ? 0 : 1,
                }}
                className={`relative flex-1 flex flex-col rounded-3xl overflow-hidden border-2 ${theme.styles.border} ${theme.styles.bgCard} shadow-2xl select-none cursor-grab active:cursor-grabbing touch-none`}
              >
                {/* PROMINENT CENTER STAMP OVERLAYS */}
                {(dragOffset.x > 50 || swipeAction === 'right') && (
                  <div
                    style={{
                      opacity: Math.min(1, Math.abs(dragOffset.x) / 75),
                      transform: `scale(${Math.min(1.2, 0.8 + Math.abs(dragOffset.x) / 100)}) rotate(-8deg)`,
                    }}
                    className="absolute inset-0 m-auto w-max h-max z-30 bg-rose-500 text-white font-black text-xl sm:text-2xl px-6 py-3 rounded-2xl border-4 border-white shadow-2xl pointer-events-none tracking-wider"
                  >
                    ❤️ ¡ME GUSTA!
                  </div>
                )}

                {(dragOffset.x < -50 || swipeAction === 'left') && (
                  <div
                    style={{
                      opacity: Math.min(1, Math.abs(dragOffset.x) / 75),
                      transform: `scale(${Math.min(1.2, 0.8 + Math.abs(dragOffset.x) / 100)}) rotate(8deg)`,
                    }}
                    className="absolute inset-0 m-auto w-max h-max z-30 bg-neutral-900 text-white font-black text-xl sm:text-2xl px-6 py-3 rounded-2xl border-4 border-white shadow-2xl pointer-events-none tracking-wider"
                  >
                    ❌ PASAR
                  </div>
                )}

                {(dragOffset.y < -70 || swipeAction === 'up') && (
                  <div
                    style={{
                      opacity: Math.min(1, Math.abs(dragOffset.y) / 90),
                      transform: `scale(${Math.min(1.2, 0.8 + Math.abs(dragOffset.y) / 110)})`,
                    }}
                    className="absolute inset-0 m-auto w-max h-max z-30 bg-emerald-500 text-white font-black text-xl sm:text-2xl px-6 py-3 rounded-2xl border-4 border-white shadow-2xl pointer-events-none tracking-wider flex items-center gap-2"
                  >
                    <ShoppingBag className="w-7 h-7" />
                    <span>¡A LA COMANDA!</span>
                  </div>
                )}

                {/* Top Half: Photo */}
                <div className="relative h-[48%] w-full bg-neutral-900 overflow-hidden shrink-0">
                  <img
                    src={currentProduct.imageUrl}
                    alt={currentProduct.name}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    {currentProduct.isHouseFavorite && (
                      <span className="bg-amber-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Especial Rosarito</span>
                      </span>
                    )}
                    {currentProduct.origin && (
                      <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        {currentProduct.origin.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Half: Solid Dedicated High-Contrast Section */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between pointer-events-none bg-white dark:bg-[#0E1626]">
                  {/* Name & Price */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base sm:text-xl font-black leading-tight text-neutral-900 dark:text-white">
                        {currentProduct.name}
                      </h4>
                      <span className="text-base sm:text-xl font-black text-amber-600 dark:text-amber-400 shrink-0">
                        {formatCurrency(currentProduct.basePrice, currency)}
                      </span>
                    </div>

                    {/* Witty Picaresque Quote with High Contrast */}
                    <div className="mt-2 p-2.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-neutral-900 dark:text-white">
                      <p className="text-xs sm:text-sm font-bold leading-snug italic">
                        "{punchline}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom hint */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600 dark:text-neutral-300 pt-2 border-t border-black/10 dark:border-white/10">
                    <span>👈 Pasar | Like 👉</span>
                    <span className="text-amber-600 dark:text-amber-400 underline flex items-center gap-1 font-black">
                      <Info className="w-3.5 h-3.5" />
                      Toca para más info
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Tap Controls + Rewind Action */}
              <div className="flex items-center justify-center gap-3 pt-1 shrink-0">
                {/* Rewind button */}
                <button
                  onClick={handleUndo}
                  disabled={currentIndex === 0}
                  title="Volver a la carta anterior (Deshacer)"
                  className={`w-11 h-11 rounded-full border-2 border-amber-500/40 flex items-center justify-center active:scale-90 transition-transform shadow-md font-black ${
                    currentIndex === 0
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 opacity-40 cursor-not-allowed'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-black'
                  }`}
                >
                  <Undo2 className="w-5 h-5" />
                </button>

                {/* Pass (Left) */}
                <button
                  onClick={() => handleSwipe('left')}
                  title="Deslizar Izquierda (Pasar)"
                  className="w-13 h-13 rounded-full border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 hover:text-rose-500 hover:border-rose-500 flex items-center justify-center active:scale-90 transition-transform shadow-md font-black"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Add to Cart (Up) */}
                <button
                  onClick={() => handleSwipe('up')}
                  title="Swipe Arriba (Pedir)"
                  className={`py-3.5 px-5 rounded-2xl ${theme.styles.accent} font-black text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-transform shadow-xl`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pedir (Swipe Arriba)</span>
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Like / Favorite (Right) */}
                <button
                  onClick={() => handleSwipe('right')}
                  title="Deslizar Derecha (Favorito)"
                  className="w-13 h-13 rounded-full border-2 border-rose-400 bg-white dark:bg-neutral-800 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-md"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>
          )
        ) : (
          /* Step 3: Finished Summary */
          <div className="p-6 text-center space-y-5 flex-1 flex flex-col justify-center overflow-y-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className={`text-2xl font-black ${theme.styles.textPrimary}`}>¡Completaste tu Coffee Match!</h4>
              <p className={`text-xs sm:text-sm ${theme.styles.textSecondary}`}>
                Agregaste {addedItemsCount} producto(s) a tu comanda y guardaste {likedItems.length} favorito(s).
              </p>
            </div>

            {likedItems.length > 0 && (
              <div className="p-3 rounded-2xl border-2 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-1.5 text-left max-h-36 overflow-y-auto">
                <span className="text-[10px] font-black uppercase text-rose-500 block">
                  Tus Favoritos Guardados:
                </span>
                {likedItems.map((it) => (
                  <div key={it.id} className="text-xs font-bold truncate">
                    ❤️ {it.name} - {formatCurrency(it.basePrice, currency)}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleReset}
                className={`flex-1 py-3 text-xs font-black rounded-xl border-2 ${theme.styles.border} flex items-center justify-center gap-1.5`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jugar de Nuevo</span>
              </button>

              <button
                onClick={onClose}
                className={`flex-1 py-3 text-xs font-black text-white ${theme.styles.accent} ${theme.styles.buttonStyle}`}
              >
                Ver Comanda / Menú
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
