import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HOUSE_SM } from "@/lib/photos";
import { toSqft, type AreaUnit } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { locationsInCity } from "@/lib/data";
import { CATEGORY_LABEL, CITIES, type Category, type Purpose } from "@/lib/types";

export const Route = createFileRoute("/add")({ component: AddPage });

function AddPage() {
  const add = useAppStore((s) => s.addListing);
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const [category, setCategory] = useState<Category>("house");
  const [city, setCity] = useState("Lahore");
  const [location, setLocation] = useState("");
  const [areaName, setAreaName] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("3");
  const [baths, setBaths] = useState("3");
  const [area, setArea] = useState("5");
  const [unit, setUnit] = useState<AreaUnit>("marla");
  const [description, setDescription] = useState("");

  const field =
    "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = Number(price.replace(/,/g, ""));
    const a = Number(area);
    if (!title.trim() || !location.trim() || !p || !a) {
      toast.error("Add a title, location, price and area.");
      return;
    }
    const id = `user-${Date.now()}`;
    add({
      id,
      title: title.trim(),
      purpose,
      category,
      city,
      location: location.trim(),
      areaName: areaName.trim() || location.trim(),
      price: p,
      beds: category === "plot" || category === "commercial" ? undefined : Number(beds) || undefined,
      baths: category === "plot" || category === "commercial" ? undefined : Number(baths) || undefined,
      areaSqft: toSqft(a, unit),
      images: HOUSE_SM,
      description:
        description.trim() ||
        `${title.trim()} listed on Diwaar in ${location}, ${city}.`,
      amenities: ["Electricity", "Water", "Sewerage"],
      agencyId: "prime-lhr",
      badges: ["featured"],
      createdAt: new Date().toISOString().slice(0, 10),
      featured: true,
    });
    toast.success("Listing published on this device");
    void navigate({ to: "/property/$id", params: { id } });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-primary-dark">Add a property</h1>
      <p className="mt-2 text-sm text-muted">
        Free listing — saved in this browser so you can preview the full seller flow.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {(["buy", "rent"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPurpose(p)}
              className={`h-11 rounded-lg text-sm font-semibold capitalize ${
                purpose === p ? "bg-primary text-primary-fg" : "bg-ice text-fg"
              }`}
            >
              For {p === "buy" ? "sale" : "rent"}
            </button>
          ))}
        </div>
        <label className="block text-sm font-semibold">
          Type
          <select className={`${field} mt-1`} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          City
          <select className={`${field} mt-1`} value={city} onChange={(e) => { setCity(e.target.value); setLocation(""); }}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Society / location
          <input className={`${field} mt-1`} list="city-areas" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search an area" />
          <datalist id="city-areas">
            {locationsInCity(city).map((area) => (
              <option key={area} value={area} />
            ))}
          </datalist>
        </label>
        <label className="block text-sm font-semibold">
          Block / phase
          <input className={`${field} mt-1`} value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder="Phase 5, Block C" />
        </label>
        <label className="block text-sm font-semibold">
          Title
          <input className={`${field} mt-1`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="5 Marla house, park-facing" />
        </label>
        <label className="block text-sm font-semibold">
          Price (PKR{purpose === "rent" ? " / month" : ""})
          <input className={`${field} mt-1`} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="18500000" />
        </label>
        {category !== "plot" && category !== "commercial" && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold">
              Beds
              <input className={`${field} mt-1`} value={beds} onChange={(e) => setBeds(e.target.value)} />
            </label>
            <label className="block text-sm font-semibold">
              Baths
              <input className={`${field} mt-1`} value={baths} onChange={(e) => setBaths(e.target.value)} />
            </label>
          </div>
        )}
        <div className="grid grid-cols-[1fr_8rem] gap-3">
          <label className="block text-sm font-semibold">
            Area
            <input className={`${field} mt-1`} value={area} onChange={(e) => setArea(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold">
            Unit
            <select className={`${field} mt-1`} value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)}>
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
              <option value="sqyd">Sq. Yd.</option>
              <option value="sqft">Sq. Ft.</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Description
          <textarea
            className="mt-1 min-h-28 w-full rounded-lg border border-border bg-surface p-3 text-sm outline-none focus:border-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <Button type="submit" size="lg" className="w-full">
          Publish listing
        </Button>
      </form>
    </div>
  );
}
