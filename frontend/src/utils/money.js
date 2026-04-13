/** Ledger amount formatting for the UI (values remain plain numbers in API payloads). */
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Display amounts in USD (UI only; stored values are plain numbers). */
export function formatMoney(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return usd.format(0);
  return usd.format(n);
}

/** e.g. +$1,234.56 or −$1,234.56 */
export function formatSignedMoney(isCredit, amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return usd.format(0);
  const formatted = usd.format(Math.abs(n));
  const sign = isCredit ? '+' : '−';
  return `${sign}${formatted}`;
}
