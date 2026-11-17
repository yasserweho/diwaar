import { createFileRoute, Link } from "@tanstack/react-router";
import { SOCIETIES } from "@/lib/portal";
import { seo } from "@/lib/seo";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/maps")({
  // No real plot maps yet, so the page stays out of search results.
  head: () =>
    seo(
      "Society Plot Maps in Pakistan",
      "Society plot maps are coming soon on Diwaar. Until then, browse live plot ads by society.",
      { path: "/maps", noindex: true },
    ),
  component: MapsPage });

function MapsPage() {
  const { lang } = useLang();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{tx(lang, "Plot finder", "پلاٹ فائنڈر")}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{tx(lang, "Society plot maps are coming soon", "سوسائٹی کے پلاٹ نقشے جلد آ رہے ہیں")}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        {tx(
          lang,
          "We will only show a plot as open, on token or sold when that comes from the society or from a live ad. Until then, open a society below to see the plot ads people have actually posted there. Always confirm a file with the society before you pay a token.",
          "ہم کسی پلاٹ کو کھلا، ٹوکن پر یا فروخت شدہ تب ہی دکھائیں گے جب یہ معلومات سوسائٹی یا کسی لائیو اشتہار سے آئے۔ تب تک نیچے سوسائٹی کھولیں اور وہاں لگے اصل پلاٹ اشتہارات دیکھیں۔ ٹوکن دینے سے پہلے ہمیشہ سوسائٹی سے فائل کی تصدیق کریں۔",
        )}
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {SOCIETIES.map((s) => (
          <li key={s.id}>
            <Link
              to="/search"
              search={{ purpose: "buy", city: s.city, location: s.location, type: "plot" }}
              className="block rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/40"
            >
              <p className="font-semibold text-black">{s.name}</p>
              <p className="mt-0.5 text-sm text-muted">
                {tx(lang, `Plot ads in ${s.location}, ${s.city}`, `${s.location}، ${s.city} میں پلاٹ کے اشتہارات`)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
