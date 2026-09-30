import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/search-select";
import { locationsInCity } from "@/lib/data";
import { CITIES, type Category, type Purpose } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPES: { id: Category | ""; label: string }[] = [
  { id: "", label: "All types" },
  { id: "house", label: "Houses" },
  { id: "flat", label: "Flats" },
  { id: "plot", label: "Plots" },
  { id: "commercial", label: "Commercial" },
  { id: "portion", label: "Portions" },
  { id: "farmhouse", label: "Farm Houses" },
];

export function SearchForm({
  variant = "hero",
  initial,
}: {
  variant?: "hero" | "bar";
  initial?: {
    purpose?: Purpose;
    city?: string;
    type?: Category | "";
    location?: string;
  };
}) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose>(initial?.purpose ?? "buy");
  const [city, setCity] = useState(initial?.city ?? "Lahore");
  const [type, setType] = useState<Category | "">(initial?.type ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const areas = locationsInCity(city);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    void navigate({
      to: "/search",
      search: {
        purpose,
        city,
        type: type || undefined,
        location: location || undefined,
      },
    });
  }

  const selectClass =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-fg outline-none focus:border-primary";

  return (
    <form
      onSubmit={submit}
      className={cn(
        variant === "hero"
          ? "rounded-2xl bg-surface p-3 shadow-card sm:p-4"
          : "rounded-xl bg-surface p-3 shadow-card",
      )}
    >
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-ice p-1 sm:flex">
        {(["buy", "rent"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPurpose(p)}
            className={cn(
              "h-10 flex-1 rounded-md text-sm font-semibold capitalize transition-colors duration-fast",
              purpose === p
                ? "bg-primary text-primary-fg"
                : "text-muted hover:text-fg",
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void navigate({ to: "/projects" })}
          className="h-10 flex-1 rounded-md text-sm font-semibold text-muted hover:text-fg"
        >
          Projects
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/invest" })}
          className="h-10 flex-1 rounded-md text-sm font-semibold text-muted hover:text-fg"
        >
          Invest
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">
            City
          </span>
          <SearchSelect
            value={city}
            searchPlaceholder="Type a city"
            options={CITIES.map((name) => ({ value: name, label: name }))}
            onChange={(next) => {
              setCity(next);
              setLocation("");
            }}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">
            Location
          </span>
          <SearchSelect
            value={location}
            placeholder="All areas"
            searchPlaceholder="Type an area"
            options={[{ value: "", label: "All areas" }, ...areas.map((name) => ({ value: name, label: name }))]}
            onChange={setLocation}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">
            Property type
          </span>
          <select
            className={selectClass}
            value={type}
            onChange={(e) => setType(e.target.value as Category | "")}
          >
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto sm:px-8">
            <Search /> Find
          </Button>
        </div>
      </div>
    </form>
  );
}
