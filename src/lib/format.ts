export const MARLA_SQFT = 272.25;
export const KANAL_SQFT = MARLA_SQFT * 20;
export const SQYD_SQFT = 9;
export const ACRE_SQFT = KANAL_SQFT * 8;
export const USD_RATE = 280;

export type AreaUnit = "marla" | "kanal" | "sqft" | "sqyd";
export type Currency = "PKR" | "USD";

function trimNum(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatPkr(amount: number, currency: Currency = "PKR"): string {
  if (currency === "USD") {
    const usd = amount / USD_RATE;
    return `USD ${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
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

export const AREA_LABEL: Record<AreaUnit, string> = {
  marla: "Marla",
  kanal: "Kanal",
  sqyd: "Sq. Yd.",
  sqft: "Sq. Ft.",
};

export function formatArea(sqft: number, unit: AreaUnit): string {
  return `${trimNum(sqftTo(unit, sqft))} ${AREA_LABEL[unit]}`;
}

export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 4)} ${d.slice(4, 7)}${d.slice(7)}`;
  return raw;
}

export function waLink(phone: string, text?: string): string {
  const n = phone.replace(/\D/g, "").replace(/^0/, "92");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${n}${q}`;
}

export function relativeDate(iso: string): string {
  const days = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000),
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

export { trimNum };
