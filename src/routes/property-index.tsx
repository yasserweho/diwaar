import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORY_LABEL, type Property } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { tx, useLang } from "@/lib/i18n";
import { listPublicListings } from "@/lib/listings.functions";
import { MIN_SAMPLE, groupStats } from "@/lib/market-stats";
import { PostFreeCta } from "@/components/post-free-cta";

export const Route = createFileRoute("/property-index")({
  loader: async (): Promise<{ listings: Property[] }> => {
    try {
      return { listings: await listPublicListings({ data: { limit: 500 } }) };
    } catch {
      return { listings: [] };
    }
  },
  head: ({ loaderData }) => {
    const empty = groupStats(loaderData?.listings ?? [], "city").length === 0;
    return seo(
      "Pakistan Property Prices by City",
      "Median asking prices for houses, plots, flats and rents by city, computed from live ads on Diwaar.",
      { path: "/property-index", noindex: empty },
    );
  },
  component: IndexPage });

function IndexPage() {
  const currency = useAppStore((s) => s.currency);
  const { lang } = useLang();
  const { listings } = Route.useLoaderData();
  const rows = groupStats(listings, "city");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{tx(lang, "Price index", "قیمت انڈیکس")}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{tx(lang, "Asking prices by city", "شہر کے حساب سے مانگی گئی قیمتیں")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {tx(
          lang,
          `Median asking price per city and property type, from live ads on Diwaar. A row appears only when at least ${MIN_SAMPLE} live ads back it. These are asking prices, not sale prices or a valuation.`,
          `دیوار کے لائیو اشتہارات سے ہر شہر اور قسم کی درمیانی مانگی گئی قیمت۔ کوئی قطار تب ہی دکھائی جاتی ہے جب اس کے کم از کم ${MIN_SAMPLE} لائیو اشتہارات ہوں۔ یہ مانگی گئی قیمتیں ہیں، فروخت کی قیمت یا تخمینہ نہیں۔`,
        )}
      </p>
      {rows.length === 0 ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-xl border border-border bg-white p-5 text-sm text-muted">
            {tx(
              lang,
              "No city has enough live ads yet to show a price. We would rather show nothing than a made-up index. Figures will appear here as people post.",
              "ابھی کسی شہر میں اتنے لائیو اشتہارات نہیں کہ قیمت دکھائی جا سکے۔ ہم بنایا ہوا انڈیکس دکھانے کے بجائے کچھ نہ دکھانا بہتر سمجھتے ہیں۔ جیسے جیسے لوگ اشتہار لگائیں گے، اعداد یہاں آئیں گے۔",
            )}
          </p>
          <PostFreeCta />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">{tx(lang, "City", "شہر")}</th>
                <th className="px-4 py-3">{tx(lang, "Type", "قسم")}</th>
                <th className="px-4 py-3 text-right">{tx(lang, "Median asking", "درمیانی قیمت")}</th>
                <th className="px-4 py-3 text-right">{tx(lang, "Live ads", "لائیو اشتہارات")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.city}-${row.category}-${row.purpose}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    <Link to="/search" search={{ purpose: row.purpose, city: row.city, type: row.category }} className="hover:text-primary">
                      {row.city}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {CATEGORY_LABEL[row.category]} · {row.purpose === "rent" ? tx(lang, "Rent", "کرایہ") : tx(lang, "Sale", "فروخت")}
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">
                    {formatPkr(row.stat.median, currency)}
                    {row.purpose === "rent" ? tx(lang, " / mo", " / ماہ") : ""}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{row.stat.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-muted">{tx(lang, "Based on live ads on Diwaar.", "دیوار کے لائیو اشتہارات کی بنیاد پر۔")}</p>
        </div>
      )}
      <Link to="/trends" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">
        {tx(lang, "See prices by area", "علاقے کے حساب سے قیمتیں دیکھیں")}
      </Link>
    </div>
  );
}
