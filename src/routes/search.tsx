import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/property-card";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { PROPERTIES, filterProperties, locationsInCity } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { CATEGORY_LABEL, CITIES, type Category, type Purpose, type SearchParams } from "@/lib/types";
import { cn } from "@/lib/utils";

function parseSearch(s: Record<string, unknown>): SearchParams {
  const purpose: Purpose = s.purpose === "rent" ? "rent" : "buy";
  const type = typeof s.type === "string" && s.type in CATEGORY_LABEL ? (s.type as Category) : undefined;
  const num = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const sort =
    s.sort === "price-asc" || s.sort === "price-desc" || s.sort === "area-desc" || s.sort === "newest"
      ? s.sort
      : "newest";
  return {
    purpose,
    city: typeof s.city === "string" ? s.city : undefined,
    location: typeof s.location === "string" ? s.location : undefined,
    type,
    beds: num(s.beds),
    minPrice: num(s.minPrice),
    maxPrice: num(s.maxPrice),
    minArea: num(s.minArea),
    maxArea: num(s.maxArea),
    sort,
    q: typeof s.q === "string" ? s.q : undefined,
  };
}

export const Route = createFileRoute("/search")({
  validateSearch: parseSearch,
  component: SearchPage,
});

function SearchPage() {
  const params = Route.useSearch();
  const extra = useAppStore((s) => s.userListings);
  const results = useMemo(
    () => filterProperties([...extra, ...PROPERTIES], params),
    [extra, params],
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <SearchForm
        variant="bar"
        initial={{
          purpose: params.purpose,
          city: params.city,
          type: params.type,
          location: params.location,
        }}
      />
      <div className="mt-5 flex items-center justify-between gap-3">
        <h1 className="text-lg font-extrabold text-primary-dark sm:text-xl">
          {results.length} {params.purpose === "rent" ? "rentals" : "properties"}
          {params.city ? ` in ${params.city}` : ""}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal /> Filters
          </Button>
          <SortSelect value={params.sort ?? "newest"} />
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <FiltersPanel />
        </aside>
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="rounded-xl bg-surface p-10 text-center shadow-card">
              <p className="font-bold">No listings match these filters</p>
              <p className="mt-1 text-sm text-muted">Widen the city, type or price range.</p>
            </div>
          ) : (
            results.map((p) => <PropertyCard key={p.id} property={p} />)
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-fg/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold">Filters</p>
              <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)}>
                Done
              </Button>
            </div>
            <FiltersPanel />
          </div>
        </div>
      )}
    </div>
  );
}

function SortSelect({ value }: { value: NonNullable<SearchParams["sort"]> }) {
  const navigate = useNavigate({ from: "/search" });
  return (
    <select
      className="h-9 rounded-md border border-border bg-surface px-2 text-sm font-medium"
      value={value}
      onChange={(e) =>
        void navigate({
          search: (prev) => ({ ...prev, sort: e.target.value as SearchParams["sort"] }),
        })
      }
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
      <option value="area-desc">Largest area</option>
    </select>
  );
}

function FiltersPanel() {
  const params = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const areas = params.city ? locationsInCity(params.city) : [];

  function patch(partial: Partial<SearchParams>) {
    void navigate({ search: (prev) => ({ ...prev, ...partial }) });
  }

  return (
    <div className="space-y-5 rounded-xl bg-surface p-4 shadow-card lg:sticky lg:top-24">
      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Purpose</legend>
        <div className="flex gap-2">
          <Chip active={params.purpose !== "rent"} onClick={() => patch({ purpose: "buy" })}>
            Buy
          </Chip>
          <Chip active={params.purpose === "rent"} onClick={() => patch({ purpose: "rent" })}>
            Rent
          </Chip>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">City</legend>
        <select
          className="h-11 w-full rounded-lg border border-border px-3 text-sm"
          value={params.city ?? ""}
          onChange={(e) => patch({ city: e.target.value || undefined, location: undefined })}
        >
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </fieldset>

      {areas.length > 0 && (
        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Location</legend>
          <select
            className="h-11 w-full rounded-lg border border-border px-3 text-sm"
            value={params.location ?? ""}
            onChange={(e) => patch({ location: e.target.value || undefined })}
          >
            <option value="">All areas</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </fieldset>
      )}

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Type</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!params.type} onClick={() => patch({ type: undefined })}>
            Any
          </Chip>
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((t) => (
            <Chip key={t} active={params.type === t} onClick={() => patch({ type: t })}>
              {CATEGORY_LABEL[t]}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Beds</legend>
        <div className="flex flex-wrap gap-2">
          {[undefined, 1, 2, 3, 4, 5].map((n) => (
            <Chip key={String(n)} active={params.beds === n} onClick={() => patch({ beds: n })}>
              {n ? `${n}+` : "Any"}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
