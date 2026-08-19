import React, { useState } from 'react';
import type { CompletedOrder } from '../../types/cart';
import { useTheme } from '../../theme/ThemeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { X, Printer, Check, Copy } from 'lucide-react';

interface ThermalTicketModalProps {
  order: CompletedOrder | null;
  onClose: () => void;
}

export const ThermalTicketModal: React.FC<ThermalTicketModalProps> = ({ order, onClose }) => {
  const { theme } = useTheme();
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('80mm');
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let txt = `COSTA BRUMA CAFÉ & TOSTADURÍA\n`;
    txt += `Blvd. Benito Juárez #450, Rosarito B.C.\n`;
    txt += `Orden: #${order.id} | ${formatDateTime(order.createdAt)}\n`;
    txt += `Cliente: ${order.customer.name}\n`;
    txt += `--------------------------------\n`;
    order.items.forEach((it) => {
      txt += `${it.quantity}x ${it.product.name} - ${formatCurrency(it.totalPrice)}\n`;
    });
    txt += `--------------------------------\n`;
    txt += `Total: ${formatCurrency(order.total)}\n`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[92vh] flex flex-col ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl overflow-hidden`}
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm sm:text-base">Ticket Térmico POS / Comanda</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* 58mm / 80mm toggle */}
            <div className="flex bg-black/5 dark:bg-white/10 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  paperWidth === '58mm' ? 'bg-white text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  paperWidth === '80mm' ? 'bg-white text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                80mm
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/10 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ticket Preview Scrollable Container */}
        <div className="p-6 overflow-y-auto bg-neutral-200 dark:bg-neutral-950 flex justify-center">
          {/* Real Thermal Ticket Sheet */}
          <div
            id="printable-ticket"
            className={`bg-[#FFFEFC] text-black font-mono text-xs p-6 shadow-xl border border-neutral-300 transition-all ${
              paperWidth === '58mm' ? 'w-[280px]' : 'w-[360px]'
            }`}
          >
            {/* Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-neutral-400">
              <h2 className="font-black text-base tracking-wider uppercase">Costa Bruma Café</h2>
              <p className="text-[11px] font-semibold">Tostaduría & Espresso Bar</p>
              <p className="text-[10px] text-neutral-600 leading-tight">
                Blvd. Benito Juárez #450, Centro
                <br />
                Playas de Rosarito, B.C., C.P. 22700
                <br />
                Tel: (661) 123-4567 • RFC: CBC-240818-BCA
              </p>
            </div>

            {/* Order meta */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 text-[11px] space-y-1">
              <div className="flex justify-between font-bold">
                <span>ORDEN: #{order.id}</span>
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENTE: {order.customer.name}</span>
              </div>
              {order.orderType === 'mesa' && (
                <div className="font-black text-xs bg-black text-white px-2 py-0.5 text-center mt-1">
                  MESA #{order.customer.tableNumber || '1'}
                </div>
              )}
              {order.orderType === 'barra-pickup' && (
                <div className="font-bold text-center bg-neutral-200 px-2 py-0.5 mt-1">
                  PARA LLEVAR / BARRA
                </div>
              )}
              {order.orderType === 'playa-delivery' && (
                <div className="font-bold text-center bg-neutral-200 px-2 py-0.5 mt-1">
                  PLAYA: {order.customer.deliverySpot || 'Rosarito'}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="py-3 border-b border-dashed border-neutral-400 space-y-2 text-[11px]">
              <div className="flex justify-between font-bold text-[10px] uppercase text-neutral-600 pb-1">
                <span>Cant / Producto</span>
                <span>Total</span>
              </div>

              {order.items.map((item, idx) => {
                const cust = item.customizations;
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>

                    {/* Modifiers */}
                    <div className="text-[10px] text-neutral-600 pl-3">
                      {cust.size && cust.size !== 'standard' && <div>• Tam: {cust.size}</div>}
                      {cust.milk && cust.milk !== 'ninguna' && <div>• Leche: {cust.milk}</div>}
                      {cust.ice && cust.ice !== 'caliente' && <div>• Hielo: {cust.ice}</div>}
                      {cust.extraShots > 0 && <div>• +{cust.extraShots} shot(s) extra</div>}
                      {cust.roastOrigin && <div>• Grano: {cust.roastOrigin}</div>}
                      {cust.syrups && cust.syrups.length > 0 && (
                        <div>• Jarabe: {cust.syrups.join(', ')}</div>
                      )}
                      {cust.specialInstructions && (
                        <div className="font-bold text-black">• "{cust.specialInstructions}"</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="py-3 border-b border-dashed border-neutral-400 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>PROPINA ({order.tipPercentage}%):</span>
                  <span>{formatCurrency(order.tipAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-dotted border-neutral-300">
                <span>TOTAL:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* WiFi & Footer */}
            <div className="pt-4 text-center space-y-2 text-[10px] text-neutral-600">
              <p className="font-bold text-black">WiFi Clientes: CostaBrumaCafe | Pass: RosaritoWaves</p>
              <p>¡Gracias por apoyar el comercio local de Playas de Rosarito!</p>
              
              {/* Fake Barcode graphic */}
              <div className="pt-2 flex flex-col items-center">
                <div className="h-9 w-44 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px,#fff_7px,#fff_9px)]" />
                <span className="text-[9px] tracking-widest mt-1">*{order.id}*</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar (Hidden in Print) */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-900 print:hidden">
          <button
            onClick={handleCopyText}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center gap-1.5 hover:bg-black/5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ticket POS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
