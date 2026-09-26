import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PropertyCard } from "@/components/property-card";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { generatedMatches } from "@/lib/catalog";
import { PROPERTIES, filterProperties, locationsInCity } from "@/lib/data";
import { alertLabel } from "@/lib/portal";
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
    page: num(s.page),
  };
}

export const Route = createFileRoute("/search")({
  validateSearch: parseSearch,
  component: SearchPage,
});

function SearchPage() {
  const params = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const extra = useAppStore((s) => s.userListings);
  const page = params.page ?? 1;
  const results = useMemo(() => {
    const curated = filterProperties([...extra, ...PROPERTIES], params);
    const seen = new Set(curated.map((p) => p.id));
    const gen = generatedMatches(params).filter((p) => !seen.has(p.id));
    let all = [...curated, ...gen];
    switch (params.sort) {
      case "price-asc":
        all = [...all].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        all = [...all].sort((a, b) => b.price - a.price);
        break;
      case "area-desc":
        all = [...all].sort((a, b) => b.areaSqft - a.areaSqft);
        break;
      default:
        all = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return all;
  }, [extra, params]);
  const pageSize = 20;
  const visible = results.slice((page - 1) * pageSize, page * pageSize);
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const addAlert = useAppStore((s) => s.addAlert);

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
      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-lg font-extrabold text-primary-dark sm:text-xl">
          {results.length} {params.purpose === "rent" ? "rentals" : "properties"}
          {params.city ? ` in ${params.city}` : ""}
          {results.length > pageSize ? ` · page ${page} of ${pages}` : ""}
        </h1>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <Button variant="outline" size="sm" className="lg:hidden h-11" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal /> Filters
          </Button>
          <SortSelect value={params.sort ?? "newest"} />
          <Button
            variant="outline"
            size="sm"
            className="col-span-2 h-11 sm:col-span-1 sm:h-9"
            onClick={() => {
              addAlert({
                id: `a-${Date.now()}`,
                label: alertLabel(params),
                params,
                createdAt: new Date().toISOString().slice(0, 10),
              });
              toast.success("Search saved in Alerts");
            }}
          >
            Save alert
          </Button>
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
            visible.map((p) => <PropertyCard key={p.id} property={p} />)
          )}
          {pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() =>
                  void navigate({ search: (prev) => ({ ...prev, page: Math.max(1, page - 1) }) })
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() =>
                  void navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })
                }
              >
                Next
              </Button>
            </div>
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
          <div className="absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
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
      className="h-11 w-full rounded-md border border-border bg-surface px-2 text-base font-medium sm:h-9 sm:w-auto sm:text-sm"
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
        <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Keyword</legend>
        <input
          className="h-11 w-full rounded-lg border border-border px-3 text-sm"
          placeholder="DHA, corner, furnished"
          value={params.q ?? ""}
          onChange={(e) => patch({ q: e.target.value || undefined })}
        />
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Price (PKR)</legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            className="h-11 w-full rounded-lg border border-border px-3 text-sm"
            placeholder="Min"
            value={params.minPrice ?? ""}
            onChange={(e) => patch({ minPrice: Number(e.target.value) || undefined })}
          />
          <input
            inputMode="numeric"
            className="h-11 w-full rounded-lg border border-border px-3 text-sm"
            placeholder="Max"
            value={params.maxPrice ?? ""}
            onChange={(e) => patch({ maxPrice: Number(e.target.value) || undefined })}
          />
        </div>
      </fieldset>

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
