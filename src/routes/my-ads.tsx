import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/my-ads")({
  head: () => seo("My Property Ads", "Listings you posted on Diwaar.", { noindex: true, path: "/my-ads" }),
  component: MyAdsPage });

function MyAdsPage() {
  const listings = useAppStore((s) => s.userListings);
  const remove = useAppStore((s) => s.removeListing);
  const assignContact = useAppStore((s) => s.assignContact);
  const { user } = useCurrentUserState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const posted = listings.find((p) => p.contactName);
    setName(posted?.contactName || user?.displayName || "");
    setPhone(posted?.contactPhone || "");
  }, [user?.displayName, listings]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">My ads</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Properties you posted</h1>
      <form
        className="mt-6 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const nextName = name.trim();
          const nextPhone = phone.replace(/[^\d+]/g, "");
          if (nextName.length < 2 || nextPhone.length < 10) {
            toast.error("Add your name and a phone number.");
            return;
          }
          assignContact(nextName, nextPhone);
          toast.success("Your ads now show your name and phone.");
        }}
      >
        <label className="block text-sm font-semibold">
          Name on your ads
          <input
            className="mt-1 h-12 w-full rounded-lg border border-border px-3 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block text-sm font-semibold">
          Phone on your ads
          <input
            className="mt-1 h-12 w-full rounded-lg border border-border px-3 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="03xx xxx xxxx"
          />
        </label>
        <Button type="submit">Save on my ads</Button>
      </form>
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
