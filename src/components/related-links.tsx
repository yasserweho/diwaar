import { tx, useLang } from "@/lib/i18n";

export type PageLink = { href: string; en: string; ur: string };

export const PAGE = {
  sale: { href: "/search?purpose=buy", en: "Property for sale", ur: "فروخت کی جائیداد" },
  rent: { href: "/search?purpose=rent", en: "Property for rent", ur: "کرایے کی جائیداد" },
  locations: { href: "/locations", en: "Locations", ur: "مقامات" },
  services: { href: "/services", en: "Services", ur: "خدمات" },
  guides: { href: "/guides", en: "Area guides", ur: "علاقائی گائیڈ" },
  add: { href: "/add", en: "List a property", ur: "جائیداد لگائیں" },
  faq: { href: "/faq", en: "Questions", ur: "سوالات" },
  contact: { href: "/contact", en: "Contact", ur: "رابطہ" },
  about: { href: "/about", en: "About", ur: "ہمارے بارے میں" },
  agents: { href: "/agents", en: "Agents", ur: "ایجنٹس" },
  maps: { href: "/maps", en: "Plot maps", ur: "پلاٹ کے نقشے" },
  index: { href: "/property-index", en: "Price index", ur: "قیمت انڈیکس" },
  loans: { href: "/tools?tab=loan", en: "Home loan calculator", ur: "ہوم لون کیلکولیٹر" },
  build: { href: "/tools?tab=build", en: "Construction cost", ur: "تعمیراتی لاگت" },
  reviews: { href: "/reviews", en: "Reviews", ur: "تبصرے" },
  blog: { href: "/blog", en: "Journal", ur: "مضامین" },
  projects: { href: "/projects", en: "New projects", ur: "نئے منصوبے" },
  alerts: { href: "/alerts", en: "Alerts", ur: "الرٹس" },
  login: { href: "/login", en: "Sign in", ur: "سائن اِن" },
  wanted: { href: "/wanted", en: "Buyer requests", ur: "خریدار کی درخواست" },
  transfer: { href: "/services/sale-and-transfer", en: "Sale and transfer", ur: "فروخت اور ٹرانسفر" },
  myAds: { href: "/my-ads", en: "My ads", ur: "میرے اشتہارات" },
} satisfies Record<string, PageLink>;

export function RelatedLinks({ links }: { links: PageLink[] }) {
  const { lang } = useLang();
  return (
    <nav className="mt-10" aria-label={tx(lang, "Related pages", "متعلقہ صفحات")}>
      <h2 className="text-sm font-semibold text-black">{tx(lang, "Related pages", "متعلقہ صفحات")}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-black hover:border-primary"
            >
              {tx(lang, link.en, link.ur)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
