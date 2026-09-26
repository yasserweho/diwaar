import { createFileRoute, Link } from "@tanstack/react-router";
import { AGENTS, PROPERTIES } from "@/lib/data";

export const Route = createFileRoute("/agents")({ component: AgentsPage });

function AgentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Agencies</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">Top agents on Diwaar</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Local specialists for DHA, Bahria, Clifton and the F-sectors.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => {
          const n = PROPERTIES.filter((p) => p.agencyId === a.id).length;
          return (
            <Link
              key={a.id}
              to="/agents/$id"
              params={{ id: a.id }}
              className="rounded-2xl bg-surface p-5 shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
            >
              <div className="flex items-center gap-3">
                <span className="size-14 rounded-full bg-primary-dark text-primary-fg grid place-items-center text-lg font-bold">
                  {a.initials}
                </span>
                <div>
                  <p className="font-bold">{a.name}</p>
                  <p className="text-sm text-primary">{a.agency}</p>
                  <p className="text-xs text-muted">{a.city}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">{a.specialty}</p>
              <p className="mt-3 text-sm font-semibold">
                {a.experience} years · {n} live listings
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
