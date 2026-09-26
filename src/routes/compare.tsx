import { createFileRoute, Link } from "@tanstack/react-router";
import { getProperty } from "@/lib/data";
import { formatArea, formatPrice } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { CATEGORY_LABEL } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/compare")({ component: ComparePage });

function ComparePage() {
  const ids = useAppStore((s) => s.compareIds);
  const extra = useAppStore((s) => s.userListings);
  const toggle = useAppStore((s) => s.toggleCompare);
  const unit = useAppStore((s) => s.areaUnit);
  const currency = useAppStore((s) => s.currency);
  const rows = ids.map((id) => getProperty(id, extra)).filter((p) => p != null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Compare</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">Up to three listings</h1>
      <p className="mt-2 text-sm text-muted">Add homes from a listing page. Price, area and beds sit side by side.</p>
      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-surface p-8 text-center shadow-card">
          <p className="font-semibold">Nothing to compare yet</p>
          <Link to="/search" search={{ purpose: "buy" }} className="mt-3 inline-flex text-sm font-semibold text-primary">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {rows.map((p) => (
            <article key={p.id} className="rounded-2xl bg-surface p-4 shadow-card">
              <img src={p.images[0]} alt="" className="aspect-16/10 w-full rounded-lg object-cover" />
              <Link to="/property/$id" params={{ id: p.id }} className="mt-3 block font-bold hover:text-primary">
                {p.title}
              </Link>
              <dl className="mt-3 space-y-2 text-sm">
                <Row k="Price" v={formatPrice(p.price, p.purpose, currency)} />
                <Row k="Area" v={formatArea(p.areaSqft, unit)} />
                <Row k="Beds" v={p.beds != null ? String(p.beds) : "—"} />
                <Row k="Baths" v={p.baths != null ? String(p.baths) : "—"} />
                <Row k="Type" v={CATEGORY_LABEL[p.category]} />
                <Row k="Where" v={`${p.location}, ${p.city}`} />
              </dl>
              <Button variant="outline" className="mt-4 w-full" onClick={() => toggle(p.id)}>
                Remove
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border py-1.5">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}
