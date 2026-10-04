import { createFileRoute, Link } from "@tanstack/react-router";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/my-ads")({
  head: () => seo("My Property Ads", "Listings you posted on Diwaar.", { noindex: true, path: "/my-ads" }),
  component: MyAdsPage });

function MyAdsPage() {
  const listings = useAppStore((s) => s.userListings);
  const remove = useAppStore((s) => s.removeListing);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">My ads</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Properties you posted</h1>
      <p className="mt-2 text-sm text-muted">These stay in this browser, the same way a draft desk works before an account exists.</p>
      {listings.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-surface p-8 text-center shadow-card">
          <p className="font-semibold">You have not posted a property yet</p>
          <Link to="/add" className="mt-3 inline-flex text-sm font-semibold text-primary">
            Add a property
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {listings.map((p) => (
            <li key={p.id} className="space-y-2">
              <PropertyCard property={p} />
              <div className="flex gap-2">
                <Link
                  to="/pay"
                  search={{ kind: "boost", title: `Hot listing · ${p.title}`, amount: 5000 }}
                  className="text-sm font-semibold text-primary"
                >
                  Promote for PKR 5,000
                </Link>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)}>
                  Remove ad
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
