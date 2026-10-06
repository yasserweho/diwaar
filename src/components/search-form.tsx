import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/search-select";
import { locationsInCity } from "@/lib/data";
import { CITIES, type Category, type Purpose } from "@/lib/types";
import { cityLabel, tx, useLang } from "@/lib/i18n";
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
  const { lang } = useLang();

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
          ? "rounded-xl bg-white p-4 shadow-[0_18px_50px_rgb(0_0_0/0.28)] sm:p-5"
          : "rounded-xl border border-border bg-white p-3",
      )}
    >
      <div className="mb-4 flex gap-1 border-b border-border">
        {(["buy", "rent"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPurpose(p)}
            className={cn(
              "-mb-px h-10 border-b-2 px-3 text-sm font-semibold capitalize",
              purpose === p
                ? "border-primary text-black"
                : "border-transparent text-muted hover:text-fg",
            )}
          >
            {tx(lang, p, p === "buy" ? "خریدیں" : "کرایہ")}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void navigate({ to: "/projects" })}
          className="-mb-px h-10 border-b-2 border-transparent px-3 text-sm font-semibold text-muted hover:text-fg"
        >
          {tx(lang, "Projects", "منصوبے")}
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/invest" })}
          className="-mb-px h-10 border-b-2 border-transparent px-3 text-sm font-semibold text-muted hover:text-fg"
        >
          {tx(lang, "Invest", "سرمایہ کاری")}
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{tx(lang, "City", "شہر")}</span>
          <SearchSelect
            value={city}
            searchPlaceholder={tx(lang, "Type a city", "شہر لکھیں")}
            options={CITIES.map((name) => ({ value: name, label: cityLabel(name, lang) }))}
            onChange={(next) => {
              setCity(next);
              setLocation("");
            }}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{tx(lang, "Location", "علاقہ")}</span>
          <SearchSelect
            value={location}
            placeholder={tx(lang, "All areas", "تمام علاقے")}
            searchPlaceholder={tx(lang, "Type an area", "علاقہ لکھیں")}
            options={[{ value: "", label: tx(lang, "All areas", "تمام علاقے") }, ...areas.map((name) => ({ value: name, label: name }))]}
            onChange={setLocation}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{tx(lang, "Property type", "جائیداد کی قسم")}</span>
          <select
            className={`${selectClass} bg-white`}
            style={{ color: "#000", backgroundColor: "#fff", WebkitTextFillColor: "#000" }}
            value={type}
            onChange={(e) => setType(e.target.value as Category | "")}
          >
            {TYPES.map((t) => (
              <option key={t.id} value={t.id} style={{ color: "#000" }}>
                {tx(
                  lang,
                  t.label,
                  t.id === ""
                    ? "تمام اقسام"
                    : t.id === "house"
                      ? "مکان"
                      : t.id === "flat"
                        ? "فلیٹ"
                        : t.id === "plot"
                          ? "پلاٹ"
                          : t.id === "commercial"
                            ? "کمرشل"
                            : t.id === "portion"
                              ? "پورشن"
                              : "فارم ہاؤس",
                )}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto sm:px-8">
            <Search /> {tx(lang, "Find", "تلاش")}
          </Button>
        </div>
      </div>
    </form>
  );
}
