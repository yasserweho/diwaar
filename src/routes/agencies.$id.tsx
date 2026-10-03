import { createFileRoute, Link } from "@tanstack/react-router";
import { PropertyCard } from "@/components/property-card";
import { AGENTS, PROPERTIES } from "@/lib/data";
import { agencySlug } from "@/lib/portal";

export const Route = createFileRoute("/agencies/$id")({ component: AgencyPage });

function AgencyPage() {
  const { id } = Route.useParams();
  const people = AGENTS.filter((a) => agencySlug(a.agency) === id);
  if (!people.length) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Agency not found</p>
        <Link to="/agencies" className="text-sm font-semibold text-primary">
          All agencies
        </Link>
      </div>
    );
  }
  const ids = new Set(people.map((a) => a.id));
  const listings = PROPERTIES.filter((p) => ids.has(p.agencyId));
  const name = people[0].agency;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/agencies" className="text-sm font-semibold text-muted hover:text-primary">
        Agencies
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold text-black">{name}</h1>
      <p className="mt-1 text-sm text-muted">{people[0].city}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {people.map((a) => (
          <li key={a.id}>
            <Link to="/agents/$id" params={{ id: a.id }} className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-card">
              <span className="size-12 rounded-full bg-primary-dark text-primary-fg grid place-items-center font-bold">
                {a.initials}
              </span>
              <span>
                <span className="block font-bold">{a.name}</span>
                <span className="text-sm text-muted">
                  {a.experience} yrs · {a.listings} listings
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-xl font-extrabold text-primary-dark">Their listings</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {listings.map((p) => (
          <PropertyCard key={p.id} property={p} layout="grid" />
        ))}
        {listings.length === 0 && <p className="text-sm text-muted">No live listings from this desk right now.</p>}
      </div>
    </div>
  );
}
