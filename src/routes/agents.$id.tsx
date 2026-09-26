import { createFileRoute, Link } from "@tanstack/react-router";
import { PropertyCard } from "@/components/property-card";
import { AGENTS, PROPERTIES } from "@/lib/data";
import { formatPhone, waLink } from "@/lib/format";

export const Route = createFileRoute("/agents/$id")({ component: AgentDetail });

function AgentDetail() {
  const { id } = Route.useParams();
  const a = AGENTS.find((x) => x.id === id);
  if (!a) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Agent not found</p>
        <Link to="/agents" className="text-primary text-sm font-semibold">
          All agents
        </Link>
      </div>
    );
  }
  const listings = PROPERTIES.filter((p) => p.agencyId === a.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl bg-surface p-6 shadow-card flex flex-col sm:flex-row sm:items-center gap-5">
        <span className="size-16 rounded-full bg-primary-dark text-primary-fg grid place-items-center text-xl font-bold">
          {a.initials}
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-primary-dark">{a.name}</h1>
          <p className="text-primary font-semibold">{a.agency}</p>
          <p className="text-sm text-muted mt-1">
            {a.city} · {a.specialty} · {a.experience} years
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={`tel:+92${a.phone.slice(1)}`}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg"
          >
            Call {formatPhone(a.phone)}
          </a>
          <a
            href={waLink(a.phone, `Hi ${a.name}, I found you on Diwaar.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-verified px-4 text-sm font-semibold text-primary-fg"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <h2 className="mt-8 text-xl font-extrabold text-primary-dark">Live listings ({listings.length})</h2>
      <div className="mt-4 grid gap-4">
        {listings.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
      {listings.length === 0 && (
        <Link to="/search" search={{ city: a.city, purpose: "buy" }} className="mt-4 inline-block text-sm font-semibold text-primary">
          Search {a.city}
        </Link>
      )}
    </div>
  );
}
