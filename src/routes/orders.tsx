import { createFileRoute, Link } from "@tanstack/react-router";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const orders = useAppStore((s) => s.orders);
  const currency = useAppStore((s) => s.currency);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Payments</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Receipts</h1>
      <p className="mt-2 text-sm text-muted">Paid listing boosts and investment shares show up here after checkout.</p>
      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-surface p-8 text-center shadow-card">
          <p className="font-semibold">No payments yet</p>
          <Link to="/my-ads" className="mt-3 inline-flex text-sm font-semibold text-primary">
            Promote a listing
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl bg-surface p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{o.title}</p>
                  <p className="text-sm text-muted">
                    {o.method} · {o.reference} · {o.createdAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold tabular-nums">{formatPkr(o.amount, currency)}</p>
                  <p className="text-xs font-bold uppercase text-verified">Paid</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
