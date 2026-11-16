import { Link } from "@tanstack/react-router";
import { tx, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** "Post your property free" call to action used on city, area, blog and tool pages. */
export function PostFreeCta({ place, className }: { place?: string; className?: string }) {
  const { lang } = useLang();
  return (
    <aside className={cn("rounded-2xl border border-primary/20 bg-ice p-5", className)}>
      <p className="text-lg font-bold text-black">
        {place
          ? tx(lang, `Own property in ${place}? Post it free.`, `${place} میں جائیداد ہے؟ مفت اشتہار لگائیں۔`)
          : tx(lang, "Selling or renting out? Post your property free.", "بیچنا یا کرایے پر دینا ہے؟ مفت اشتہار لگائیں۔")}
      </p>
      <p className="mt-1 text-sm text-muted">
        {tx(
          lang,
          "No commission on listings. Buyers and tenants call you directly, and your ad gets its own page you can share on WhatsApp.",
          "اشتہار پر کوئی کمیشن نہیں۔ خریدار اور کرایہ دار براہ راست آپ سے رابطہ کرتے ہیں، اور آپ کے اشتہار کا اپنا صفحہ بنتا ہے جو آپ واٹس ایپ پر بھیج سکتے ہیں۔",
        )}
      </p>
      <Link
        to="/add"
        className="mt-4 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-dark"
      >
        {tx(lang, "Post your property free", "مفت اشتہار لگائیں")}
      </Link>
    </aside>
  );
}
