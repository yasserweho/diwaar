import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const calcField =
  "ink-control h-12 w-full rounded-lg border border-border bg-surface px-3 text-base tabular-nums outline-none focus:border-primary";

/** Numeric input that keeps the raw text while typing; commas are ignored. */
export function NumField({
  label,
  value,
  onChange,
  suffix,
  hint,
  placeholder,
}: {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: ReactNode;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-black">
      {label}
      <span className="relative mt-1 block">
        <input
          className={cn(calcField, suffix && "pe-14")}
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-sm font-medium text-muted">
            {suffix}
          </span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: ReactNode;
}) {
  return (
    <fieldset className="text-sm font-semibold text-black">
      <legend>{label}</legend>
      <div className="mt-1 grid grid-cols-2 gap-1 rounded-lg bg-ice p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-10 rounded-md text-sm font-semibold",
              value === o.value ? "bg-primary text-primary-fg" : "text-muted hover:text-black",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ResultRow({ k, v, strong }: { k: ReactNode; v: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted">{k}</dt>
      <dd className={cn("tabular-nums text-end", strong ? "text-base font-extrabold text-primary-dark" : "font-semibold")}>{v}</dd>
    </div>
  );
}
