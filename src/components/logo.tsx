import { cn } from "@/lib/utils";

export function DiwaarMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <rect width="32" height="32" rx="4" fill={inverted ? "#fff" : "#0B4A8C"} />
      <path
        fill="none"
        stroke={inverted ? "#071525" : "#ffffff"}
        strokeWidth="2.4"
        strokeLinejoin="round"
        d="M6.5 15.5 L16 7.5 L25.5 15.5 L25.5 25.5 L6.5 25.5 Z"
      />
      <circle
        cx="16"
        cy="17.5"
        r="4.2"
        fill="none"
        stroke="#00E676"
        strokeWidth="2.2"
      />
      <line
        x1="19.2"
        y1="20.7"
        x2="22.8"
        y2="24.3"
        stroke="#00E676"
        strokeWidth="2.2"
        strokeLinecap="round"
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
      <DiwaarMark inverted={inverted} className={inverted ? "text-white" : "text-primary"} />
      <span className="leading-tight">
        <span
          className={cn(
            "block font-sans text-[17px] font-semibold tracking-normal",
            inverted ? "text-white" : "text-primary-dark",
          )}
        >
          diwaar
          <span className={inverted ? "text-ice-2" : "text-primary"}>.com</span>
        </span>
        <span
          className={cn(
            "block text-[11px] font-semibold tracking-[0.02em] normal-case",
            inverted ? "text-ice-2" : "text-primary-dark/80",
            compact && "text-[10px]",
          )}
        >
          let's go home
        </span>
      </span>
    </span>
  );
}
