import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NumField, ResultRow } from "@/components/calc-ui";
import { num } from "@/lib/calculators";
import { PostFreeCta } from "@/components/post-free-cta";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { ShareBar } from "@/components/share-bar";
import { rentVsBuy } from "@/lib/calculators";
import { formatPkr } from "@/lib/format";
import { tx, useLang } from "@/lib/i18n";
import { breadcrumbLd, withSchema } from "@/lib/schema";
import { OG, seo } from "@/lib/seo";

/** Every input can come from the URL so a shared link opens with the same numbers. */
const KEYS = ["price", "rent", "down", "rate", "tenure", "stay", "rentUp", "growth", "ret", "cost", "upkeep"] as const;
type Key = (typeof KEYS)[number];
type Search = Partial<Record<Key, number>>;

// Example values only, clearly labelled on the page. None of them is a market rate.
const EXAMPLE: Record<Key, number> = {
  price: 15_000_000,
  rent: 50_000,
  down: 30,
  rate: 16,
  tenure: 15,
  stay: 10,
  rentUp: 10,
  growth: 7,
  ret: 10,
  cost: 4,
  upkeep: 0.5,
};

function parse(s: Record<string, unknown>): Search {
  const out: Search = {};
  for (const k of KEYS) {
    const n = Number(s[k]);
    if (s[k] !== undefined && Number.isFinite(n) && n >= 0 && n < 1e12) out[k] = n;
  }
  return out;
}

const TITLE = "Rent or Buy Calculator for Pakistan";
const DESC =
  "Free rent vs buy calculator for Pakistan in English and Urdu. Compare a home loan instalment with rent, year by year, using your own price, rent, markup and savings return.";

export const Route = createFileRoute("/tools/rent-vs-buy")({
  validateSearch: parse,
  head: () =>
    withSchema(
      seo(TITLE, DESC, { path: "/tools/rent-vs-buy", image: OG.tool("rent-vs-buy"), imageAlt: "Rent or buy calculator on Diwaar.com" }),
      {
        "@type": "WebApplication",
        name: TITLE,
        url: "https://www.diwaar.com/tools/rent-vs-buy",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        inLanguage: ["en", "ur"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
      },
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Tools", path: "/tools" },
        { name: "Rent or buy", path: "/tools/rent-vs-buy" },
      ]),
    ),
  component: RentVsBuyPage,
});

function RentVsBuyPage() {
  const { lang } = useLang();
  const search = Route.useSearch();
  const [v, setV] = useState<Record<Key, string>>(() => {
    const init = {} as Record<Key, string>;
    for (const k of KEYS) init[k] = String(search[k] ?? EXAMPLE[k]);
    return init;
  });
  const set = (k: Key) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const res = useMemo(
    () =>
      rentVsBuy({
        price: num(v.price),
        rent: num(v.rent),
        downPct: num(v.down),
        ratePct: num(v.rate),
        tenureYears: Math.max(1, num(v.tenure)),
        stayYears: Math.min(40, Math.max(1, num(v.stay))),
        rentUpPct: num(v.rentUp),
        growthPct: num(v.growth),
        returnPct: num(v.ret),
        buyCostPct: num(v.cost),
        upkeepPct: num(v.upkeep),
      }),
    [v],
  );

  const sharePath = `/tools/rent-vs-buy?${KEYS.map((k) => `${k}=${encodeURIComponent(String(num(v[k])))}`).join("&")}`;
  const stay = Math.round(Math.min(40, Math.max(1, num(v.stay))));
  const buyWins = res.last.buyWorth >= res.last.rentWorth;
  const gap = Math.abs(res.last.buyWorth - res.last.rentWorth);
  const verdictEn = buyWins
    ? `With these numbers, buying leaves you about ${formatPkr(gap)} better off after ${stay} years.`
    : `With these numbers, renting and saving the difference leaves you about ${formatPkr(gap)} better off after ${stay} years.`;
  const verdictUr = buyWins
    ? `ان اعداد کے ساتھ ${stay} سال بعد خریدنا تقریباً ${formatPkr(gap)} بہتر رہتا ہے۔`
    : `ان اعداد کے ساتھ ${stay} سال بعد کرایے پر رہ کر فرق بچانا تقریباً ${formatPkr(gap)} بہتر رہتا ہے۔`;
  const L = (en: string, ur: string) => tx(lang, en, ur);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/tools" search={{ tab: "loan" }} className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {L("Free tools", "مفت ٹولز")}
      </Link>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{L("Rent or buy?", "کرایہ یا خریداری؟")}</h1>
      <p className="mt-2 text-sm text-muted">
        {L(
          "Compare buying with a home loan against renting a similar home and saving the difference. Change any number; the answer updates as you type.",
          "ہوم لون پر گھر خریدنے کا موازنہ ویسا ہی گھر کرایے پر لے کر فرق بچانے سے کریں۔ کوئی بھی عدد بدلیں، جواب فوراً بدل جائے گا۔",
        )}
      </p>
      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
        {L(
          "The starting numbers are examples, not market rates. Replace the markup with the rate in your bank's offer, and the rent with a real ad for a similar home.",
          "شروع کے اعداد صرف مثال ہیں، مارکیٹ ریٹ نہیں۔ مارک اپ کی جگہ اپنے بینک کی آفر کا ریٹ اور کرایے کی جگہ ملتے جلتے گھر کا اصل کرایہ لکھیں۔",
        )}
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl bg-surface p-5 shadow-card sm:grid-cols-2">
        <NumField label={L("Home price", "گھر کی قیمت")} suffix="PKR" value={v.price} onChange={set("price")} hint={formatPkr(num(v.price))} />
        <NumField label={L("Monthly rent for a similar home", "ملتے جلتے گھر کا ماہانہ کرایہ")} suffix="PKR" value={v.rent} onChange={set("rent")} hint={formatPkr(num(v.rent))} />
        <NumField label={L("Down payment", "ڈاؤن پیمنٹ")} suffix="%" value={v.down} onChange={set("down")} />
        <NumField
          label={L("Loan markup (yearly)", "قرض کا مارک اپ (سالانہ)")}
          suffix="%"
          value={v.rate}
          onChange={set("rate")}
          hint={L("From your bank's offer letter.", "اپنے بینک کی آفر سے لکھیں۔")}
        />
        <NumField label={L("Loan tenure", "قرض کی مدت")} suffix={L("years", "سال")} value={v.tenure} onChange={set("tenure")} />
        <NumField label={L("How long you'll stay", "آپ کتنا عرصہ رہیں گے")} suffix={L("years", "سال")} value={v.stay} onChange={set("stay")} />
        <NumField label={L("Yearly rent increase", "کرایے میں سالانہ اضافہ")} suffix="%" value={v.rentUp} onChange={set("rentUp")} hint={L("Check your rent agreement.", "اپنا کرایہ نامہ دیکھیں۔")} />
        <NumField label={L("Yearly change in home value", "گھر کی قیمت میں سالانہ تبدیلی")} suffix="%" value={v.growth} onChange={set("growth")} hint={L("Your own guess. Prices can also fall.", "آپ کا اپنا اندازہ۔ قیمت کم بھی ہو سکتی ہے۔")} />
        <NumField label={L("Return on your savings (yearly)", "بچت پر منافع (سالانہ)")} suffix="%" value={v.ret} onChange={set("ret")} hint={L("What your bank or fund pays you.", "جو آپ کا بینک یا فنڈ دیتا ہے۔")} />
        <NumField
          label={L("Buying costs (one-off)", "خریداری کے اخراجات (ایک بار)")}
          suffix="%"
          value={v.cost}
          onChange={set("cost")}
          hint={
            <>
              {L("Taxes and fees as % of price. ", "قیمت کا فیصد۔ ")}
              <Link to="/tools/transfer-cost" className="font-semibold text-primary">
                {L("Work it out", "حساب لگائیں")}
              </Link>
            </>
          }
        />
        <NumField label={L("Yearly upkeep", "سالانہ مرمت و دیکھ بھال")} suffix="%" value={v.upkeep} onChange={set("upkeep")} hint={L("% of the home's value.", "گھر کی قیمت کا فیصد۔")} />
      </div>

      <section className="mt-6 rounded-2xl bg-surface p-5 shadow-card" aria-live="polite">
        <p className="text-lg font-bold text-black">{L(verdictEn, verdictUr)}</p>
        <p className="mt-1 text-sm text-muted">
          {res.breakEvenYear
            ? L(`Buying pulls ahead in year ${res.breakEvenYear}.`, `خریداری ${res.breakEvenYear} ویں سال میں آگے نکلتی ہے۔`)
            : L(`Buying does not pull ahead within ${stay} years.`, `${stay} سال میں خریداری آگے نہیں نکلتی۔`)}
        </p>
        <dl className="mt-4 divide-y divide-border">
          <ResultRow k={L("Monthly instalment", "ماہانہ قسط")} v={formatPkr(res.emi)} strong />
          <ResultRow k={L("Rent today", "آج کا کرایہ")} v={formatPkr(num(v.rent))} />
          <ResultRow k={L("Cash needed to buy (down payment + costs)", "خریدنے کے لیے نقد (ڈاؤن پیمنٹ + اخراجات)")} v={formatPkr(res.upfront)} />
          <ResultRow k={L(`If you buy: worth after ${stay} years`, `خریدیں تو ${stay} سال بعد مالیت`)} v={formatPkr(res.last.buyWorth)} />
          <ResultRow k={L(`If you rent: savings after ${stay} years`, `کرایے پر رہیں تو ${stay} سال بعد بچت`)} v={formatPkr(res.last.rentWorth)} />
        </dl>
      </section>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-surface shadow-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-ice text-start">
            <tr>
              <th className="px-3 py-2 text-start font-semibold">{L("Year", "سال")}</th>
              <th className="px-3 py-2 text-end font-semibold">{L("Rent paid (total)", "کل کرایہ")}</th>
              <th className="px-3 py-2 text-end font-semibold">{L("Loan left", "باقی قرض")}</th>
              <th className="px-3 py-2 text-end font-semibold">{L("Buy: worth", "خریداری: مالیت")}</th>
              <th className="px-3 py-2 text-end font-semibold">{L("Rent: savings", "کرایہ: بچت")}</th>
            </tr>
          </thead>
          <tbody>
            {res.years.map((y) => (
              <tr key={y.year} className="border-t border-border tabular-nums whitespace-nowrap">
                <td className="px-3 py-2">{y.year}</td>
                <td className="px-3 py-2 text-end">{formatPkr(y.rentPaid)}</td>
                <td className="px-3 py-2 text-end">{formatPkr(y.loanLeft)}</td>
                <td className={`px-3 py-2 text-end ${y.buyWorth >= y.rentWorth ? "font-bold text-primary-dark" : ""}`}>{formatPkr(y.buyWorth)}</td>
                <td className={`px-3 py-2 text-end ${y.rentWorth > y.buyWorth ? "font-bold text-primary-dark" : ""}`}>{formatPkr(y.rentWorth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ShareBar
        className="mt-6"
        path={sharePath}
        campaign="rent-vs-buy"
        title={{ en: "Send these exact numbers to family", ur: "یہی اعداد گھر والوں کو بھیجیں" }}
        en={`Rent or buy? ${verdictEn} Check with your own numbers:`}
        ur={`کرایہ یا خریداری؟ ${verdictUr} اپنے اعداد سے چیک کریں:`}
      />

      <section className="mt-8 space-y-2 text-sm text-muted">
        <h2 className="text-base font-bold text-black">{L("How this works", "یہ حساب کیسے ہوتا ہے")}</h2>
        <p>
          {L(
            "Both households start with the same cash. The buyer spends it on the down payment and buying costs; the renter invests it. Each month, whoever pays less (instalment plus upkeep, or rent) invests the difference at your savings return. The buyer's worth is the home's value minus the loan left plus their savings; the renter's worth is their savings.",
            "دونوں کے پاس شروع میں برابر نقد ہوتا ہے۔ خریدار اسے ڈاؤن پیمنٹ اور اخراجات پر لگاتا ہے، کرایہ دار اسے بچت میں رکھتا ہے۔ ہر ماہ جس کا خرچ کم ہو (قسط اور مرمت، یا کرایہ) وہ فرق بچت میں ڈالتا ہے۔ خریدار کی مالیت = گھر کی قیمت − باقی قرض + بچت؛ کرایہ دار کی مالیت = اس کی بچت۔",
          )}
        </p>
        <p>
          {L(
            "This is an estimate, not financial advice. It ignores taxes on savings profit, insurance and changes in markup during the loan. Islamic home finance (diminishing musharakah) is priced differently; ask your bank for its monthly payment schedule.",
            "یہ صرف اندازہ ہے، مالی مشورہ نہیں۔ اس میں بچت کے منافع پر ٹیکس، انشورنس اور قرض کے دوران مارک اپ میں تبدیلی شامل نہیں۔ اسلامی ہوم فنانس (ڈیمنشنگ مشارکہ) کا حساب مختلف ہوتا ہے؛ اپنے بینک سے ماہانہ ادائیگی کا شیڈول لیں۔",
          )}
        </p>
      </section>

      <PostFreeCta className="mt-8" />
      <RelatedLinks links={[PAGE.transferCost, PAGE.loans, PAGE.rent, PAGE.sale, PAGE.blog]} />
    </div>
  );
}
