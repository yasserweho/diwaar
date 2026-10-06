import { FAQ } from "@/lib/faq";
import { tx, useLang } from "@/lib/i18n";

export function FaqList({ limit }: { limit?: number }) {
  const { lang } = useLang();
  const items = limit ? FAQ.slice(0, limit) : FAQ;
  return (
    <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-4 py-3">
          <summary className="cursor-pointer text-start text-sm font-semibold text-black">
            {tx(lang, item.q, item.qUr)}
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted">{tx(lang, item.a, item.aUr)}</p>
        </details>
      ))}
    </div>
  );
}
