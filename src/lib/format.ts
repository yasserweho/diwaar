export const MARLA_SQFT = 272.25;
export const KANAL_SQFT = MARLA_SQFT * 20;
export const SQYD_SQFT = 9;
export const ACRE_SQFT = KANAL_SQFT * 8;

export type AreaUnit = "marla" | "kanal" | "sqft" | "sqyd";
export type Currency = "PKR" | "USD" | "AED" | "GBP";

const FX: Record<Exclude<Currency, "PKR">, { code: string; rate: number }> = {
  USD: { code: "USD", rate: 280 },
  AED: { code: "AED", rate: 76 },
  GBP: { code: "GBP", rate: 370 },
};

export function trimNum(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatPkr(amount: number, currency: Currency = "PKR"): string {
  if (currency !== "PKR") {
    const { code, rate } = FX[currency];
    const n = amount / rate;
    return `${code} ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  if (amount >= 10_000_000) return `PKR ${trimNum(amount / 10_000_000)} Crore`;
  if (amount >= 100_000) return `PKR ${trimNum(amount / 100_000)} Lakh`;
  return `PKR ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function formatPrice(
  amount: number,
  purpose: "buy" | "rent",
  currency: Currency = "PKR",
): string {
  const base = formatPkr(amount, currency);
  return purpose === "rent" ? `${base} / month` : base;
}

export function sqftTo(unit: AreaUnit, sqft: number): number {
  switch (unit) {
    case "marla":
      return sqft / MARLA_SQFT;
    case "kanal":
      return sqft / KANAL_SQFT;
    case "sqyd":
      return sqft / SQYD_SQFT;
    default:
      return sqft;
  }
}

export const AREA_LABEL: Record<AreaUnit, string> = {
  marla: "Marla",
  kanal: "Kanal",
  sqft: "Sq. Ft.",
  sqyd: "Sq. Yd.",
};

export function formatArea(sqft: number, unit: AreaUnit): string {
  return `${trimNum(sqftTo(unit, sqft))} ${AREA_LABEL[unit]}`;
}

export function toSqft(value: number, unit: AreaUnit): number {
  switch (unit) {
    case "marla":
      return value * MARLA_SQFT;
    case "kanal":
      return value * KANAL_SQFT;
    case "sqyd":
      return value * SQYD_SQFT;
    default:
      return value;
  }
}

export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return phone;
}

export function waLink(phone: string, text: string): string {
  const d = phone.replace(/\D/g, "");
  const intl = d.startsWith("0") ? `92${d.slice(1)}` : d;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return iso;
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}
