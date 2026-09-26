import { createFileRoute, Link } from "@tanstack/react-router";
import { CITY_DIRECTORY } from "@/lib/portal";
import { PROPERTIES } from "@/lib/data";

export const Route = createFileRoute("/cities")({ component: CitiesPage });

function CitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">All cities</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">Buy and rent across Pakistan</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CITY_DIRECTORY.map((c) => {
          const n = PROPERTIES.filter((p) => p.city === c.city).length;
          return (
            <Link
              key={c.city}
              to="/search"
              search={{ purpose: "buy", city: c.city }}
              className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover"
            >
              <p className="text-xs font-semibold text-primary">{c.province}</p>
              <p className="text-xl font-extrabold text-primary-dark">{c.city}</p>
              <p className="mt-1 text-sm text-muted">{c.focus}</p>
              <p className="mt-2 text-sm">{c.societies}</p>
              <p className="mt-3 text-sm font-semibold text-primary">{n} listings on Diwaar</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
