import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORY_LABEL, type Property } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { tx, useLang } from "@/lib/i18n";
import { listPublicListings } from "@/lib/listings.functions";
import { MIN_SAMPLE, groupStats } from "@/lib/market-stats";
import { PostFreeCta } from "@/components/post-free-cta";

export const Route = createFileRoute("/trends")({
  loader: async (): Promise<{ listings: Property[] }> => {
    try {
      return { listings: await listPublicListings({ data: { limit: 500 } }) };
    } catch {
      return { listings: [] };
    }
  },
  head: ({ loaderData }) => {
    const empty = groupStats(loaderData?.listings ?? []).length === 0;
    return seo(
      "Asking Prices by Area in Pakistan",
      "Median asking prices by area, computed from live ads on Diwaar. An area is shown only when it has enough live ads.",
      { path: "/trends", noindex: empty },
    );
  },
  component: TrendsPage });

function TrendsPage() {
  const currency = useAppStore((s) => s.currency);
  const { lang } = useLang();
  const { listings } = Route.useLoaderData();
  const rows = groupStats(listings, "area");
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{tx(lang, "Asking prices", "مانگی گئی قیمتیں")}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{tx(lang, "Asking prices by area", "علاقے کے حساب سے مانگی گئی قیمتیں")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {tx(
          lang,
          `Median asking prices from live ads on Diwaar. An area and property type is listed only when at least ${MIN_SAMPLE} live ads back it. We do not publish growth rates until we have enough history to measure them.`,
          `دیوار کے لائیو اشتہارات سے درمیانی مانگی گئی قیمتیں۔ کوئی علاقہ اور قسم تب ہی دکھائی جاتی ہے جب اس کے کم از کم ${MIN_SAMPLE} لائیو اشتہارات ہوں۔ جب تک ناپنے کے لیے کافی تاریخ نہ ہو، ہم اضافے کی شرح شائع نہیں کرتے۔`,
        )}
      </p>
      {rows.length === 0 ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-xl border border-border bg-white p-5 text-sm text-muted">
            {tx(
              lang,
              "No area has enough live ads yet to show a price. As people post, areas will appear here with the number of ads each figure is based on.",
              "ابھی کسی علاقے میں اتنے لائیو اشتہارات نہیں کہ قیمت دکھائی جا سکے۔ جیسے جیسے لوگ اشتہار لگائیں گے، علاقے یہاں نظر آئیں گے، اور ہر عدد کے ساتھ اشتہارات کی تعداد بھی۔",
            )}
          </p>
          <PostFreeCta />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-card">
          {rows.map((row) => (
            <li key={`${row.city}-${row.location}-${row.category}-${row.purpose}`}>
              <Link
                to="/search"
                search={{ purpose: row.purpose, city: row.city, location: row.location, type: row.category }}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 hover:bg-ice"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{row.location}</p>
                  <p className="text-sm text-muted">
                    {CATEGORY_LABEL[row.category]} · {row.purpose === "rent" ? tx(lang, "Rent", "کرایہ") : tx(lang, "Sale", "فروخت")} · {row.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold tabular-nums text-primary-dark">
                    {formatPkr(row.stat.median, currency)}
                    {row.purpose === "rent" ? tx(lang, " / mo", " / ماہ") : ""}
                  </p>
                  <p className="text-xs text-muted">
                    {tx(lang, `Based on ${row.stat.n} live ads on Diwaar`, `دیوار کے ${row.stat.n} لائیو اشتہارات کی بنیاد پر`)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
