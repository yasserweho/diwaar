import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [box, setBox] = useState({ top: 0, left: 0, width: 0, maxHeight: 280 });
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  const matches = filtered.slice(0, 80);

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const maxHeight = Math.max(180, Math.min(320, below));
      setBox({ top: rect.bottom + 4, left: rect.left, width: rect.width, maxHeight });
    }
    place();
    const focusId = window.setTimeout(() => field.current?.focus(), 0);
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (root.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-search-select-panel]")) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.clearTimeout(focusId);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  function choose(next: string) {
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            data-search-select-panel
            className="diwaar-menu fixed z-[80] overflow-hidden rounded-lg border border-[#5c6b7e] shadow-card"
            style={{ top: box.top, left: box.left, width: box.width, color: "#000", backgroundColor: "#fff" }}
          >
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
              className="h-11 w-full border-b border-[#5c6b7e] px-3 text-base outline-none"
              style={{ color: "#000", backgroundColor: "#fff", WebkitTextFillColor: "#000" }}
              aria-label={searchPlaceholder}
            />
            <ul role="listbox" className="overflow-y-auto py-1" style={{ maxHeight: box.maxHeight }}>
              {matches.length === 0 ? (
                <li className="px-3 py-2 text-sm text-[#5c6e82]">No matches</li>
              ) : (
                matches.map((option) => (
                  <li key={`${option.value}:${option.label}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.value === value}
                      className={cn(
                        "block w-full truncate px-3 py-2.5 text-start text-sm",
                        option.value === value && "font-semibold",
                      )}
                      style={{ color: "#000", backgroundColor: option.value === value ? "#e7f0fc" : "#fff" }}
                      onClick={() => choose(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))
              )}
              {filtered.length > matches.length && (
                <li className="px-3 py-2 text-xs text-[#5c6e82]">
                  Keep typing to see {filtered.length - matches.length} more
                </li>
              )}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-border px-3 text-start text-sm font-medium outline-none focus:border-primary",
          className,
        )}
        style={{ color: "#000", backgroundColor: "#fff" }}
        onClick={() => {
          setOpen((was) => !was);
          setQuery("");
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#5c6e82] transition-transform", open && "rotate-180")} />
      </button>
      {panel}
    </div>
  );
}
