import { Link } from "@tanstack/react-router";
import { formatPkr } from "@/lib/format";
import { tx, useLang } from "@/lib/i18n";
import { MIN_SAMPLE, hasAnyStat, summarizePrices, type PriceStat } from "@/lib/market-stats";
import { useAppStore } from "@/lib/store";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Median asking prices for a place, computed from live public ads only.
 * Each figure needs MIN_SAMPLE+ ads and says how many ads it is based on.
 * With too few ads it shows an honest empty state instead of a number.
 */
export function LivePriceStats({
  listings,
  place,
  className,
  hideWhenEmpty,
}: {
  listings: Property[];
  place: string;
  className?: string;
  /** Render nothing (instead of the empty-state note) when no figure qualifies. */
  hideWhenEmpty?: boolean;
}) {
  const { lang } = useLang();
  const currency = useAppStore((s) => s.currency);
  const s = summarizePrices(listings);

  if (!hasAnyStat(s)) {
    if (hideWhenEmpty) return null;
    return (
      <section className={cn("rounded-xl border border-border bg-white p-5", className)}>
        <h2 className="text-lg font-semibold text-black">
          {tx(lang, `Asking prices in ${place}`, `${place} میں مانگی گئی قیمتیں`)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {tx(
            lang,
            `Not enough live ads in ${place} yet to show a price. Diwaar shows a median only when at least ${MIN_SAMPLE} live ads back it, so every figure is real.`,
            `${place} میں ابھی اتنے اشتہارات نہیں کہ قیمت دکھائی جا سکے۔ دیوار اوسط قیمت تب ہی دکھاتی ہے جب کم از کم ${MIN_SAMPLE} لائیو اشتہارات ہوں، تاکہ ہر عدد اصل ہو۔`,
          )}
        </p>
        <Link to="/add" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
          {tx(lang, "Post your property free", "مفت اشتہار لگائیں")}
        </Link>
      </section>
    );
  }

  const cards: { key: string; label: string; stat: PriceStat | null; monthly?: boolean }[] = [
    { key: "house", label: tx(lang, "Houses for sale", "فروخت کے مکان"), stat: s.saleHouse },
    { key: "plot", label: tx(lang, "Plots for sale", "فروخت کے پلاٹ"), stat: s.salePlot },
    { key: "flat", label: tx(lang, "Flats for sale", "فروخت کے فلیٹ"), stat: s.saleFlat },
    { key: "rent", label: tx(lang, "Monthly rent", "ماہانہ کرایہ"), stat: s.rent, monthly: true },
  ];

  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-black">
        {tx(lang, `Median asking prices in ${place}`, `${place} میں درمیانی مانگی گئی قیمت`)}
      </h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards
          .filter((c) => c.stat)
          .map((c) => (
            <div key={c.key} className="rounded-xl border border-border bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{c.label}</dt>
              <dd className="mt-1 text-lg font-bold tabular-nums text-black">
                {formatPkr(c.stat!.median, currency)}
                {c.monthly ? tx(lang, " / mo", " / ماہ") : ""}
              </dd>
              <dd className="mt-1 text-xs text-muted">
                {tx(lang, `Based on ${c.stat!.n} live ads on Diwaar`, `دیوار کے ${c.stat!.n} لائیو اشتہارات کی بنیاد پر`)}
              </dd>
            </div>
          ))}
      </dl>
      <p className="mt-2 text-xs text-muted">
        {tx(
          lang,
          `Asking prices, not sale prices. A type is shown only when at least ${MIN_SAMPLE} live ads exist for it.`,
          `یہ مانگی گئی قیمتیں ہیں، فروخت کی نہیں۔ کوئی قسم تب ہی دکھائی جاتی ہے جب اس کے کم از کم ${MIN_SAMPLE} لائیو اشتہارات ہوں۔`,
        )}
      </p>
    </section>
  );
}
