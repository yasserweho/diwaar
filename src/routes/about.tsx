import { createFileRoute, Link } from "@tanstack/react-router";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { tx, useLang } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About diwaar.com",
      "diwaar.com is a property portal for houses, flats, plots and commercial property across Pakistan.",
      { path: "/about" },
    ),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useLang();
  const points =
    lang === "ur"
      ? [
          "شہر اور علاقے کے حساب سے مکان، فلیٹ، پلاٹ اور کمرشل جائیداد تلاش کریں۔",
          "فروخت یا کرایے کا اشتہار اپنے اکاؤنٹ سے لگائیں اور ہٹائیں۔",
          "قیمت انڈیکس، علاقائی گائیڈ، ہوم لون کا اندازہ اور رقبہ کنورٹر استعمال کریں۔",
          "ایجنٹ، ایجنسی اور سوسائٹی کے نقشے کھولیں۔",
        ]
      : [
          "Search houses, flats, plots and commercial property by city and area.",
          "Post or remove a sale or rent ad from your account.",
          "Use the price index, area guides, home-loan estimate and area converter.",
          "Open agents, agencies and society maps.",
        ];
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">diwaar.com</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "About diwaar.com", "diwaar.com کے بارے میں")}
      </h1>
      <p className="mt-4 text-base leading-relaxed">
        {tx(
          lang,
          "diwaar.com is a property portal for Pakistan. It lists places to buy and rent, and the areas those places sit in, from Lahore, Karachi and Islamabad through smaller cities.",
          "diwaar.com پاکستان کی پراپرٹی ویب سائٹ ہے۔ یہاں خرید و کرایہ کی جگہیں ہیں، اور وہ علاقے بھی، لاہور، کراچی اور اسلام آباد سے چھوٹے شہروں تک۔",
        )}
      </p>
      <h2 className="mt-8 text-xl font-semibold text-black">{tx(lang, "What you can do", "آپ کیا کر سکتے ہیں")}</h2>
      <ul className="mt-3 space-y-2">
        {points.map((point) => (
          <li key={point} className="rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed shadow-card">
            {point}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-xl font-semibold text-black">{tx(lang, "What this site is not", "یہ سائٹ کیا نہیں")}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {tx(
          lang,
          "The loan calculator, construction estimate and price index are guides, not a bank offer, a contractor quote or a valuation certificate. Sale-and-transfer notes are not legal advice. diwaar.com does not take a commission on a listing. You deal with the owner or agent named on the ad.",
          "لون کیلکولیٹر، تعمیراتی تخمینہ اور قیمت انڈیکس رہنمائی ہیں، بینک کی پیشکش، ٹھیکیدار کا کوٹیشن یا ویلیوایشن سرٹیفکیٹ نہیں۔ فروخت اور ٹرانسفر کے نوٹس قانونی مشورہ نہیں۔ diwaar.com اشتہار پر کمیشن نہیں لیتی۔ بات اشتہار پر لکھے مالک یا ایجنٹ سے ہوتی ہے۔",
        )}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/search" search={{ purpose: "buy" }} className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white">
          {tx(lang, "Search property", "جائیداد تلاش کریں")}
        </Link>
        <Link to="/add" className="inline-flex h-11 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold text-black">
          {tx(lang, "List a property", "جائیداد لگائیں")}
        </Link>
      </div>
      <RelatedLinks links={[PAGE.locations, PAGE.services, PAGE.guides, PAGE.index, PAGE.agents, PAGE.faq, PAGE.contact]} />
    </article>
  );
}
