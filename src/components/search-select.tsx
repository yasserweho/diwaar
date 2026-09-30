import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function SearchSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  searchPlaceholder = "Type to search",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.value === value);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? options.filter((option) => option.label.toLowerCase().includes(q)) : options;
    return list.slice(0, 80);
  }, [options, query]);

  const hidden = useMemo(() => {
    const q = query.trim().toLowerCase();
    const total = q ? options.filter((option) => option.label.toLowerCase().includes(q)).length : options.length;
    return Math.max(0, total - matches.length);
  }, [matches.length, options, query]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next: string) {
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm font-medium text-fg outline-none focus:border-primary",
          className,
        )}
        onClick={() => {
          setOpen((was) => !was);
          setQuery("");
        }}
      >
        <span className={cn("truncate", !selected && "text-muted")}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          <input
            ref={field}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              if (matches[0]) choose(matches[0].value);
            }}
            placeholder={searchPlaceholder}
            className="h-11 w-full border-b border-border bg-surface px-3 text-base outline-none placeholder:text-muted"
            aria-label={searchPlaceholder}
          />
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">No matches</li>
            ) : (
              matches.map((option) => (
                <li key={option.value || option.label}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    className={cn(
                      "block w-full truncate px-3 py-2.5 text-left text-sm hover:bg-ice",
                      option.value === value && "bg-ice font-semibold text-primary-dark",
                    )}
                    onClick={() => choose(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
            {hidden > 0 && (
              <li className="px-3 py-2 text-xs text-muted">Keep typing to see {hidden} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
