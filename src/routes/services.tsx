import { createFileRoute, Link } from "@tanstack/react-router";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { tx, useLang } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () =>
    seo(
      "Property Services in Pakistan",
      "List a property, search houses, plots, flats and shops, check prices, estimate a loan or build cost, and find an agent on diwaar.com.",
      { path: "/services" },
    ),
  component: ServicesPage,
});

function ServicesPage() {
  const { lang } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {tx(lang, "Services", "خدمات")}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "What you can do on diwaar.com", "diwaar.com پر آپ کیا کر سکتے ہیں")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {tx(
          lang,
          "Listing, rentals, price checks, home-loan estimates, sale papers and agents. Each page explains the service and opens the tool.",
          "اشتہار، کرایہ، قیمت، ہوم لون کا اندازہ، فروخت کے کاغذات اور ایجنٹ۔ ہر صفحہ خدمت بتاتا ہے اور اوزار کھولتا ہے۔",
        )}
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            to="/services/$slug"
            params={{ slug: s.slug }}
            className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover"
          >
            <h2 className="text-lg font-semibold text-black">{tx(lang, s.title, s.titleUr)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tx(lang, s.summary, s.summaryUr)}</p>
          </Link>
        ))}
      </div>
      <RelatedLinks links={[PAGE.sale, PAGE.rent, PAGE.locations, PAGE.guides, PAGE.add, PAGE.faq]} />
    </div>
  );
}
