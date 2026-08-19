export const formatCurrency = (amountInMxn: number, currency: 'MXN' | 'USD' = 'MXN'): string => {
  if (currency === 'USD') {
    const usd = amountInMxn / 18.5;
    return `$${usd.toFixed(2)} USD`;
  }
  return `$${amountInMxn.toFixed(0)} MXN`;
};

export const generateOrderId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'CB-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const formatDateTime = (isoDate?: string): string => {
  const date = isoDate ? new Date(isoDate) : new Date();
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
