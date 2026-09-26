import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatPkr, MARLA_SQFT, KANAL_SQFT, SQYD_SQFT, ACRE_SQFT, trimNum } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tab = "loan" | "build" | "area";

function parse(s: Record<string, unknown>): { tab: Tab } {
  const tab = s.tab === "build" || s.tab === "area" || s.tab === "loan" ? s.tab : "loan";
  return { tab };
}

export const Route = createFileRoute("/tools")({
  validateSearch: parse,
  component: ToolsPage,
});

function ToolsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/tools" });
  const tabs: { id: Tab; label: string }[] = [
    { id: "loan", label: "Home loan" },
    { id: "build", label: "Construction cost" },
    { id: "area", label: "Area converter" },
  ];

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-primary-dark">Property tools</h1>
      <p className="mt-2 text-sm text-muted">Mark-up, build cost and Marla conversions — the three questions every token meeting starts with.</p>
      <div className="mt-6 flex gap-1 rounded-lg bg-ice p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => void navigate({ search: { tab: t.id } })}
            className={cn(
              "h-10 flex-1 rounded-md text-xs sm:text-sm font-semibold",
              tab === t.id ? "bg-primary text-primary-fg" : "text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "loan" && <LoanCalc />}
        {tab === "build" && <BuildCalc />}
        {tab === "area" && <AreaCalc />}
      </div>
    </div>
  );
}

const field =
  "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

function LoanCalc() {
  const [price, setPrice] = useState("18500000");
  const [down, setDown] = useState("30");
  const [years, setYears] = useState("15");
  const [rate, setRate] = useState("16");

  const result = useMemo(() => {
    const p = Number(price) || 0;
    const d = Math.min(90, Math.max(0, Number(down) || 0)) / 100;
    const principal = p * (1 - d);
    const n = (Number(years) || 1) * 12;
    const i = (Number(rate) || 0) / 100 / 12;
    const monthly =
      i === 0 ? principal / n : (principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    return { principal, monthly, total: monthly * n, downPay: p * d };
  }, [price, down, years, rate]);

  return (
    <div className="space-y-4 rounded-2xl bg-surface p-5 shadow-card">
      <Field label="Property price (PKR)" value={price} onChange={setPrice} />
      <Field label="Down payment %" value={down} onChange={setDown} />
      <Field label="Tenure (years)" value={years} onChange={setYears} />
      <Field label="Annual markup %" value={rate} onChange={setRate} />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Stat k="Down payment" v={formatPkr(result.downPay)} />
        <Stat k="Financed" v={formatPkr(result.principal)} />
        <Stat k="Monthly" v={formatPkr(result.monthly)} />
        <Stat k="Total paid" v={formatPkr(result.total)} />
      </div>
    </div>
  );
}

function BuildCalc() {
  const [marla, setMarla] = useState("5");
  const [cover, setCover] = useState("70");
  const [tier, setTier] = useState<"economy" | "standard" | "premium">("standard");
  const rates = { economy: 4500, standard: 7500, premium: 12000 };

  const result = useMemo(() => {
    const covered = (Number(marla) || 0) * MARLA_SQFT * ((Number(cover) || 0) / 100);
    const rate = rates[tier];
    const total = covered * rate;
    return {
      covered,
      grey: total * 0.45,
      finish: total * 0.35,
      mep: total * 0.2,
      total,
    };
  }, [marla, cover, tier]);

  return (
    <div className="space-y-4 rounded-2xl bg-surface p-5 shadow-card">
      <Field label="Plot size (Marla)" value={marla} onChange={setMarla} />
      <Field label="Covered area %" value={cover} onChange={setCover} />
      <div className="flex gap-2">
        {(["economy", "standard", "premium"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            className={cn(
              "h-10 flex-1 rounded-lg text-xs font-semibold capitalize",
              tier === t ? "bg-primary text-primary-fg" : "bg-ice",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">
        {trimNum(result.covered)} sq ft at PKR {rates[tier].toLocaleString()} / sq ft
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Stat k="Grey structure" v={formatPkr(result.grey)} />
        <Stat k="Finishing" v={formatPkr(result.finish)} />
        <Stat k="MEP" v={formatPkr(result.mep)} />
        <Stat k="Estimated total" v={formatPkr(result.total)} />
      </div>
    </div>
  );
}

function AreaCalc() {
  const [value, setValue] = useState("10");
  const [from, setFrom] = useState<"marla" | "kanal" | "sqft" | "sqyd" | "acre">("marla");
  const factor = { marla: MARLA_SQFT, kanal: KANAL_SQFT, sqft: 1, sqyd: SQYD_SQFT, acre: ACRE_SQFT };
  const sqft = (Number(value) || 0) * factor[from];
  const rows: [string, number][] = [
    ["Marla", sqft / MARLA_SQFT],
    ["Kanal", sqft / KANAL_SQFT],
    ["Sq. Ft.", sqft],
    ["Sq. Yd.", sqft / SQYD_SQFT],
    ["Acre", sqft / ACRE_SQFT],
    ["Sq. M", sqft / 10.7639],
  ];

  return (
    <div className="space-y-4 rounded-2xl bg-surface p-5 shadow-card">
      <label className="block text-sm font-semibold">
        Value
        <input className={`${field} mt-1`} value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <label className="block text-sm font-semibold">
        From
        <select className={`${field} mt-1`} value={from} onChange={(e) => setFrom(e.target.value as typeof from)}>
          <option value="marla">Marla (272.25 sq ft)</option>
          <option value="kanal">Kanal</option>
          <option value="sqyd">Square yards</option>
          <option value="sqft">Square feet</option>
          <option value="acre">Acre</option>
        </select>
      </label>
      <ul className="divide-y divide-border">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between py-2.5 text-sm">
            <span className="text-muted">{k}</span>
            <span className="font-bold tabular-nums">{trimNum(v)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input className={`${field} mt-1`} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-ice p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{k}</p>
      <p className="mt-1 font-bold tabular-nums">{v}</p>
    </div>
  );
}
