import { Link } from "@tanstack/react-router";
import { CITIES, AREA_BOOK } from "@/lib/locations";
import { tx, useLang } from "@/lib/i18n";

export function TrustStrip() {
  const { lang } = useLang();
  const areas = CITIES.reduce((n, city) => n + (AREA_BOOK[city]?.length ?? 0), 0);
  const items = [
    {
      value: String(CITIES.length),
      label: tx(lang, "cities", "شہر"),
      note: tx(lang, "Each city has its own page", "ہر شہر کا اپنا صفحہ ہے"),
      href: "/locations",
    },
    {
      value: areas.toLocaleString(),
      label: tx(lang, "areas", "علاقے"),
      note: tx(lang, "Find one by typing its name", "نام لکھ کر علاقہ کھولیں"),
      href: "/locations",
    },
    {
      value: tx(lang, "No fee", "بغیر فیس"),
      label: tx(lang, "on a listing", "اشتہار پر"),
      note: tx(lang, "diwaar.com takes no commission", "diwaar.com کمیشن نہیں لیتی"),
      href: "/about",
    },
    {
      value: tx(lang, "Labeled", "واضح"),
      label: tx(lang, "estimates", "اندازے"),
      note: tx(lang, "Loan and build-cost tools say they are guides", "لون اور تعمیر کے اوزار رہنمائی بتاتے ہیں"),
      href: "/faq",
    },
  ];
  return (
    <div className="grid gap-px overflow-hidden border-y border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Link key={item.label} to={item.href} className="bg-white px-4 py-4 hover:bg-ice">
          <p className="text-lg font-semibold text-black">{item.value}</p>
          <p className="text-sm font-medium text-black">{item.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{item.note}</p>
        </Link>
      ))}
    </div>
  );
}
