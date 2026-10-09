import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Calculator,
  Heart,
  Home,
  Map as MapIcon,
  Menu,
  Plus,
  Search,
  Users,
  X,
  Building2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AccountSync } from "@/components/account-sync";
import { DiwaarWordmark } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { AREA_LABEL, type AreaUnit } from "@/lib/format";
import { cityLabel, tx, useLang } from "@/lib/i18n";
import { citySlug } from "@/lib/location-pages";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const MENU_GROUPS = [
  {
    title: "Find a property",
    ur: "جائیداد تلاش کریں",
    links: [
      { href: "/search?purpose=buy", label: "Buy", ur: "خریدیں" },
      { href: "/search?purpose=rent", label: "Rent", ur: "کرایہ" },
      { href: "/projects", label: "New projects", ur: "نئے منصوبے" },
      { href: "/maps", label: "Plot finder", ur: "پلاٹ فائنڈر" },
      { href: "/cities", label: "Cities", ur: "شہر" },
      { href: "/locations", label: "Locations", ur: "مقامات" },
      { href: "/services", label: "Services", ur: "خدمات" },
      { href: "/agents", label: "Agents", ur: "ایجنٹس" },
      { href: "/agencies", label: "Agencies", ur: "ایجنسیاں" },
    ],
  },
  {
    title: "Prices and places",
    ur: "قیمتیں اور جگہیں",
    links: [
      { href: "/guides", label: "Area guides", ur: "علاقائی گائیڈ" },
      { href: "/trends", label: "Trends", ur: "رجحانات" },
      { href: "/property-index", label: "Price index", ur: "قیمت انڈیکس" },
      { href: "/invest", label: "Invest", ur: "سرمایہ کاری" },
      { href: "/blog", label: "Journal", ur: "مضامین" },
    ],
  },
  {
    title: "Your account",
    ur: "آپ کا اکاؤنٹ",
    links: [
      { href: "/saved", label: "Saved homes", ur: "محفوظ جائیدادیں" },
      { href: "/alerts", label: "Alerts", ur: "الرٹس" },
      { href: "/compare", label: "Compare", ur: "موازنہ" },
      { href: "/wanted", label: "Wanted", ur: "مطلوب" },
      { href: "/my-ads", label: "My ads", ur: "میرے اشتہارات" },
      { href: "/orders", label: "Payments", ur: "ادائیگیاں" },
      { href: "/loans", label: "Loan files", ur: "لون فائلیں" },
      { href: "/community", label: "Community", ur: "کمیونٹی" },
      { href: "/reviews", label: "Reviews", ur: "تبصرے" },
      { href: "/faq", label: "Questions", ur: "سوالات" },
      { href: "/about", label: "About", ur: "ہمارے بارے میں" },
      { href: "/contact", label: "Contact", ur: "رابطہ" },
      { href: "/privacy", label: "Privacy", ur: "رازداری" },
      { href: "/tools?tab=loan", label: "Calculators", ur: "کیلکولیٹر" },
    ],
  },
];

const NAV = [
  { to: "/search", label: "Properties", ur: "جائیدادیں", search: { purpose: "buy" as const } },
  { to: "/projects", label: "Projects", ur: "منصوبے" },
  { to: "/guides", label: "Area Guides", ur: "علاقائی گائیڈ" },
  { to: "/maps", label: "Maps", ur: "نقشے" },
  { to: "/services", label: "Services", ur: "خدمات" },
  { to: "/blog", label: "Blog", ur: "بلاگ" },
];

/** Same-origin return path for the existing /login page. Open redirects are rejected. */
function loginHref(href: string): string {
  if (!href || href === "/" || href.startsWith("/login") || href.startsWith("//")) return "/login";
  return `/login?redirect=${encodeURIComponent(href)}`;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const here = useRouterState({ select: (s) => s.location.href });
  const signInHref = loginHref(here);

  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <AccountSync />
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:gap-6 sm:px-4">
          <Link to="/" className="shrink-0">
            <DiwaarWordmark compact />
          </Link>
          <SignedOut>
            <a
              href={signInHref}
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "min-h-11 shrink-0 px-3 md:hidden",
              )}
            >
              {tx(lang, "Login", "لاگ اِن")}
            </a>
          </SignedOut>
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={"search" in item ? item.search : undefined}
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-fg hover:bg-ice"
              >
                {tx(lang, item.label, item.ur)}
              </Link>
            ))}
            <MoreMenu />
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <div className="hidden sm:contents">
              <PrefsMenu />
              <UserButton />
            </div>
            <SignedOut>
              <a
                href={signInHref}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden px-2 md:inline-flex sm:px-3")}
              >
                {tx(lang, "Sign in", "سائن اِن")}
              </a>
            </SignedOut>
            <LanguageToggle />
            <Link
              to="/add"
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "hidden sm:inline-flex",
              )}
            >
              <Plus /> {tx(lang, "Add Property", "جائیداد شامل کریں")}
            </Link>
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-ice lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-fg/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-card sm:w-[min(100%,24rem)]">
            <div className="flex h-16 items-center justify-between px-4 border-b border-border">
              <DiwaarWordmark compact />
              <button
                type="button"
                className="size-11 grid place-items-center rounded-lg hover:bg-ice"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 pb-6">
              <SignedOut>
                <a
                  href={signInHref}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "primary" }), "h-12")}
                >
                  {tx(lang, "Login", "لاگ اِن")}
                </a>
              </SignedOut>
              <SignedIn>
                <div className="rounded-xl bg-ice px-3 py-3">
                  <UserButton />
                </div>
              </SignedIn>
              <Link
                to="/add"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "primary" }), "h-12")}
              >
                <Plus /> {tx(lang, "Add a property", "جائیداد شامل کریں")}
              </Link>
              {MENU_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                    {tx(lang, group.title, group.ur)}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {group.links.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex h-12 items-center rounded-xl bg-ice px-3 text-sm font-semibold text-primary-dark"
                      >
                        {tx(lang, item.label, item.ur)}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <TabletShortcuts />

      <main className="flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>

      <Footer />
      <BottomNav onMenu={() => setOpen(true)} />
    </div>
  );
}

function LanguageToggle() {
  const { ur, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(ur ? "en" : "ur")}
      className="inline-flex h-9 items-center rounded-md border border-border bg-white px-2.5 text-sm font-semibold text-black"
      lang={ur ? "en" : "ur"}
      dir={ur ? "ltr" : "rtl"}
    >
      {ur ? "English" : "اردو"}
    </button>
  );
}

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-fg hover:bg-ice"
      >
        {tx(lang, "More", "مزید")}
      </button>
      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 max-h-[70vh] w-56 overflow-y-auto rounded-xl bg-surface p-2 shadow-card">
            {MENU_GROUPS.flatMap((group) => group.links).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex h-10 items-center rounded-lg px-3 text-sm font-semibold hover:bg-ice"
                onClick={() => setOpen(false)}
              >
                {tx(lang, item.label, item.ur)}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PrefsMenu() {
  const unit = useAppStore((s) => s.areaUnit);
  const currency = useAppStore((s) => s.currency);
  const setUnit = useAppStore((s) => s.setAreaUnit);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const units: AreaUnit[] = ["marla", "kanal", "sqyd", "sqft"];

  return (
    <div className="relative hidden md:block">
      <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
        {AREA_LABEL[unit]} · {currency}
      </Button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close preferences"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl bg-surface p-3 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Area unit
            </p>
            <div className="grid grid-cols-2 gap-1 mb-3">
              {units.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={cn(
                    "h-9 rounded-md text-xs font-semibold",
                    unit === u ? "bg-primary text-primary-fg" : "bg-ice text-fg",
                  )}
                >
                  {AREA_LABEL[u]}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Currency
            </p>
            <div className="grid grid-cols-2 gap-1">
              {(["PKR", "USD", "AED", "GBP"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "h-9 rounded-md text-xs font-semibold",
                    currency === c ? "bg-primary text-primary-fg" : "bg-ice text-fg",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Footer() {
  const { lang } = useLang();
  return (
    <footer className="hidden lg:block border-t border-border bg-primary-dark text-primary-fg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <DiwaarWordmark inverted compact />
          <p className="mt-4 text-sm text-ice-2 leading-relaxed">
            {tx(
              lang,
              "Pakistan's property portal. No commission on a listing. Loan and price tools are estimates, not offers.",
              "پاکستان کی پراپرٹی ویب سائٹ۔ اشتہار پر کمیشن نہیں۔ لون اور قیمت کے اوزار اندازے ہیں، پیشکش نہیں۔",
            )}
          </p>
        </div>
        <FooterCol
          title={tx(lang, "Explore", "دریافت کریں")}
          links={[
            [tx(lang, "Locations", "مقامات"), "/locations"],
            [tx(lang, "Services", "خدمات"), "/services"],
            [tx(lang, "Properties for sale", "فروخت کے لیے جائیداد"), "/search?purpose=buy"],
            [tx(lang, "Properties to rent", "کرایے کی جائیداد"), "/search?purpose=rent"],
            [tx(lang, "New projects", "نئے منصوبے"), "/projects"],
            [tx(lang, "Area guides", "علاقائی گائیڈ"), "/guides"],
            [tx(lang, "Society maps", "سوسائٹی کے نقشے"), "/maps"],
            [tx(lang, "Property index", "قیمت انڈیکس"), "/property-index"],
            [tx(lang, "Trends", "رجحانات"), "/trends"],
            [tx(lang, "Invest", "سرمایہ کاری"), "/invest"],
          ]}
        />
        <FooterCol
          title={tx(lang, "Tools", "اوزار")}
          links={[
            [tx(lang, "Home loan calculator", "ہوم لون کیلکولیٹر"), "/tools?tab=loan"],
            [tx(lang, "Construction cost", "تعمیراتی لاگت"), "/tools?tab=build"],
            [tx(lang, "Area converter", "رقبہ کنورٹر"), "/tools?tab=area"],
            [tx(lang, "Add a listing", "اشتہار لگائیں"), "/add"],
            [tx(lang, "Find an agent", "ایجنٹ تلاش کریں"), "/agents"],
            [tx(lang, "Agencies", "ایجنسیاں"), "/agencies"],
            [tx(lang, "Community", "کمیونٹی"), "/community"],
            [tx(lang, "Wanted ads", "مطلوب اشتہارات"), "/wanted"],
            [tx(lang, "My ads", "میرے اشتہارات"), "/my-ads"],
          ]}
        />
        <FooterCol
          title={tx(lang, "Cities", "شہر")}
          links={[
            [cityLabel("Lahore", lang), `/locations/${citySlug("Lahore")}`],
            [cityLabel("Karachi", lang), `/locations/${citySlug("Karachi")}`],
            [cityLabel("Islamabad", lang), `/locations/${citySlug("Islamabad")}`],
            [cityLabel("Rawalpindi", lang), `/locations/${citySlug("Rawalpindi")}`],
            [cityLabel("Multan", lang), `/locations/${citySlug("Multan")}`],
          ]}
        />
      </div>
      <div className="border-t border-primary-fg/10 py-4 text-center text-xs text-ice-2">
        <a href="/reviews" className="hover:text-primary-fg">
          {tx(lang, "Reviews", "تبصرے")}
        </a>
        <span className="mx-2">·</span>
        <a href="/faq" className="hover:text-primary-fg">
          {tx(lang, "Questions", "سوالات")}
        </a>
        <span className="mx-2">·</span>
        <a href="/about" className="hover:text-primary-fg">
          {tx(lang, "About", "ہمارے بارے میں")}
        </a>
        <span className="mx-2">·</span>
        <a href="/contact" className="hover:text-primary-fg">
          {tx(lang, "Contact", "رابطہ")}
        </a>
        <span className="mx-2">·</span>
        <a href="/privacy" className="hover:text-primary-fg">
          {tx(lang, "Privacy", "رازداری")}
        </a>
        <span className="mx-2">·</span>
        © {new Date().getFullYear()} diwaar.com
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-bold mb-3">{title}</p>
      <ul className="space-y-2 text-sm text-ice-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="hover:text-primary-fg">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabletShortcuts() {
  const { lang } = useLang();
  const links: { href: string; label: string }[] = [
    { href: "/search?purpose=buy", label: tx(lang, "Buy", "خریدیں") },
    { href: "/search?purpose=rent", label: tx(lang, "Rent", "کرایہ") },
    { href: "/projects", label: tx(lang, "Projects", "منصوبے") },
    { href: "/maps", label: tx(lang, "Maps", "نقشے") },
    { href: "/guides", label: tx(lang, "Guides", "گائیڈ") },
    { href: "/agents", label: tx(lang, "Agents", "ایجنٹس") },
    { href: "/saved", label: tx(lang, "Saved", "محفوظ") },
    { href: "/add", label: tx(lang, "Add property", "جائیداد شامل کریں") },
  ];
  return (
    <div className="hidden border-b border-border bg-surface md:block lg:hidden">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto no-scrollbar px-4 py-2">
        {links.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-ice px-4 text-sm font-semibold text-primary-dark"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function BottomNav({ onMenu }: { onMenu: () => void }) {
  const { lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const purpose = useRouterState({
    select: (s) => {
      const search = s.location.search as { purpose?: string } | string;
      return typeof search === "object" ? search.purpose : undefined;
    },
  });
  const items = [
    { to: "/", label: tx(lang, "Home", "ہوم"), icon: Home, active: pathname === "/" },
    {
      to: "/search",
      label: tx(lang, "Buy", "خریدیں"),
      icon: Search,
      search: { purpose: "buy" as const },
      active: (pathname.startsWith("/search") || pathname.startsWith("/property")) && purpose !== "rent",
    },
    {
      to: "/search",
      label: tx(lang, "Rent", "کرایہ"),
      icon: Building2,
      search: { purpose: "rent" as const },
      active: pathname.startsWith("/search") && purpose === "rent",
    },
    { to: "/saved", label: tx(lang, "Saved", "محفوظ"), icon: Heart, active: pathname === "/saved" },
  ];

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden"
      aria-label="Primary"
    >
      <ul className="grid h-16 grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link
                to={item.to}
                search={"search" in item ? item.search : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
                  item.active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onMenu}
            className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted"
          >
            <Menu className="size-5" />
            {tx(lang, "Menu", "مینو")}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function SectionHead({
  title,
  href,
  action,
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  const { lang } = useLang();
  const actionLabel = action ?? tx(lang, "View all", "سب دیکھیں");
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h2 className="text-lg font-semibold tracking-normal text-black sm:text-xl">
        {title}
      </h2>
      {href && (
        <a href={href} className="text-sm font-semibold text-primary hover:underline">
          {actionLabel}
        </a>
      )}
    </div>
  );
}

export function ToolTiles() {
  const { lang } = useLang();
  const tiles = [
    { to: "/tools?tab=loan", icon: Calculator, label: tx(lang, "Home loan", "ہوم لون"), sub: tx(lang, "Bank packages", "بینک پیکجز") },
    { to: "/tools?tab=build", icon: Calculator, label: tx(lang, "Build cost", "تعمیراتی لاگت"), sub: tx(lang, "Grey + finishing", "گرے + فنشنگ") },
    { to: "/tools?tab=area", icon: Calculator, label: tx(lang, "Area converter", "رقبہ کنورٹر"), sub: tx(lang, "Marla · Kanal · Yd", "مرلہ · کنال · گز") },
    { to: "/maps", icon: MapIcon, label: tx(lang, "Plot finder", "پلاٹ فائنڈر"), sub: tx(lang, "12 societies", "۱۲ سوسائٹیاں") },
    { to: "/property-index", icon: BookOpen, label: tx(lang, "Price index", "قیمت انڈیکس"), sub: tx(lang, "Since 2020", "۲۰۲۰ سے") },
    { to: "/trends", icon: BookOpen, label: tx(lang, "Trends", "رجحانات"), sub: tx(lang, "Hot areas", "نمایاں علاقے") },
    { to: "/guides", icon: BookOpen, label: tx(lang, "Area guides", "علاقائی گائیڈ"), sub: tx(lang, "Prices & streets", "قیمتیں اور سڑکیں") },
    { to: "/invest", icon: Building2, label: tx(lang, "Invest", "سرمایہ کاری"), sub: tx(lang, "Property blocks", "پراپرٹی بلاکس") },
    { to: "/agencies", icon: Users, label: tx(lang, "Agencies", "ایجنسیاں"), sub: tx(lang, "Titanium desks", "بڑی ڈیسک") },
    { to: "/community", icon: Users, label: tx(lang, "Community", "کمیونٹی"), sub: tx(lang, "Ask the market", "مارکیٹ سے پوچھیں") },
    { to: "/wanted", icon: Search, label: tx(lang, "Wanted", "مطلوب"), sub: tx(lang, "Buyer requests", "خریدار کی درخواست") },
    { to: "/cities", icon: MapIcon, label: tx(lang, "All cities", "تمام شہر"), sub: tx(lang, "Pakistan", "پاکستان") },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <a
            key={t.to}
            href={t.to}
            className="bg-white p-4 transition-colors hover:bg-ice"
          >
            <span className="mb-3 grid size-8 place-items-center rounded-md bg-ice text-primary">
              <Icon className="size-4" />
            </span>
            <p className="text-sm font-semibold text-black">{t.label}</p>
            <p className="mt-0.5 text-xs text-muted">{t.sub}</p>
          </a>
        );
      })}
    </div>
  );
}
