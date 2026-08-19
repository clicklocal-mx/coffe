import type { CompletedOrder } from '../types/cart';
import { formatCurrency } from './formatters';

const DEFAULT_COFFEE_SHOP_PHONE = '526612865423'; // Rosarito (+52 661 286 5423)
const LIVE_PWA_URL = 'https://clicklocal-mx.github.io/coffe/';

export const buildWhatsAppMessage = (order: CompletedOrder): string => {
  const dateStr = new Date().toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const typeLabels = {
    mesa: `🍽️ *Consumo en Mesa* ${order.customer.tableNumber ? `(Mesa #${order.customer.tableNumber})` : ''}`,
    'barra-pickup': '🛍️ *Pick-up en Barra* (Para llevar)',
    'playa-delivery': `🏖️ *Entrega en Playa / Zona Rosarito* (${order.customer.deliverySpot || 'Punto acordado'})`,
  };

  let message = `🌊 *NUEVO PEDIDO - COSTA BRUMA CAFÉ (ROSARITO)*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔖 *Orden:* #${order.id}\n`;
  message += `👤 *Cliente:* ${order.customer.name || 'Cliente'}\n`;
  if (order.customer.phone) {
    message += `📞 *Teléfono:* ${order.customer.phone}\n`;
  }
  message += `📍 *Modalidad:* ${typeLabels[order.orderType]}\n`;
  message += `🕒 *Hora:* ${dateStr}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  message += `☕ *DETALLE DEL PEDIDO:*\n`;

  order.items.forEach((item, index) => {
    message += `*${index + 1}. ${item.quantity}x ${item.product.name}* (${formatCurrency(item.totalPrice)})\n`;
    
    const cust = item.customizations;
    const details: string[] = [];

    if (cust.size && cust.size !== 'standard') details.push(`Tamaño: ${cust.size}`);
    if (cust.milk && cust.milk !== 'ninguna') details.push(`Leche: ${cust.milk}`);
    if (cust.ice && cust.ice !== 'caliente') details.push(`Hielo: ${cust.ice}`);
    if (cust.sweetness && cust.sweetness !== '0%') details.push(`Dulzura: ${cust.sweetness}`);
    if (cust.extraShots > 0) details.push(`+${cust.extraShots} shot(s) extra`);
    if (cust.roastOrigin) details.push(`Origen: ${cust.roastOrigin}`);
    if (cust.syrups && cust.syrups.length > 0) details.push(`Sabor: ${cust.syrups.join(', ')}`);
    if (cust.specialInstructions) details.push(`Nota: "${cust.specialInstructions}"`);

    if (details.length > 0) {
      details.forEach((d) => {
        message += `   └ ▫️ _${d}_\n`;
      });
    }
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💵 *Subtotal:* ${formatCurrency(order.subtotal)}\n`;
  if (order.tipAmount > 0) {
    message += `✨ *Propina al Barista (${order.tipPercentage}%):* ${formatCurrency(order.tipAmount)}\n`;
  }
  message += `🧾 *TOTAL A PAGAR:* *${formatCurrency(order.total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  
  if (order.customer.notes) {
    message += `💬 *Comentario:* ${order.customer.notes}\n\n`;
  }

  message += `🌐 *Ver Menú Digital / PWA:* ${LIVE_PWA_URL}\n`;
  message += `¡Muchas gracias por apoyar el café local de Playas de Rosarito! 🌊☕`;

  return message;
};

export const getWhatsAppUrl = (order: CompletedOrder, phoneNumber: string = DEFAULT_COFFEE_SHOP_PHONE): string => {
  const text = buildWhatsAppMessage(order);
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
