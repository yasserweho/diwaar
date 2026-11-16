import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { ShareBar } from "@/components/share-bar";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/my-ads")({
  validateSearch: (s: Record<string, unknown>): { posted?: string } =>
    typeof s.posted === "string" && /^user-[\w-]+$/.test(s.posted) ? { posted: s.posted } : {},
  head: () => seo("My Property Ads", "Listings you posted on Diwaar.", { noindex: true, path: "/my-ads" }),
  component: MyAdsPage });

function MyAdsPage() {
  const listings = useAppStore((s) => s.userListings);
  const remove = useAppStore((s) => s.removeListing);
  const assignContact = useAppStore((s) => s.assignContact);
  const { user } = useCurrentUserState();
  const { posted } = Route.useSearch();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void useAppStore.persist.rehydrate().then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const posted = listings.find((p) => p.contactName);
    setName(posted?.contactName || user?.displayName || "");
    setPhone(posted?.contactPhone || "");
  }, [user?.displayName, listings]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="font-semibold">Loading your ads\u2026</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">My ads</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Properties you posted</h1>
      {posted && <JustPosted id={posted} />}
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
                  search={{ kind: "boost", title: `Hot listing \u00b7 ${p.title}`, amount: 5000 }}
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

/** Shown once, right after an ad is published: share it, and invite others to post free. */
function JustPosted({ id }: { id: string }) {
  const listing = useAppStore((s) => s.userListings.find((p) => p.id === id));
  if (!listing) return null;
  const deal = listing.purpose === "rent" ? "for rent" : "for sale";
  const dealUr = listing.purpose === "rent" ? "کرایے کے لیے" : "برائے فروخت";
  const price = formatPrice(listing.price, listing.purpose, "PKR");
  return (
    <div className="mt-6 space-y-3">
      <div className="rounded-2xl border border-[#1f9d55]/30 bg-[#eaf7ef] p-5">
        <p className="text-lg font-bold text-black">Your ad is live. Send it to people who might want it.</p>
        <p className="mt-1 text-sm text-muted">
          Share the link in your WhatsApp groups and on your Status so more people see it. Every ad has its own page with photos and your number.
        </p>
        <Link to="/property/$id" params={{ id }} className="mt-2 inline-block text-sm font-semibold text-primary">
          View your ad
        </Link>
      </div>
      <ShareBar
        path={`/property/${id}`}
        campaign="new-ad"
        title={{ en: "Share your ad", ur: "اپنا اشتہار شیئر کریں" }}
        en={`${listing.title}, ${deal} in ${listing.location}, ${listing.city}: ${price}. Photos and contact:`}
        ur={`${listing.title}، ${listing.location}، ${listing.city} میں ${dealUr}: ${price}۔ تصاویر اور رابطہ:`}
      />
      <ShareBar
        path="/add"
        campaign="referral"
        title={{ en: "Know someone selling or renting out? Tell them it's free.", ur: "کوئی جاننے والا گھر بیچ رہا ہے یا کرایے پر دے رہا ہے؟ اسے بتائیں کہ یہ مفت ہے۔" }}
        en="I just posted my property on Diwaar.com for free, no commission. You can post yours here:"
        ur="میں نے ابھی اپنی جائیداد دیوار ڈاٹ کام پر مفت لگائی ہے، کوئی کمیشن نہیں۔ آپ بھی یہاں لگا سکتے ہیں:"
      />
    </div>
  );
}
