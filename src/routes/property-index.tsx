import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PRICE_INDEX } from "@/lib/portal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/property-index")({ component: IndexPage });

const CITIES = Object.keys(PRICE_INDEX);

function IndexPage() {
  const [city, setCity] = useState("Lahore");
  const series = PRICE_INDEX[city] ?? PRICE_INDEX.Lahore;
  const last = series[series.length - 1];
  const first = series[0];
  const change = (key: "house" | "plot" | "flat") =>
    Math.round(((last[key] - first[key]) / first[key]) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Property index</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">Track asking prices</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Index base is 100 in 2020. It follows typical asking prices for houses, plots and flats in each city. It is a guide, not a valuation.
      </p>
      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            className={cn(
              "h-10 shrink-0 rounded-lg px-3 text-sm font-semibold",
              city === c ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-card",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Houses since 2020" value={`+${change("house")}%`} />
        <Stat label="Plots since 2020" value={`+${change("plot")}%`} />
        <Stat label="Flats since 2020" value={`+${change("flat")}%`} />
      </div>
      <div className="mt-5 h-72 rounded-2xl bg-surface p-3 shadow-card">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="house" name="Houses" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="plot" name="Plots" stroke="var(--color-primary-dark)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="flat" name="Flats" stroke="var(--color-verified)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-muted">Blue houses · navy plots · green flats.</p>
      <Link to="/trends" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">
        See which areas are moving
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-primary-dark">{value}</p>
    </div>
  );
}
