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
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const MENU_GROUPS = [
  {
    title: "Find a property",
    links: [
      { href: "/search?purpose=buy", label: "Buy" },
      { href: "/search?purpose=rent", label: "Rent" },
      { href: "/projects", label: "New projects" },
      { href: "/maps", label: "Plot finder" },
      { href: "/cities", label: "Cities" },
      { href: "/agents", label: "Agents" },
      { href: "/agencies", label: "Agencies" },
    ],
  },
  {
    title: "Prices and places",
    links: [
      { href: "/guides", label: "Area guides" },
      { href: "/trends", label: "Trends" },
      { href: "/property-index", label: "Price index" },
      { href: "/invest", label: "Invest" },
      { href: "/blog", label: "Journal" },
    ],
  },
  {
    title: "Your account",
    links: [
      { href: "/saved", label: "Saved homes" },
      { href: "/alerts", label: "Alerts" },
      { href: "/compare", label: "Compare" },
      { href: "/wanted", label: "Wanted" },
      { href: "/my-ads", label: "My ads" },
      { href: "/orders", label: "Payments" },
      { href: "/loans", label: "Loan files" },
      { href: "/community", label: "Community" },
      { href: "/tools?tab=loan", label: "Calculators" },
    ],
  },
];

const NAV = [
  { to: "/search", label: "Properties", search: { purpose: "buy" as const } },
  { to: "/projects", label: "Projects" },
  { to: "/guides", label: "Area Guides" },
  { to: "/maps", label: "Maps" },
  { to: "/blog", label: "Blog" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <AccountSync />
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
          <Link to="/" className="shrink-0" aria-label="Diwaar home">
            <DiwaarWordmark compact />
          </Link>
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={"search" in item ? item.search : undefined}
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-fg/80 hover:bg-ice hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <MoreMenu />
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <div className="hidden sm:contents">
              <PrefsMenu />
              <UserButton />
              <SignedOut>
                <Link to="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Sign in
                </Link>
              </SignedOut>
            </div>
            <SignedOut>
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "sm:hidden px-2")}
              >
                Sign in
              </Link>
            </SignedOut>
            <Link
              to="/add"
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "hidden sm:inline-flex",
              )}
            >
              <Plus /> Add Property
            </Link>
            <button
              type="button"
              className="hidden md:grid lg:hidden size-11 place-items-center rounded-lg hover:bg-ice"
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
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "primary" }), "h-12")}
                >
                  Sign in
                </Link>
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
                <Plus /> Add a property
              </Link>
              {MENU_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                    {group.title}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {group.links.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex h-12 items-center rounded-xl bg-ice px-3 text-sm font-semibold text-primary-dark"
                      >
                        {item.label}
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

function MoreMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-fg/80 hover:bg-ice hover:text-fg"
      >
        More
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
                {item.label}
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
  return (
    <footer className="hidden lg:block border-t border-border bg-primary-dark text-primary-fg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <DiwaarWordmark inverted compact />
          <p className="mt-4 text-sm text-ice-2 leading-relaxed">
          Pakistan's property portal. Buy, rent, and list houses, flats, plots, and commercial property.
          </p>
        </div>
        <FooterCol
          title="Explore"
          links={[
            ["Properties for sale", "/search?purpose=buy"],
            ["Properties to rent", "/search?purpose=rent"],
            ["New projects", "/projects"],
            ["Area guides", "/guides"],
            ["Society maps", "/maps"],
            ["Property index", "/property-index"],
            ["Trends", "/trends"],
            ["Invest", "/invest"],
          ]}
        />
        <FooterCol
          title="Tools"
          links={[
            ["Home loan calculator", "/tools?tab=loan"],
            ["Construction cost", "/tools?tab=build"],
            ["Area converter", "/tools?tab=area"],
            ["Add a listing", "/add"],
            ["Find an agent", "/agents"],
            ["Agencies", "/agencies"],
            ["Community", "/community"],
            ["Wanted ads", "/wanted"],
            ["My ads", "/my-ads"],
          ]}
        />
        <FooterCol
          title="Cities"
          links={[
            ["Lahore", "/search?city=Lahore&purpose=buy"],
            ["Karachi", "/search?city=Karachi&purpose=buy"],
            ["Islamabad", "/search?city=Islamabad&purpose=buy"],
            ["Rawalpindi", "/search?city=Rawalpindi&purpose=buy"],
            ["Multan", "/search?city=Multan&purpose=buy"],
          ]}
        />
      </div>
      <div className="border-t border-primary-fg/10 py-4 text-center text-xs text-ice-2">
        © {new Date().getFullYear()} Diwaar.com
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
  const links: { href: string; label: string }[] = [
    { href: "/search?purpose=buy", label: "Buy" },
    { href: "/search?purpose=rent", label: "Rent" },
    { href: "/projects", label: "Projects" },
    { href: "/maps", label: "Maps" },
    { href: "/guides", label: "Guides" },
    { href: "/agents", label: "Agents" },
    { href: "/saved", label: "Saved" },
    { href: "/add", label: "Add property" },
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const purpose = useRouterState({
    select: (s) => {
      const search = s.location.search as { purpose?: string } | string;
      return typeof search === "object" ? search.purpose : undefined;
    },
  });
  const items = [
    { to: "/", label: "Home", icon: Home, active: pathname === "/" },
    {
      to: "/search",
      label: "Buy",
      icon: Search,
      search: { purpose: "buy" as const },
      active: (pathname.startsWith("/search") || pathname.startsWith("/property")) && purpose !== "rent",
    },
    {
      to: "/search",
      label: "Rent",
      icon: Building2,
      search: { purpose: "rent" as const },
      active: pathname.startsWith("/search") && purpose === "rent",
    },
    { to: "/saved", label: "Saved", icon: Heart, active: pathname === "/saved" },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
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
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function SectionHead({
  title,
  href,
  action = "View all",
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h2 className="text-lg font-semibold tracking-normal text-black sm:text-xl">
        {title}
      </h2>
      {href && (
        <a href={href} className="text-sm font-semibold text-primary hover:underline">
          {action}
        </a>
      )}
    </div>
  );
}

export function ToolTiles() {
  const tiles = [
    { to: "/tools?tab=loan", icon: Calculator, label: "Home loan", sub: "Bank packages" },
    { to: "/tools?tab=build", icon: Calculator, label: "Build cost", sub: "Grey + finishing" },
    { to: "/tools?tab=area", icon: Calculator, label: "Area converter", sub: "Marla · Kanal · Yd" },
    { to: "/maps", icon: MapIcon, label: "Plot finder", sub: "12 societies" },
    { to: "/property-index", icon: BookOpen, label: "Price index", sub: "Since 2020" },
    { to: "/trends", icon: BookOpen, label: "Trends", sub: "Hot areas" },
    { to: "/guides", icon: BookOpen, label: "Area guides", sub: "Prices & streets" },
    { to: "/invest", icon: Building2, label: "Invest", sub: "Property blocks" },
    { to: "/agencies", icon: Users, label: "Agencies", sub: "Titanium desks" },
    { to: "/community", icon: Users, label: "Community", sub: "Ask the market" },
    { to: "/wanted", icon: Search, label: "Wanted", sub: "Buyer requests" },
    { to: "/cities", icon: MapIcon, label: "All cities", sub: "Pakistan" },
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
