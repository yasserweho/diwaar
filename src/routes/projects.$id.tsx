import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/lib/data";
import { formatPkr } from "@/lib/format";

export const Route = createFileRoute("/projects/$id")({ component: ProjectDetail });

function ProjectDetail() {
  const { id } = Route.useParams();
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Project not found</p>
        <Link to="/projects" className="text-primary text-sm font-semibold">
          All projects
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <img src={p.images[0]} alt="" className="aspect-16/8 w-full rounded-2xl object-cover" />
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-primary">{p.status}</p>
      <h1 className="text-3xl font-extrabold text-primary-dark">{p.name}</h1>
      <p className="mt-1 text-muted">
        {p.location}, {p.city} · {p.developer}
      </p>
      <p className="mt-4 leading-relaxed">{p.description}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat k="From" v={formatPkr(p.priceFrom)} />
        <Stat k="Plan" v={p.paymentPlan} />
        <Stat k="Size" v={p.size} />
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.types.map((t) => (
          <span key={t} className="rounded-full bg-ice px-3 py-1 text-sm font-semibold text-primary-dark">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link to="/search" search={{ city: p.city, purpose: "buy", type: "plot" }}>
          <Button>View nearby listings</Button>
        </Link>
        <Link to="/add">
          <Button variant="outline">List in this project</Button>
        </Link>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-card">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
      <dd className="mt-1 font-bold">{v}</dd>
    </div>
  );
}
