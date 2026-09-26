import { cn } from "@/lib/utils";
import type { Badge as BadgeKind } from "@/lib/types";

const STYLES: Record<BadgeKind, string> = {
  superhot: "bg-superhot-bg text-superhot",
  hot: "bg-hot-bg text-hot",
  verified: "bg-verified-bg text-verified",
  featured: "bg-ice text-primary-dark",
  platinum: "bg-primary-dark text-primary-fg",
};

const LABEL: Record<BadgeKind, string> = {
  superhot: "Super Hot",
  hot: "Hot",
  verified: "Verified",
  featured: "Featured",
  platinum: "Platinum",
};

export function ListingBadge({ kind }: { kind: BadgeKind }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        STYLES[kind],
      )}
    >
      {LABEL[kind]}
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 text-sm font-medium border transition-colors duration-fast",
        active
          ? "bg-primary text-primary-fg border-primary"
          : "bg-surface text-fg border-border hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
