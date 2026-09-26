import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BANKS } from "@/lib/portal";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function parse(s: Record<string, unknown>) {
  return { bank: typeof s.bank === "string" ? s.bank : "" };
}

export const Route = createFileRoute("/loans")({
  validateSearch: parse,
  component: LoansPage,
});

const NEXT: Record<string, string> = {
  submitted: "Send to valuation",
  valuation: "Mark approved",
  approved: "Disburse",
  disbursed: "Disbursed",
};

function LoansPage() {
  const preset = Route.useSearch().bank;
  const loans = useAppStore((s) => s.loans);
  const add = useAppStore((s) => s.addLoan);
  const advance = useAppStore((s) => s.advanceLoan);
  const currency = useAppStore((s) => s.currency);
  const [bank, setBank] = useState(preset || BANKS[0].name);
  const offer = BANKS.find((b) => b.name === bank) ?? BANKS[0];
  const [amount, setAmount] = useState("12000000");
  const [years, setYears] = useState(String(offer.years));
  const [propertyTitle, setPropertyTitle] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Home finance</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">Loan file</h1>
      <p className="mt-2 text-sm text-muted">
        Submit a file, then move it through valuation, approval and disbursement. The file stays on your account.
      </p>
      <form
        className="mt-6 space-y-3 rounded-2xl bg-surface p-5 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(amount);
          if (!propertyTitle.trim() || !n) {
            toast.error("Property and amount are required");
            return;
          }
          add({
            id: `ln-${Date.now()}`,
            bank: offer.name,
            product: offer.product,
            amount: n,
            years: Number(years) || offer.years,
            propertyTitle: propertyTitle.trim(),
            stage: "submitted",
            createdAt: new Date().toISOString().slice(0, 10),
          });
          setPropertyTitle("");
          toast.success("File submitted to " + offer.name);
        }}
      >
        <label className="block text-sm font-semibold">
          Bank
          <select className={`${field} mt-1`} value={bank} onChange={(e) => setBank(e.target.value)}>
            {BANKS.map((b) => (
              <option key={b.name}>{b.name}</option>
            ))}
          </select>
        </label>
        <p className="text-sm text-muted">
          {offer.product} · {offer.rate}% · {offer.down}% down · {offer.note}
        </p>
        <input className={field} placeholder="Property, e.g. 10 Marla DHA Phase 6" value={propertyTitle} onChange={(e) => setPropertyTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className={field} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input className={field} inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
        <Button type="submit">Submit application</Button>
      </form>
      <ul className="mt-6 space-y-3">
        {loans.map((l) => (
          <li key={l.id} className="rounded-xl bg-surface p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{l.propertyTitle}</p>
                <p className="text-sm text-muted">
                  {l.bank} {l.product} · {l.years} years · {formatPkr(l.amount, currency)}
                </p>
              </div>
              <span className="rounded-md bg-ice px-2 py-1 text-xs font-bold uppercase text-primary">{l.stage}</span>
            </div>
            <ol className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              {["submitted", "valuation", "approved", "disbursed"].map((step) => (
                <li
                  key={step}
                  className={cn(
                    "rounded-md px-2 py-1 capitalize",
                    step === l.stage ? "bg-primary text-primary-fg" : "bg-ice text-muted",
                  )}
                >
                  {step}
                </li>
              ))}
            </ol>
            {l.stage !== "disbursed" && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => advance(l.id)}>
                {NEXT[l.stage]}
              </Button>
            )}
            {l.stage === "disbursed" && (
              <p className="mt-3 text-sm font-semibold text-verified">Funds marked disbursed on this file.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const field = "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
