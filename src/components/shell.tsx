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
} from "lucide-react";
import { useEffect, useState } from "react";
import { DiwaarWordmark } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { AREA_LABEL, type AreaUnit } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/search", label: "Properties", search: { purpose: "buy" as const } },
  { to: "/projects", label: "Projects" },
  { to: "/guides", label: "Area Guides" },
  { to: "/maps", label: "Maps" },
  { to: "/blog", label: "Blog" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const saved = useAppStore((s) => s.savedIds.length);

  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="shrink-0" aria-label="Diwaar home">
            <DiwaarWordmark compact />
          </Link>
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={"search" in item ? item.search : undefined}
                className="h-10 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-ice hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <PrefsMenu />
            <Link
              to="/saved"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative",
              )}
              aria-label="Saved properties"
            >
              <Heart className="size-5" />
              {saved > 0 && (
                <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-hot text-[10px] font-bold text-primary-fg grid place-items-center">
                  {saved}
                </span>
              )}
            </Link>
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
              className="lg:hidden size-11 grid place-items-center rounded-lg hover:bg-ice"
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
          <aside className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-surface shadow-card">
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
            <nav className="flex flex-col p-3 gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  search={"search" in item ? item.search : undefined}
                  onClick={() => setOpen(false)}
                  className="h-12 rounded-lg px-3 text-sm font-semibold flex items-center hover:bg-ice"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/agents"
                onClick={() => setOpen(false)}
                className="h-12 rounded-lg px-3 text-sm font-semibold flex items-center hover:bg-ice"
              >
                Agents
              </Link>
              <Link
                to="/tools"
                search={{ tab: "loan" }}
                onClick={() => setOpen(false)}
                className="h-12 rounded-lg px-3 text-sm font-semibold flex items-center hover:bg-ice"
              >
                Calculators
              </Link>
              <Link
                to="/add"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "primary" }), "mt-3")}
              >
                <Plus /> Add Property
              </Link>
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 pb-24 lg:pb-0">{children}</main>

      <Footer />
      <BottomNav />
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
              {(["PKR", "USD"] as const).map((c) => (
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
            Pakistan's property portal for houses, flats, plots and
            commercial — buy, rent or list in minutes.
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
        © 2026 Diwaar Media. Listings are for demonstration.
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

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/", icon: Home, label: "Home", match: (p: string) => p === "/" },
    {
      to: "/search",
      icon: Search,
      label: "Search",
      match: (p: string) => p.startsWith("/search") || p.startsWith("/property"),
    },
    { to: "/add", icon: Plus, label: "Add", match: (p: string) => p === "/add", raised: true },
    {
      to: "/saved",
      icon: Heart,
      label: "Saved",
      match: (p: string) => p === "/saved",
    },
    {
      to: "/agents",
      icon: Users,
      label: "Agents",
      match: (p: string) =>
        p.startsWith("/agents") ||
        p.startsWith("/guides") ||
        p.startsWith("/maps") ||
        p.startsWith("/tools") ||
        p.startsWith("/blog") ||
        p.startsWith("/projects"),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface shadow-nav"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.to} className="contents">
              <Link
                to={item.to}
                search={item.to === "/search" ? { purpose: "buy" } : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
                  active ? "text-primary" : "text-muted",
                )}
              >
                {"raised" in item && item.raised ? (
                  <span className="-mt-5 size-12 rounded-full bg-primary text-primary-fg grid place-items-center shadow-card">
                    <Icon className="size-5" />
                  </span>
                ) : (
                  <Icon className="size-5" />
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
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
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="text-xl font-extrabold tracking-tight text-primary-dark sm:text-2xl">
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
    { to: "/tools?tab=loan", icon: Calculator, label: "Home loan", sub: "Monthly instalment" },
    { to: "/tools?tab=build", icon: Calculator, label: "Build cost", sub: "Grey + finishing" },
    { to: "/tools?tab=area", icon: Calculator, label: "Area converter", sub: "Marla · Kanal · Yd" },
    { to: "/maps", icon: MapIcon, label: "Plot finder", sub: "Society maps" },
    { to: "/guides", icon: BookOpen, label: "Area guides", sub: "Prices & streets" },
    { to: "/agents", icon: Users, label: "Agents", sub: "Verified agencies" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <a
            key={t.to}
            href={t.to}
            className="rounded-xl bg-surface p-4 shadow-card hover:shadow-card-hover transition-[box-shadow] duration-fast"
          >
            <span className="size-10 rounded-lg bg-ice text-primary grid place-items-center mb-3">
              <Icon className="size-5" />
            </span>
            <p className="font-semibold text-sm">{t.label}</p>
            <p className="text-xs text-muted mt-0.5">{t.sub}</p>
          </a>
        );
      })}
    </div>
  );
}
