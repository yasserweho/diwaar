import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SEED_WANTED, type WantedAd } from "@/lib/portal";
import { useAppStore } from "@/lib/store";
import { SearchSelect } from "@/components/search-select";
import { CITIES } from "@/lib/types";

export const Route = createFileRoute("/wanted")({ component: WantedPage });

function WantedPage() {
  const extra = useAppStore((s) => s.wanted);
  const add = useAppStore((s) => s.addWanted);
  const ads = [...extra, ...SEED_WANTED];
  const [name, setName] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [type, setType] = useState("10 Marla house");
  const [budget, setBudget] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Wanted</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Buyers looking now</h1>
      <p className="mt-2 text-sm text-muted">Post what you need. Agents on Diwaar can match it from search.</p>
      <form
        className="mt-6 space-y-3 rounded-2xl bg-surface p-5 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length < 2 || budget.trim().length < 2 || note.trim().length < 8) {
            toast.error("Name, budget and a short note are required");
            return;
          }
          const ad: WantedAd = {
            id: `w-${Date.now()}`,
            name: name.trim(),
            city,
            type,
            budget: budget.trim(),
            note: note.trim(),
            createdAt: new Date().toISOString().slice(0, 10),
          };
          add(ad);
          setNote("");
          setBudget("");
          toast.success("Wanted ad posted");
        }}
      >
        <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <SearchSelect
            value={city}
            searchPlaceholder="Type a city"
            options={CITIES.map((name) => ({ value: name, label: name }))}
            onChange={setCity}
          />
          <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
            {["5 Marla plot", "10 Marla house", "1 Kanal house", "3-bed flat", "Shop", "Portion"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <input className={field} placeholder="Budget, e.g. PKR 2 Crore" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <textarea className={`${field} h-20 py-2`} placeholder="Society, beds, must-haves" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button type="submit">Post requirement</Button>
      </form>
      <ul className="mt-6 space-y-3">
        {ads.map((ad) => (
          <li key={ad.id} className="rounded-xl bg-surface p-4 shadow-card">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-bold">{ad.type}</p>
              <p className="text-sm font-semibold text-primary-dark">{ad.budget}</p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {ad.city} · {ad.name} · {ad.createdAt}
            </p>
            <p className="mt-2 text-sm">{ad.note}</p>
            <Link
              to="/search"
              search={{ purpose: "buy", city: ad.city }}
              className="mt-3 inline-flex text-sm font-semibold text-primary"
            >
              See {ad.city} listings
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const field = "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
