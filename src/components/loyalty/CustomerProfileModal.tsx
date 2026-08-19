import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../theme/ThemeContext';
import { useBarista } from '../../context/BaristaContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { triggerOrderConfetti } from '../../utils/confetti';
import { User, Award, Coffee, RotateCcw, Printer, X, Sparkles, Check } from 'lucide-react';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VISITS_STORAGE_KEY = 'costa_bruma_visits_count';
const CUSTOMER_NAME_KEY = 'costa_bruma_saved_customer_name';

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { orders, addToCart, setActiveTicketOrder } = useCart();
  const { currency } = useBarista();

  const [visitsCount, setVisitsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(VISITS_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem(CUSTOMER_NAME_KEY) || 'Amante del Café';
    } catch {
      return 'Amante del Café';
    }
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(customerName);

  // Auto-increment visits once per session
  useEffect(() => {
    const sessionKey = 'costa_bruma_session_recorded';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      setVisitsCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(VISITS_STORAGE_KEY, next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, []);

  if (!isOpen) return null;

  // Calculate stamps: 8 stamps per free coffee reward
  const totalStamps = (orders.length + visitsCount) % 8;
  const freeCoffeesEarned = Math.floor((orders.length + visitsCount) / 8);

  // Find most frequent item ordered
  const itemCounts: Record<string, { count: number; item: (typeof orders)[0]['items'][0] }> = {};
  orders.forEach((ord) => {
    ord.items.forEach((it) => {
      if (!itemCounts[it.product.id]) {
        itemCounts[it.product.id] = { count: 0, item: it };
      }
      itemCounts[it.product.id].count += it.quantity;
    });
  });

  const frequentItems = Object.values(itemCounts).sort((a, b) => b.count - a.count);

  const handleSaveName = () => {
    setCustomerName(tempName.trim() || 'Amante del Café');
    try {
      localStorage.setItem(CUSTOMER_NAME_KEY, tempName.trim() || 'Amante del Café');
    } catch {
      // ignore
    }
    setIsEditingName(false);
  };

  const handleRepeatOrder = (item: (typeof orders)[0]['items'][0]) => {
    addToCart(item.product, item.quantity, item.customizations, item.unitPrice);
    triggerOrderConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[90vh] flex flex-col ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl ${theme.styles.accent} flex items-center justify-center text-white shadow-md font-bold`}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-2 py-0.5 text-sm font-black rounded-lg border border-amber-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded-md bg-emerald-600 text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h3
                    onClick={() => setIsEditingName(true)}
                    className="font-black text-base cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <span>{customerName}</span>
                    <span className="text-[10px] text-amber-600 font-bold">✎</span>
                  </h3>
                </div>
              )}
              <p className={`text-xs ${theme.styles.textMuted}`}>
                {visitsCount} {visitsCount === 1 ? 'visita' : 'visitas'} a Costa Bruma • {orders.length} pedidos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Digital Stamp Card */}
          <div
            className={`p-4 rounded-2xl border-2 ${theme.styles.border} bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent space-y-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-700 dark:text-amber-300">
                <Award className="w-4 h-4" />
                <span>Tarjeta de Lealtad Rosarito Waves</span>
              </div>
              <span className="text-xs font-bold text-amber-600">
                {totalStamps} / 8 sellos
              </span>
            </div>

            {/* Stamp Circles */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, idx) => {
                const isStamped = idx < totalStamps;
                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${
                      isStamped
                        ? 'bg-amber-500 text-black border-amber-600 shadow-md font-black scale-105'
                        : 'border-dashed border-neutral-300 dark:border-neutral-700 bg-black/5 text-neutral-400'
                    }`}
                  >
                    {isStamped ? (
                      <Coffee className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium">
              🎁 <strong>Premio:</strong> Al juntar 8 sellos obtienes cualquier bebida de especialidad de la casa gratis en barra.
              {freeCoffeesEarned > 0 && (
                <span className="block text-emerald-600 font-bold mt-1">
                  🎉 ¡Tienes {freeCoffeesEarned} café(s) gratis acumulado(s)!
                </span>
              )}
            </p>
          </div>

          {/* Solicitudes / Pedidos Frecuentes */}
          <div className="space-y-2.5">
            <h4 className="font-black text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tus Pedidos Habituales</span>
            </h4>

            {frequentItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 text-center text-xs text-neutral-500">
                Haz tu primer pedido y tus bebidas favoritas se guardarán aquí para reordenar en 1 toque.
              </div>
            ) : (
              <div className="space-y-2">
                {frequentItems.slice(0, 2).map(({ item, count }) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border ${theme.styles.border} ${theme.styles.bgCard} flex items-center justify-between gap-2 shadow-xs`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-11 h-11 rounded-lg object-cover shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-xs truncate">{item.product.name}</h5>
                        <p className="text-[10px] text-neutral-500">
                          Pedido {count} {count === 1 ? 'vez' : 'veces'} • {formatCurrency(item.unitPrice, currency)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRepeatOrder(item)}
                      className={`px-3 py-1.5 text-xs font-black flex items-center gap-1 ${theme.styles.accent} ${theme.styles.buttonStyle} shrink-0`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Pedir de nuevo</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historial de Comandas */}
          <div className="space-y-2.5">
            <h4 className="font-black text-xs uppercase tracking-wider text-neutral-400">
              Historial de Comandas ({orders.length})
            </h4>

            {orders.length === 0 ? (
              <p className="text-xs text-neutral-500">No hay comandas registradas aún.</p>
            ) : (
              <div className="space-y-2">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className={`p-3 rounded-xl border ${theme.styles.border} bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="font-mono">#{ord.id}</span>
                        <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded">
                          {ord.orderType.toUpperCase()}
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          {formatDateTime(ord.createdAt)}
                        </span>
                      </div>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {ord.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                      </p>
                      <p className="font-black text-neutral-800 dark:text-neutral-200">
                        Total: {formatCurrency(ord.total, currency)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTicketOrder(ord);
                        onClose();
                      }}
                      className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-black/10"
                      title="Ver Ticket Térmico"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 flex justify-end">
          <button
            onClick={onClose}
            className={`px-5 py-2 text-xs font-bold text-white ${theme.styles.accent} ${theme.styles.buttonStyle}`}
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
