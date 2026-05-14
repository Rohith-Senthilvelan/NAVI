export type FormatAEDOptions = {
  /** Use compact notation for large values (e.g. AED 4.2K) */
  compact?: boolean;
  /** Decimal places when not compact (default 0–2 from amount) */
  decimals?: number;
  /** Append suffix such as "/mo" */
  suffix?: string;
};

export function formatAED(amount: number, opts: FormatAEDOptions = {}): string {
  const { compact = false, decimals, suffix = "" } = opts;

  if (compact && Math.abs(amount) >= 1000) {
    const formatted = new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
    return `${formatted}${suffix}`;
  }

  const fractionDigits =
    decimals ??
    (Number.isInteger(amount) ? 0 : amount % 1 === 0 ? 0 : 2);

  const formatted = new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);

  return `${formatted}${suffix}`;
}
