import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { useTheme } from '../../theme/ThemeContext';
import { CartItemRow } from './CartItemRow';
import type { OrderType } from '../../types/cart';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppUrl } from '../../utils/whatsappOrder';
import { triggerOrderConfetti } from '../../utils/confetti';
import { X, ShoppingBag, Send, Printer, Trash2, HeartHandshake, MapPin } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, subtotal, clearCart, addOrder, setActiveTicketOrder } =
    useCart();
  const { currency } = useBarista();
  const { theme } = useTheme();

  const [orderType, setOrderType] = useState<OrderType>('mesa');
  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem('costa_bruma_saved_customer_name') || '';
    } catch {
      return '';
    }
  });
  const [tableNumber, setTableNumber] = useState('4');
  const [deliverySpot, setDeliverySpot] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);

  if (!isCartOpen) return null;

  const tipAmount = Math.round((subtotal * tipPercentage) / 100);
  const total = subtotal + tipAmount;

  const handlePlaceOrder = (actionType: 'whatsapp' | 'ticket') => {
    if (cart.length === 0) return;

    const completed = addOrder({
      items: [...cart],
      subtotal,
      tipAmount,
      tipPercentage,
      total,
      orderType,
      customer: {
        name: customerName.trim() || 'Cliente de Rosarito',
        phone: customerPhone.trim() || undefined,
        tableNumber: orderType === 'mesa' ? tableNumber : undefined,
        deliverySpot: orderType === 'playa-delivery' ? deliverySpot : undefined,
        notes: notes.trim() || undefined,
      },
    });

    triggerOrderConfetti();

    if (actionType === 'whatsapp') {
      const url = getWhatsAppUrl(completed);
      window.open(url, '_blank');
      setIsCartOpen(false);
    } else if (actionType === 'ticket') {
      setActiveTicketOrder(completed);
      setIsCartOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full flex flex-col ${theme.styles.bgCard} shadow-2xl border-l-2 ${theme.styles.border} animate-in slide-in-from-right duration-300 relative`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl ${theme.styles.accent} flex items-center justify-center shadow-sm`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-black text-base ${theme.styles.textPrimary}`}>Comanda & Pedido</h3>
              <p className={`text-xs ${theme.styles.textMuted}`}>
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'} seleccionados
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-black/10 transition-colors text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h4 className={`font-black text-base ${theme.styles.textPrimary}`}>Tu comanda está vacía</h4>
              <p className={`text-xs ${theme.styles.textSecondary} mt-1 max-w-xs font-medium`}>
                Explora nuestras opciones de espresso, cold brews y panadería artesanal para comenzar tu pedido.
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className={`px-5 py-2.5 text-xs font-black ${theme.styles.accent} ${theme.styles.buttonStyle}`}
            >
              Ver Menú
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
            {/* Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-neutral-400">
                <span>PRODUCTOS</span>
                <button
                  onClick={clearCart}
                  className="text-rose-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vaciar</span>
                </button>
              </div>

              {cart.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Modalidad de Consumo */}
            <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
              <label className="font-black uppercase tracking-wider text-neutral-400 block">
                Modalidad de Entrega
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'mesa', label: '🍽️ En Mesa' },
                  { id: 'barra-pickup', label: '🛍️ Pick-up' },
                  { id: 'playa-delivery', label: '🏖️ Playa/Baja' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id as OrderType)}
                    className={`py-2 px-1 text-center rounded-xl border-2 font-black transition-all ${
                      orderType === type.id
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border}`
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Conditional Location Input */}
              {orderType === 'mesa' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-bold text-neutral-500 shrink-0">Número de Mesa:</span>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Ej. 4"
                    className={`w-20 px-3 py-1.5 rounded-lg border-2 ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary} font-black text-center`}
                  />
                </div>
              )}

              {orderType === 'playa-delivery' && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-1 text-cyan-600 font-black">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Punto de Entrega en Rosarito:</span>
                  </div>
                  <input
                    type="text"
                    value={deliverySpot}
                    onChange={(e) => setDeliverySpot(e.target.value)}
                    placeholder="Ej. Frente a hotel Rosarito Beach / Muelle / Dunas"
                    className={`w-full px-3 py-1.5 rounded-lg border-2 ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary}`}
                  />
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
              <label className="font-black uppercase tracking-wider text-neutral-400 block">
                Tus Datos
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Tu Nombre (para llamarte por la comanda)"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary} font-bold`}
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Teléfono / WhatsApp (opcional)"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary}`}
                />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales (ej. 'Mug para llevar', 'Factura'...)"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary}`}
                />
              </div>
            </div>

            {/* Tip Selector */}
            <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <label className="font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                  <span>Propina para el Equipo de Baristas</span>
                </label>
                <span className="font-black text-amber-600">
                  {formatCurrency(tipAmount, currency)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercentage(pct)}
                    className={`py-1.5 text-xs font-black rounded-lg border-2 transition-all ${
                      tipPercentage === pct
                        ? `${theme.styles.accent} border-transparent shadow-xs`
                        : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border}`
                    }`}
                  >
                    {pct === 0 ? 'Sin Propina' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer & Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 space-y-3">
            {/* Subtotal & Total Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex items-center justify-between text-amber-600">
                  <span>Propina Baristas ({tipPercentage}%):</span>
                  <span className="font-semibold">{formatCurrency(tipAmount, currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-black pt-1 border-t border-black/10 dark:border-white/10">
                <span className={theme.styles.textPrimary}>Total a Pagar:</span>
                <span className={`text-lg font-black ${theme.styles.textPrimary}`}>
                  {formatCurrency(total, currency)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handlePlaceOrder('whatsapp')}
                className="py-3 px-3 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Pedir WhatsApp</span>
              </button>

              <button
                onClick={() => handlePlaceOrder('ticket')}
                className={`py-3 px-3 text-xs font-black flex items-center justify-center gap-1.5 ${theme.styles.accent} ${theme.styles.buttonStyle} shadow-md`}
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ticket</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
