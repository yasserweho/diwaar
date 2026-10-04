import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SOCIETIES } from "@/lib/portal";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/maps")({
  head: () =>
    seo(
      "Society Plot Maps in Pakistan",
      "Browse block and plot maps for housing societies and see which files are open.",
      { path: "/maps" },
    ),
  component: MapsPage });

type Plot = {
  id: string;
  block: string;
  n: number;
  status: "open" | "held" | "sold";
  size: "5m" | "10m" | "1k";
};

const BLOCKS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SIZES: Plot["size"][] = ["5m", "10m", "1k"];
const SIZE_LABEL = { "5m": "5 Marla", "10m": "10 Marla", "1k": "1 Kanal" };

function makePlots(seed: number): Plot[] {
  const out: Plot[] = [];
  BLOCKS.forEach((block, bi) => {
    for (let n = 1; n <= 16; n++) {
      const s = (bi * 17 + n * 13 + seed * 5) % 10;
      out.push({
        id: `${block}-${n}`,
        block,
        n,
        status: s < 5 ? "open" : s < 8 ? "held" : "sold",
        size: SIZES[(bi + n + seed) % 3],
      });
    }
  });
  return out;
}

function MapsPage() {
  const [societyId, setSocietyId] = useState(SOCIETIES[0].id);
  const society = SOCIETIES.find((s) => s.id === societyId) ?? SOCIETIES[0];
  const plots = useMemo(() => makePlots(SOCIETIES.findIndex((s) => s.id === society.id)), [society.id]);
  const [block, setBlock] = useState("C");
  const [picked, setPicked] = useState<Plot | null>(null);
  const navigate = useNavigate();
  const view = plots.filter((p) => p.block === block);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Plot finder</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{society.name}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Pick a society, then a plot. Open plots can be matched to live Diwaar listings in that area.
      </p>
      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {SOCIETIES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSocietyId(s.id);
              setPicked(null);
            }}
            className={cn(
              "h-10 shrink-0 rounded-lg px-3 text-sm font-semibold",
              society.id === s.id ? "bg-primary-dark text-primary-fg" : "bg-surface text-fg shadow-card",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
        {BLOCKS.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => {
              setBlock(b);
              setPicked(null);
            }}
            className={cn(
              "h-10 min-w-12 rounded-lg px-3 text-sm font-bold",
              block === b ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-card",
            )}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl bg-primary-dark p-4 sm:p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ice-2">
            Block {block} · 60-ft broadway along the south
          </p>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {view.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPicked(p)}
                className={cn(
                  "aspect-square rounded-md text-[10px] sm:text-xs font-bold",
                  p.status === "open" && "bg-verified text-primary-fg",
                  p.status === "held" && "bg-primary text-primary-fg",
                  p.status === "sold" && "bg-ice-2/40 text-ice-2",
                  picked?.id === p.id && "ring-2 ring-primary-fg",
                )}
              >
                {p.n}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-ice-2">
            <span className="inline-flex items-center gap-1.5">
              <i className="size-3 rounded-sm bg-verified" /> Open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-3 rounded-sm bg-primary" /> Token
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-3 rounded-sm bg-ice-2/40" /> Sold
            </span>
          </div>
        </div>
        <aside className="rounded-2xl bg-surface p-5 shadow-card h-fit">
          {picked ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Selected plot</p>
              <h2 className="mt-1 text-xl font-extrabold">
                Block {picked.block} · Plot {picked.n}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {SIZE_LABEL[picked.size]} · {society.name}
              </p>
              <p className="mt-1 text-sm font-semibold capitalize">{picked.status === "open" ? "Available" : picked.status === "held" ? "On token" : "Sold"}</p>
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  void navigate({
                    to: "/search",
                    search: {
                      purpose: "buy",
                      city: society.city,
                      location: society.location,
                      type: "plot",
                    },
                  })
                }
              >
                See {society.location} plots
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted">Select a plot on the schematic to inspect it.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
