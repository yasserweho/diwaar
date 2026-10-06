import { cn } from "@/lib/utils";

export function DiwaarMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <rect width="32" height="32" rx="4" fill="currentColor" />
      <path fill={inverted ? "#071525" : "#fff"} d="M6 15.2 16 6.4 26 15.2V16h-3.2v9.2H9.2V16H6v-.8Z" />
    </svg>
  );
}

export function DiwaarWordmark({
  inverted = false,
  compact = false,
}: {
  inverted?: boolean;
  compact?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <DiwaarMark inverted={inverted} className={inverted ? "text-white" : "text-primary"} />
      <span className="leading-tight">
        <span
          className={cn(
            "block font-sans text-[17px] font-semibold tracking-normal",
            inverted ? "text-primary-fg" : "text-primary-dark",
          )}
        >
          diwaar
          <span className={inverted ? "text-ice-2" : "text-primary"}>.com</span>
        </span>
        {!compact && (
          <span
            className={cn(
              "block text-[10px] font-medium uppercase tracking-[0.16em]",
              inverted ? "text-ice-2" : "text-muted",
            )}
          >
            Property Portal
          </span>
        )}
      </span>
    </span>
  );
}
