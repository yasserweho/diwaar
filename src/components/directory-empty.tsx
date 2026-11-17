import { Link } from "@tanstack/react-router";
import { tx, useLang } from "@/lib/i18n";

/** Honest empty state for /agents and /agencies until real agencies sign up. */
export function DirectoryEmpty({ kind }: { kind: "agents" | "agencies" }) {
  const { lang } = useLang();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {kind === "agents" ? tx(lang, "Agents", "ایجنٹس") : tx(lang, "Agencies", "ایجنسیاں")}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Agent directory coming soon", "ایجنٹ ڈائریکٹری جلد آ رہی ہے")}
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        {tx(
          lang,
          "Diwaar does not list agents or agencies yet. We will only show real, contactable agencies here, never sample profiles. Until then, every ad shows the name and phone of the person who posted it.",
          "دیوار پر ابھی ایجنٹ یا ایجنسیاں درج نہیں۔ یہاں صرف اصل اور قابلِ رابطہ ایجنسیاں دکھائی جائیں گی، نمونے کے پروفائل نہیں۔ تب تک ہر اشتہار پر لگانے والے کا نام اور فون نمبر موجود ہے۔",
        )}
      </p>
      <div className="mt-6 rounded-2xl border border-primary/20 bg-ice p-5">
        <p className="text-lg font-bold text-black">
          {tx(lang, "Are you an agent? List your agency", "کیا آپ ایجنٹ ہیں؟ اپنی ایجنسی درج کروائیں")}
        </p>
        <p className="mt-1 text-sm text-muted">
          {tx(
            lang,
            "Send us your agency name, city and office phone, and start posting your listings free today. No commission on listings.",
            "اپنی ایجنسی کا نام، شہر اور دفتر کا فون نمبر بھیجیں، اور آج ہی مفت اشتہارات لگانا شروع کریں۔ اشتہار پر کوئی کمیشن نہیں۔",
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/contact"
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-dark"
          >
            {tx(lang, "Contact us to list your agency", "ایجنسی درج کروانے کے لیے رابطہ کریں")}
          </Link>
          <Link
            to="/add"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-white px-5 text-sm font-semibold"
          >
            {tx(lang, "Post a property free", "مفت اشتہار لگائیں")}
          </Link>
        </div>
      </div>
      <Link to="/search" search={{ purpose: "buy" }} className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">
        {tx(lang, "Browse live ads instead", "لائیو اشتہارات دیکھیں")}
      </Link>
    </div>
  );
}
