import { createFileRoute, Link } from "@tanstack/react-router";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GUIDES } from "@/lib/data";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/guides/$slug")({ component: GuideDetail });

function GuideDetail() {
  const { slug } = Route.useParams();
  const g = GUIDES.find((x) => x.slug === slug);
  const currency = useAppStore((s) => s.currency);
  if (!g) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Guide not found</p>
        <Link to="/guides" className="text-primary text-sm font-semibold">
          All guides
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <img src={g.image} alt="" className="aspect-16/8 w-full rounded-2xl object-cover" />
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-primary">{g.city}</p>
      <h1 className="text-3xl font-extrabold text-black">{g.name}</h1>
      <p className="mt-3 leading-relaxed">{g.overview}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat k="Avg house" v={formatPkr(g.avgHouse, currency)} />
        <Stat k="Avg plot" v={formatPkr(g.avgPlot, currency)} />
        <Stat k="Avg rent" v={`${formatPkr(g.avgRent, currency)} / mo`} />
      </div>
      <h2 className="mt-10 font-bold text-primary-dark">Price trend (Crore PKR)</h2>
      <div className="mt-3 h-56 rounded-2xl bg-surface p-3 shadow-card">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={g.trend}>
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="house" stroke="#1b6fe8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="plot" stroke="#0b4a8c" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {g.highlights.map((h) => (
          <li key={h} className="rounded-full bg-ice px-3 py-1 text-sm font-semibold text-primary-dark">
            {h}
          </li>
        ))}
      </ul>
      <Link
        to="/search"
        search={{ city: g.city, location: g.name, purpose: "buy" }}
        className="mt-8 inline-block"
      >
        <Button>See listings in {g.name}</Button>
      </Link>
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
