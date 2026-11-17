import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  Heart,
  MapPin,
  Maximize2,
  Phone,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PropertyCard } from "@/components/property-card";
import { ListingBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProperty, similarTo } from "@/lib/data";
import { cityLabel, tx, useLang } from "@/lib/i18n";
import { ShareBar } from "@/components/share-bar";
import { formatArea, formatPhone, formatPrice, relativeDate, waLink } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { CATEGORY_LABEL } from "@/lib/types";
import { seo } from "@/lib/seo";
import { breadcrumbLd, listingLd, withSchema } from "@/lib/schema";
import { getPublicListing } from "@/lib/listings.functions";
import { areaSlug, citySlug } from "@/lib/location-pages";

export const Route = createFileRoute("/property/$id")({
  loader: async ({ params }) => {
    if (!params.id.startsWith("user-")) return { listing: null };
    try {
      return { listing: await getPublicListing({ data: { id: params.id } }) };
    } catch {
      return { listing: null };
    }
  },
  head: ({ params, loaderData }) => {
    const path = `/property/${params.id}`;
    const property = loaderData?.listing ?? (params.id.startsWith("user-") ? undefined : getProperty(params.id));
    if (!property) {
      return seo(
        params.id.startsWith("user-") ? "Your listing preview" : "Listing not found",
        params.id.startsWith("user-")
          ? "This listing is not public yet or is no longer available."
          : "This Diwaar listing is no longer available.",
        { noindex: true, path },
      );
    }
    const place = [property.location, property.city].filter(Boolean).join(", ");
    const deal = property.purpose === "rent" ? "for rent" : "for sale";
    const facts = [
      property.beds ? `${property.beds} beds` : "",
      property.baths ? `${property.baths} baths` : "",
      `${Math.round(property.areaSqft).toLocaleString("en")} sq ft`,
      `PKR ${property.price.toLocaleString("en")}${property.purpose === "rent" ? " per month" : ""}`,
    ]
      .filter(Boolean)
      .join(", ");
    const cityPath = `/locations/${citySlug(property.city)}`;
    return withSchema(
      seo(
        `${property.title} ${deal} in ${place}`,
        `${property.title} ${deal} in ${place}: ${facts}. Contact the owner directly on Diwaar.`.slice(0, 300),
        { path, image: property.images[0] },
      ),
      listingLd(property, path),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: property.city, path: cityPath },
        { name: property.location, path: `${cityPath}/${areaSlug(property.city, property.location)}` },
        { name: property.title, path },
      ]),
    );
  },
  component: PropertyPage,
});

function usePropertyExtra() {
  const local = useAppStore((s) => s.userListings);
  const published = Route.useLoaderData()?.listing;
  return published ? [...local, published] : local;
}

function PropertyPage() {
  const { id } = Route.useParams();
  const extra = usePropertyExtra();
  const property = getProperty(id, extra);
  const navigate = useNavigate();
  const isPublic = !!Route.useLoaderData()?.listing;
  const isLocal = id.startsWith("user-") && !isPublic;
  const [ready, setReady] = useState(!isLocal);
  const { lang } = useLang();

  useEffect(() => {
    if (!isLocal) return;
    let alive = true;
    // Ensure persisted store is loaded on the client before deciding a local listing is missing.
    void useAppStore.persist.rehydrate().then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [isLocal]);

  if (isLocal && !ready) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-bold text-lg">{tx(lang, "Opening the listing\u2026", "اشتہار کھل رہا ہے\u2026")}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-bold text-lg">{tx(lang, "Listing not found", "اشتہار نہیں ملا")}</p>
        <p className="mt-2 text-sm text-muted">
          {tx(
            lang,
            "This listing has been removed or is no longer available. If you posted it, check My ads.",
            "یہ اشتہار ہٹا دیا گیا ہے یا اب دستیاب نہیں۔ اگر یہ آپ کا اشتہار ہے تو میرے اشتہارات دیکھیں۔",
          )}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {id.startsWith("user-") && (
            <Button onClick={() => void navigate({ to: "/my-ads" })}>{tx(lang, "Go to My ads", "میرے اشتہارات")}</Button>
          )}
          <Button variant="outline" onClick={() => void navigate({ to: "/search" })}>
            {tx(lang, "Back to search", "تلاش پر واپس")}
          </Button>
        </div>
      </div>
    );
  }

  return <PropertyBody />;
}

function PropertyBody() {
  const { id } = Route.useParams();
  const extra = usePropertyExtra();
  const property = getProperty(id, extra)!;
  const unit = useAppStore((s) => s.areaUnit);
  const currency = useAppStore((s) => s.currency);
  const saved = useAppStore((s) => s.savedIds.includes(property.id));
  const toggle = useAppStore((s) => s.toggleSaved);
  const posterName = property.contactName;
  const posterPhone = property.contactPhone;
  const [shot, setShot] = useState(0);
  const similar = similarTo(property, extra);
  const noteRecent = useAppStore((s) => s.noteRecent);
  const compared = useAppStore((s) => s.compareIds.includes(property.id));
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const reported = useAppStore((s) => s.reported.includes(property.id));
  const { lang } = useLang();
  const reportListing = useAppStore((s) => s.reportListing);
  const img = property.images[shot] ?? property.images[0];

  useEffect(() => {
    noteRecent(property.id);
  }, [noteRecent, property.id]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-24 lg:pb-5">
      <Link
        to="/search"
        search={{ purpose: property.purpose, city: property.city }}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-primary mb-4"
      >
        <ChevronLeft className="size-4" /> Back to results
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl bg-ice">
            <img src={img} alt={property.title} width={1200} height={675} className="aspect-16/10 w-full object-cover" />
          </div>
          {property.images.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
              {property.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setShot(i)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-md ${
                    i === shot ? "ring-2 ring-primary" : "ring-1 ring-border"
                  }`}
                >
                  <img src={src} alt={`${property.title}, photo ${i + 1}`} width={1200} height={675} loading="lazy" decoding="async" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-surface p-5 shadow-card">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {property.badges.map((b) => (
                <ListingBadge key={b} kind={b} />
              ))}
              <span className="text-xs text-muted ml-auto">{relativeDate(property.createdAt)}</span>
            </div>
            <p className="text-2xl font-extrabold tabular-nums text-primary-dark">
              {formatPrice(property.price, property.purpose, currency)}
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight">{property.title}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-muted">
              <MapPin className="mt-0.5 size-4 text-primary shrink-0" />
              {property.areaName}, {property.location}, {property.city}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {property.beds != null && (
                <Spec icon={BedDouble} label="Beds" value={String(property.beds)} />
              )}
              {property.baths != null && (
                <Spec icon={Bath} label="Baths" value={String(property.baths)} />
              )}
              <Spec icon={Maximize2} label="Area" value={formatArea(property.areaSqft, unit)} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Row k="Type" v={CATEGORY_LABEL[property.category]} />
              <Row k="Purpose" v={property.purpose === "rent" ? "For rent" : "For sale"} />
              {property.yearBuilt && <Row k="Year built" v={String(property.yearBuilt)} />}
              {property.floors && <Row k="Floors" v={String(property.floors)} />}
              {property.furnished && <Row k="Furnishing" v={property.furnished} />}
              {property.plotType && <Row k="Plot type" v={property.plotType} />}
            </dl>
          </div>

          <ShareBar
            className="mt-4"
            path={`/property/${property.id}`}
            campaign="listing"
            title={{ en: "Share this ad on WhatsApp", ur: "یہ اشتہار واٹس ایپ پر بھیجیں" }}
            en={`${property.title}, ${property.purpose === "rent" ? "for rent" : "for sale"} in ${property.location}, ${property.city}: ${formatPrice(property.price, property.purpose, "PKR")}. See photos and call the owner on Diwaar.com:`}
            ur={`${property.title}، ${property.location}، ${cityLabel(property.city, "ur")} میں ${property.purpose === "rent" ? "کرایے کے لیے" : "برائے فروخت"}: ${formatPrice(property.price, property.purpose, "PKR")}۔ تصاویر دیکھیں اور مالک سے رابطہ کریں:`}
          />

          <div className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
            <h2 className="font-bold text-primary-dark">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg">{property.description}</p>
          </div>

          <div className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
            <h2 className="font-bold text-primary-dark">Amenities</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-verified shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 h-fit space-y-4">
          <div className="rounded-2xl bg-surface p-5 shadow-card">
            <p className="text-sm font-semibold text-muted">Listed by</p>
            {posterName ? (
              <>
                <p className="mt-3 text-lg font-bold">{posterName}</p>
                {posterPhone ? (
                  <div className="mt-4 grid gap-2">
                    <a
                      href={`tel:${posterPhone}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-primary-fg text-sm font-semibold"
                    >
                      <Phone className="size-4" /> Call {formatPhone(posterPhone)}
                    </a>
                    <a
                      href={waLink(posterPhone, `Hi, I'm interested in ${property.title} on Diwaar (${property.id})`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-verified text-primary-fg text-sm font-semibold hover:opacity-90"
                    >
                      WhatsApp
                    </a>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">Add your phone on My ads so buyers can call.</p>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm">Owner listed this property on Diwaar.</p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => toggle(property.id)}>
                <Heart className={saved ? "fill-hot text-hot" : ""} /> {saved ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const url = window.location.href;
                  const share = navigator.share?.({ title: property.title, url });
                  if (share) {
                    void share.catch(() => {
                      void navigator.clipboard?.writeText(url).then(
                        () => toast.success("Link copied"),
                        () => toast.error("Couldn't share this listing"),
                      );
                    });
                    return;
                  }
                  void navigator.clipboard?.writeText(url).then(
                    () => toast.success("Link copied"),
                    () => toast.error("Couldn't copy the link"),
                  );
                }}
              >
                <Share2 /> Share
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const ok = toggleCompare(property.id);
                  if (!ok) toast.error("Compare holds 3 listings. Remove one first.");
                  else toast.success(compared ? "Removed from compare" : "Added to compare");
                }}
              >
                {compared ? "In compare" : "Compare"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  reportListing(property.id);
                  toast.success(reported ? "Already reported" : "Report sent to the Diwaar desk");
                }}
              >
                {reported ? "Reported" : "Report"}
              </Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {tx(
                lang,
                "diwaar.com takes no commission on this ad. Confirm the title and the society file before you pay a token.",
                "diwaar.com اس اشتہار پر کمیشن نہیں لیتی۔ ٹوکن سے پہلے نام اور سوسائٹی کی فائل کی تصدیق کریں۔",
              )}
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-extrabold text-primary-dark mb-4">Similar listings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} layout="grid" />
            ))}
          </div>
        </section>
      )}

      {posterPhone && (
        <div
          className="safe-callbar fixed inset-x-0 z-30 flex gap-2 border-t border-border bg-surface px-3 py-2 md:hidden"
        >
          <a
            href={`tel:${posterPhone.replace(/\s/g, "")}`}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-fg"
          >
            <Phone className="size-4" /> Call
          </a>
          <a
            href={waLink(
              posterPhone,
              `Hi, I'm interested in ${property.title} on Diwaar (${property.id})`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-verified text-sm font-semibold text-primary-fg"
          >
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-ice p-3 text-center">
      <Icon className="mx-auto size-4 text-primary" />
      <p className="mt-1 text-sm font-bold">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-border py-2">
      <dt className="text-muted">{k}</dt>
      <dd className="font-semibold capitalize">{v}</dd>
    </div>
  );
}
