import React, { useState } from 'react';
import { useBarista } from '../../context/BaristaContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../theme/ThemeContext';
import { PRODUCTS } from '../../data/products';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { X, Coffee, Ban, CheckCircle2, History, Printer } from 'lucide-react';

export const BaristaStockToggleModal: React.FC = () => {
  const { isBaristaModalOpen, setIsBaristaModalOpen, outOfStockIds, toggleOutOfStock, currency } =
    useBarista();
  const { orders, setActiveTicketOrder } = useCart();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'stock' | 'orders'>('stock');

  if (!isBaristaModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Modo Barista / Control de Barra</h3>
              <p className={`text-xs ${theme.styles.textMuted}`}>
                Turno en Barra Rosarito • Control de Stock 86'd y Pedidos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBaristaModalOpen(false)}
            className="p-2 rounded-full hover:bg-black/10 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 px-4 pt-2">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'stock'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Disponibilidad / Stock 86'd ({outOfStockIds.length} agotados)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial de Comandas ({orders.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'stock' ? (
            <div className="space-y-3">
              <p className={`text-xs ${theme.styles.textSecondary}`}>
                Haz clic en cualquier producto para marcarlo como **Agotado (86'd)** o restablecerlo en tiempo real para los clientes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRODUCTS.map((prod) => {
                  const isOut = outOfStockIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleOutOfStock(prod.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isOut
                          ? 'border-rose-300 bg-rose-500/10 dark:border-rose-900'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className={`w-10 h-10 rounded-lg object-cover ${isOut ? 'grayscale' : ''}`}
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs truncate">{prod.name}</h4>
                          <span className="text-[11px] text-neutral-500">
                            {formatCurrency(prod.basePrice, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isOut ? (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            <span>Agotado</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Disponible</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Orders history */
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <History className="w-8 h-8 mx-auto text-neutral-400" />
                  <p className="text-sm font-semibold">Aún no hay comandas registradas</p>
                  <p className={`text-xs ${theme.styles.textMuted}`}>
                    Los pedidos generados desde la mesa o WhatsApp aparecerán aquí automáticamente.
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm">#{ord.id}</span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-1.5 py-0.5 rounded">
                          {ord.orderType.toUpperCase()}
                        </span>
                        <span className="text-neutral-400 text-[11px]">
                          {formatDateTime(ord.createdAt)}
                        </span>
                      </div>
                      <p className="font-semibold text-neutral-700 dark:text-neutral-200 mt-0.5">
                        {ord.customer.name} • {ord.items.length} productos
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Total: <strong>{formatCurrency(ord.total, currency)}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTicketOrder(ord);
                        setIsBaristaModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-bold flex items-center gap-1.5 hover:bg-black/5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Ver Ticket</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 flex justify-end">
          <button
            onClick={() => setIsBaristaModalOpen(false)}
            className={`px-4 py-2 text-xs font-bold text-white ${theme.styles.accent} ${theme.styles.buttonStyle}`}
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
