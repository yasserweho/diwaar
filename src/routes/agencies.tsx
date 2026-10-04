import { createFileRoute, Link } from "@tanstack/react-router";
import { AGENTS } from "@/lib/data";
import { agencySlug } from "@/lib/portal";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/agencies")({
  head: () =>
    seo(
      "Real Estate Agencies in Pakistan",
      "Browse property agencies in Lahore, Karachi, Islamabad and other cities, and see their live listings on Diwaar.",
      { path: "/agencies" },
    ),
  component: AgenciesPage,
});

function AgenciesPage() {
  const names = [...new Set(AGENTS.map((a) => a.agency))];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Titanium agencies</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Agencies on Diwaar</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {names.map((name) => {
          const people = AGENTS.filter((a) => a.agency === name);
          const listings = people.reduce((n, a) => n + a.listings, 0);
          return (
            <Link
              key={name}
              to="/agencies/$id"
              params={{ id: agencySlug(name) }}
              className="rounded-xl bg-surface p-5 shadow-card hover:shadow-card-hover"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{people[0]?.city}</p>
              <h2 className="mt-1 text-lg font-extrabold">{name}</h2>
              <p className="mt-2 text-sm text-muted">
                {people.length === 1 ? "1 agent" : `${people.length} agents`} · {listings} listings · {people[0]?.specialty}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
