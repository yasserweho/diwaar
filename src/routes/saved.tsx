import { createFileRoute, Link } from "@tanstack/react-router";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { PROPERTIES } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/saved")({
  head: () =>
    seo("Saved Properties", "Houses, plots and flats you saved on Diwaar.", { noindex: true, path: "/saved" }),
  component: SavedPage });

function SavedPage() {
  const ids = useAppStore((s) => s.savedIds);
  const extra = useAppStore((s) => s.userListings);
  const list = [...extra, ...PROPERTIES].filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-black">Saved properties</h1>
      <p className="mt-2 text-sm text-muted">Kept on this device. Hearts on any listing add it here.</p>
      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-surface p-10 text-center shadow-card">
          <p className="font-bold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted">Browse listings and tap the heart.</p>
          <Link to="/search" search={{ purpose: "buy" }} className="mt-4 inline-block">
            <Button>Search properties</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {list.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
