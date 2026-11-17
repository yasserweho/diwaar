import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { tx, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/invest")({
  head: () =>
    seo(
      "Property Investment in Pakistan",
      "Diwaar does not sell investment shares or promise returns. How to check a property investment before you pay.",
      { path: "/invest", noindex: true },
    ),
  component: InvestPage,
});

function InvestPage() {
  const { lang } = useLang();
  const points = [
    tx(
      lang,
      "Be careful with anyone promising a fixed yearly return on plot files or pooled shares. Property prices can fall as well as rise.",
      "پلاٹ فائلوں یا مشترکہ حصص پر مقررہ سالانہ منافع کا وعدہ کرنے والوں سے محتاط رہیں۔ جائیداد کی قیمت گر بھی سکتی ہے۔",
    ),
    tx(
      lang,
      "Check that the society is approved by the development authority (CDA, RDA, LDA and others) before you pay a token.",
      "ٹوکن دینے سے پہلے دیکھیں کہ سوسائٹی ترقیاتی ادارے (سی ڈی اے، آر ڈی اے، ایل ڈی اے وغیرہ) سے منظور شدہ ہے۔",
    ),
    tx(
      lang,
      "Pay to the society or the registered owner, with a receipt, never in cash to a middleman.",
      "ادائیگی سوسائٹی یا رجسٹرڈ مالک کو رسید کے ساتھ کریں، کسی درمیانی شخص کو نقد نہیں۔",
    ),
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{tx(lang, "Invest", "سرمایہ کاری")}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Diwaar does not sell investment deals", "دیوار سرمایہ کاری کے سودے نہیں بیچتی")}
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        {tx(
          lang,
          "There are no pooled investments, shares or guaranteed yields on Diwaar. If you want to invest in property, buy a specific plot, house or shop from a live ad and check it yourself.",
          "دیوار پر کوئی مشترکہ سرمایہ کاری، حصص یا یقینی منافع نہیں۔ اگر آپ جائیداد میں سرمایہ لگانا چاہتے ہیں تو کسی لائیو اشتہار سے مخصوص پلاٹ، مکان یا دکان خریدیں اور خود تصدیق کریں۔",
        )}
      </p>
      <ul className="mt-6 list-disc space-y-2 ps-5 text-sm leading-relaxed">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link to="/search" search={{ purpose: "buy", type: "plot" }} className="text-primary hover:underline">
          {tx(lang, "Browse plot ads", "پلاٹ کے اشتہارات")}
        </Link>
        <Link to="/tools/transfer-cost" className="text-primary hover:underline">
          {tx(lang, "Transfer cost estimator", "منتقلی لاگت کا اندازہ")}
        </Link>
        <Link to="/blog/$slug" params={{ slug: "check-cda-rda-approved-housing-society" }} className="text-primary hover:underline">
          {tx(lang, "Check if a society is approved", "سوسائٹی کی منظوری چیک کریں")}
        </Link>
      </div>
    </div>
  );
}
