import { cn } from "@/lib/utils";

export function DiwaarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-9", className)} aria-hidden>
      <rect width="48" height="48" rx="12" fill="currentColor" />
      <path
        fill="#fff"
        d="M9.5 22.2 24 9.4 38.5 22.2V23H33v13.6H15V23H9.5v-.8Z"
      />
      <path
        fill="currentColor"
        d="M19.2 25.4h4.6c3.4 0 5.5 1.9 5.5 4.8s-2.1 4.9-5.5 4.9h-4.6V25.4Zm2.4 2.1v5.5h2.1c2 0 3.2-1.1 3.2-2.75 0-1.66-1.2-2.75-3.2-2.75h-2.1Z"
      />
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
      <DiwaarMark className={inverted ? "text-surface" : "text-primary"} />
      <span className="leading-tight">
        <span
          className={cn(
            "block font-extrabold tracking-tight text-lg",
            inverted ? "text-primary-fg" : "text-primary-dark",
          )}
        >
          Diwaar
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
