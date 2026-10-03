export const getCurrencySymbol = (ticker?: string): string => {
  if (!ticker) return '$';
  const upper = ticker.toUpperCase();
  if (upper.endsWith('.NS') || upper.endsWith('.BO')) return '₹';
  if (upper.endsWith('.L')) return '£';
  if (upper.endsWith('.DE') || upper.endsWith('.PA') || upper.endsWith('.AS') || upper.endsWith('.MI')) return '€';
  return '$';
};
