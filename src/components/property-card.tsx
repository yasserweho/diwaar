import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import { ListingBadge } from "@/components/ui/badge";
import { getAgent } from "@/lib/data";
import { formatArea, formatPrice } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Property } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
  layout = "list",
}: {
  property: Property;
  layout?: "list" | "grid";
}) {
  const unit = useAppStore((s) => s.areaUnit);
  const currency = useAppStore((s) => s.currency);
  const saved = useAppStore((s) => s.savedIds.includes(property.id));
  const toggle = useAppStore((s) => s.toggleSaved);
  const agent = getAgent(property.agencyId);

  return (
    <article
      className={cn(
        "group relative overflow-hidden border border-border bg-white transition-colors duration-fast hover:border-primary/40",
        layout === "list"
          ? "rounded-xl md:grid md:grid-cols-[280px_1fr]"
          : "rounded-xl flex flex-col",
      )}
    >
      <Link
        to="/property/$id"
        params={{ id: property.id }}
        aria-label={`${property.title}, ${[
          ...property.badges.slice(0, 3).map((b) =>
            b === "superhot" ? "Super Hot" : b === "hot" ? "Hot" : b === "verified" ? "Verified" : b === "featured" ? "Featured" : "Platinum",
          ),
          CATEGORY_LABEL[property.category],
        ].join(", ")}`}
        className={cn(
          "relative block overflow-hidden bg-ice",
          layout === "list" ? "aspect-16/10 md:aspect-auto md:min-h-full" : "aspect-16/10",
        )}
      >
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-fast group-hover:scale-[1.03]"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          {property.badges.slice(0, 3).map((b) => (
            <ListingBadge key={b} kind={b} />
          ))}
        </div>
        <span className="absolute bottom-2.5 left-2.5 rounded-md bg-fg/80 px-2 py-0.5 text-[11px] font-semibold text-primary-fg">
          {CATEGORY_LABEL[property.category]}
        </span>
      </Link>

      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold tabular-nums tracking-tight text-primary-dark">
              {formatPrice(property.price, property.purpose, currency)}
            </p>
            <Link
              to="/property/$id"
              params={{ id: property.id }}
              className="mt-0.5 line-clamp-2 text-sm font-semibold text-fg hover:text-primary"
            >
              {property.title}
            </Link>
          </div>
          <button
            type="button"
            aria-label={saved ? "Remove from saved" : "Save property"}
            onClick={() => toggle(property.id)}
            className={cn(
              "size-10 shrink-0 rounded-lg grid place-items-center border border-border hover:bg-ice",
              saved && "text-hot border-hot-bg bg-hot-bg",
            )}
          >
            <Heart className={cn("size-4", saved && "fill-current")} />
          </button>
        </div>

        <p className="flex items-start gap-1.5 text-sm text-muted">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            {property.areaName}, {property.location}, {property.city}
          </span>
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-fg">
          {property.beds != null && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-4 text-muted" /> {property.beds} Beds
            </span>
          )}
          {property.baths != null && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="size-4 text-muted" /> {property.baths} Baths
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="size-4 text-muted" />
            {formatArea(property.areaSqft, unit)}
          </span>
        </div>

        {agent && (
          <p className="border-t border-border pt-2 text-xs text-muted">
            {agent.agency} · {agent.name}
          </p>
        )}
      </div>
    </article>
  );
}
