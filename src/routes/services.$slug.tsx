import { createFileRoute, Link } from "@tanstack/react-router";
import { tx, useLang } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { serviceBySlug } from "@/lib/services";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = serviceBySlug(params.slug);
    if (!service) return seo("Service not found", "This diwaar.com service page is not available.", { noindex: true });
    return seo(service.title, service.description, { path: `/services/${params.slug}` });
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const { lang } = useLang();
  const service = serviceBySlug(slug);
  if (!service) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">{tx(lang, "Service not found", "خدمت نہیں ملی")}</p>
        <Link to="/services" className="text-primary text-sm font-semibold">
          {tx(lang, "All services", "تمام خدمات")}
        </Link>
      </div>
    );
  }
  const points = lang === "ur" ? service.pointsUr : service.points;
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {tx(lang, "Services", "خدمات")}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{tx(lang, service.title, service.titleUr)}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">{tx(lang, service.summary, service.summaryUr)}</p>
      <ol className="mt-8 space-y-3">
        {points.map((point) => (
          <li key={point} className="rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed shadow-card">
            {point}
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={service.cta.href}
          className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          {tx(lang, service.cta.label, service.cta.labelUr)}
        </a>
        {service.also && (
          <a
            href={service.also.href}
            className="inline-flex h-11 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold text-black"
          >
            {tx(lang, service.also.label, service.also.labelUr)}
          </a>
        )}
      </div>
      <Link to="/services" className="mt-8 inline-block text-sm font-semibold text-primary">
        {tx(lang, "All services", "تمام خدمات")}
      </Link>
    </article>
  );
}
