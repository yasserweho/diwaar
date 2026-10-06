import { createFileRoute, Link } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/data";
import { formatPkr } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  head: () =>
    seo(
      "New Housing Projects in Pakistan",
      "Launching and under-construction societies and projects, with starting prices and payment plans.",
      { path: "/projects" },
    ),
  component: ProjectsPage });

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">New projects</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Investment-ready societies</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Payment-plan plots and houses from developers across Punjab, Sindh and the capital.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <Link
            key={p.id}
            to="/projects/$id"
            params={{ id: p.id }}
            className="overflow-hidden rounded-2xl bg-surface shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
          >
            <img src={p.images[0]} alt={`${p.name}, ${p.city}`} loading="lazy" decoding="async" className="aspect-16/9 w-full object-cover" />
            <div className="p-5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-primary">{p.status}</span>
              <h2 className="mt-1 text-lg font-bold">{p.name}</h2>
              <p className="text-sm text-muted">
                {p.location}, {p.city} · {p.developer}
              </p>
              <p className="mt-3 text-sm font-semibold text-primary-dark">
                From {formatPkr(p.priceFrom)} · {p.paymentPlan}
              </p>
              <p className="mt-1 text-sm text-muted">{p.types.join(" · ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
