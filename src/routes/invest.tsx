import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPkr } from "@/lib/format";
import { INVEST } from "@/lib/portal";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/invest")({ component: InvestPage });

function InvestPage() {
  const currency = useAppStore((s) => s.currency);
  const reserved = useAppStore((s) => s.reserved);
  const toggle = useAppStore((s) => s.toggleReserved);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Invest</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">Property blocks</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Pooled plots, shops and floors. Reserving a block saves it on this device. It does not move money.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {INVEST.map((deal) => {
          const on = reserved.includes(deal.id);
          return (
            <article key={deal.id} className="rounded-2xl bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    {deal.kind} · {deal.city}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold">{deal.name}</h2>
                </div>
                <p className="text-lg font-extrabold tabular-nums text-primary-dark">{deal.yieldPct}%</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{deal.blurb}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Minimum</dt>
                  <dd className="font-semibold">{formatPkr(deal.minTicket, currency)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Term</dt>
                  <dd className="font-semibold">{deal.term}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant={on ? "outline" : "primary"}
                  onClick={() => {
                    toggle(deal.id);
                    toast.success(on ? "Reservation removed" : "Block reserved on this device");
                  }}
                >
                  {on ? "Reserved" : deal.status === "Reserved" ? "Join waitlist" : "Reserve a share"}
                </Button>
                <Link
                  to="/pay"
                  search={{ kind: "invest", title: deal.name, amount: deal.minTicket }}
                  className="inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold text-primary"
                >
                  Pay the minimum
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
