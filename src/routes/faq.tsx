import { createFileRoute, Link } from "@tanstack/react-router";
import { FaqList } from "@/components/faq-list";
import { tx, useLang } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () =>
    seo(
      "diwaar.com questions",
      "Answers on searching, listing a property, sign-in, Urdu, loans and contact on diwaar.com.",
      { path: "/faq" },
    ),
  component: FaqPage,
});

function FaqPage() {
  const { lang } = useLang();
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">diwaar.com</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Questions", "سوالات")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {tx(
          lang,
          "Short answers about search, listings, sign-in and the tools.",
          "تلاش، اشتہار، سائن اِن اور اوزار کے مختصر جواب۔",
        )}
      </p>
      <FaqList />
      <p className="mt-8 text-sm">
        <Link to="/contact" className="font-semibold text-primary">
          {tx(lang, "Still need help? Contact us.", "ابھی مدد چاہیے؟ رابطہ کریں۔")}
        </Link>
      </p>
    </article>
  );
}
