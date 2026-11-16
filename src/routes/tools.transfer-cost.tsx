import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NumField, ResultRow, Toggle } from "@/components/calc-ui";
import { num } from "@/lib/calculators";
import { PostFreeCta } from "@/components/post-free-cta";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { ShareBar } from "@/components/share-bar";
import { FBR_TY2027, transferCost } from "@/lib/calculators";
import { formatPkr } from "@/lib/format";
import { tx, useLang } from "@/lib/i18n";
import { breadcrumbLd, withSchema } from "@/lib/schema";
import { OG, seo } from "@/lib/seo";

type Region = "punjab" | "ict";
type Search = { price?: number; fmv?: number; buyer?: "atl" | "non"; seller?: "atl" | "non"; region?: Region };

function parse(s: Record<string, unknown>): Search {
  const n = (v: unknown) => {
    const x = Number(v);
    return v !== undefined && Number.isFinite(x) && x > 0 && x < 1e13 ? x : undefined;
  };
  return {
    price: n(s.price),
    fmv: n(s.fmv),
    buyer: s.buyer === "non" ? "non" : s.buyer === "atl" ? "atl" : undefined,
    seller: s.seller === "non" ? "non" : s.seller === "atl" ? "atl" : undefined,
    region: s.region === "ict" ? "ict" : s.region === "punjab" ? "punjab" : undefined,
  };
}

const TITLE = "Property Transfer Cost Calculator: Punjab and Islamabad";
const DESC =
  "Estimate the cost of transferring property in Punjab or Islamabad: FBR advance tax under sections 236K (buyer) and 236C (seller) for filers and non-filers, Tax Year 2027, plus the stamp duty and fees your registrar quotes.";

export const Route = createFileRoute("/tools/transfer-cost")({
  validateSearch: parse,
  head: () =>
    withSchema(
      seo(TITLE, DESC, { path: "/tools/transfer-cost", image: OG.tool("transfer-cost"), imageAlt: "Property transfer cost estimator on Diwaar.com" }),
      {
        "@type": "WebApplication",
        name: TITLE,
        url: "https://www.diwaar.com/tools/transfer-cost",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        inLanguage: ["en", "ur"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
      },
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Tools", path: "/tools" },
        { name: "Transfer cost", path: "/tools/transfer-cost" },
      ]),
    ),
  component: TransferCostPage,
});

function TransferCostPage() {
  const { lang } = useLang();
  const L = (en: string, ur: string) => tx(lang, en, ur);
  const search = Route.useSearch();
  const [region, setRegion] = useState<Region>(search.region ?? "punjab");
  const [price, setPrice] = useState(String(search.price ?? 15_000_000));
  const [fmv, setFmv] = useState(search.fmv ? String(search.fmv) : "");
  const [buyer, setBuyer] = useState<"atl" | "non">(search.buyer ?? "atl");
  const [seller, setSeller] = useState<"atl" | "non">(search.seller ?? "atl");
  // Provincial / ICT charges: deliberately blank. We could not confirm current
  // official rates, so the user types what their sub-registrar or society quotes.
  const [stamp, setStamp] = useState("");
  const [cvt, setCvt] = useState("");
  const [reg, setReg] = useState("");
  const [society, setSociety] = useState("");
  const [other, setOther] = useState("");

  const p = num(price);
  const f = fmv.trim() ? num(fmv) : p;
  const res = useMemo(
    () =>
      transferCost({
        price: p,
        fmv: f,
        buyerAtl: buyer === "atl",
        sellerAtl: seller === "atl",
        stampPct: num(stamp),
        cvtPct: region === "ict" ? num(cvt) : 0,
        regFee: num(reg),
        societyFee: num(society),
        otherFee: num(other),
      }),
    [p, f, buyer, seller, stamp, cvt, reg, society, other, region],
  );
  const provincialEntered = res.provincial > 0;
  const sharePath = `/tools/transfer-cost?price=${p}${fmv.trim() ? `&fmv=${f}` : ""}&buyer=${buyer}&seller=${seller}&region=${region}`;
  const shareEn = `Transferring a ${formatPkr(p)} property? FBR advance tax: buyer ${formatPkr(res.buyerTax)} (${res.buyerTaxPct}%), seller ${formatPkr(res.sellerTax)} (${res.sellerTaxPct}%). Free estimator:`;
  const shareUr = `${formatPkr(p)} کی جائیداد کا ٹرانسفر؟ ایف بی آر ایڈوانس ٹیکس: خریدار ${formatPkr(res.buyerTax)} (${res.buyerTaxPct}%)، فروخت کنندہ ${formatPkr(res.sellerTax)} (${res.sellerTaxPct}%)۔ مفت کیلکولیٹر:`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/tools" search={{ tab: "loan" }} className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {L("Free tools", "مفت ٹولز")}
      </Link>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{L("Property transfer cost estimator", "پراپرٹی ٹرانسفر لاگت کیلکولیٹر")}</h1>
      <p className="mt-2 text-sm text-muted">
        {L(
          "For Punjab and Islamabad. Works out the FBR advance tax for the buyer and the seller from the official rate card, then adds the stamp duty and fees you enter.",
          "پنجاب اور اسلام آباد کے لیے۔ سرکاری ریٹ کارڈ سے خریدار اور فروخت کنندہ کا ایف بی آر ایڈوانس ٹیکس نکالتا ہے، پھر آپ کے لکھے ہوئے اسٹامپ ڈیوٹی اور فیس شامل کرتا ہے۔",
        )}
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl bg-surface p-5 shadow-card sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Toggle
            label={L("Where is the property?", "جائیداد کہاں ہے؟")}
            value={region}
            onChange={(x) => setRegion(x as Region)}
            options={[
              { value: "punjab", label: L("Punjab", "پنجاب") },
              { value: "ict", label: L("Islamabad (ICT)", "اسلام آباد") },
            ]}
          />
        </div>
        <NumField label={L("Sale price on the deed", "رجسٹری پر قیمت فروخت")} suffix="PKR" value={price} onChange={setPrice} hint={formatPkr(p)} />
        <NumField
          label={L("FBR / official value (optional)", "ایف بی آر / سرکاری قیمت (اختیاری)")}
          suffix="PKR"
          value={fmv}
          onChange={setFmv}
          placeholder={String(p)}
          hint={L(
            "The 236K buyer tax is on fair market value (FBR valuation table). Leave blank to use the sale price.",
            "خریدار کا 236K ٹیکس فیئر مارکیٹ ویلیو (ایف بی آر ویلیوایشن ٹیبل) پر ہوتا ہے۔ خالی چھوڑیں تو قیمت فروخت استعمال ہو گی۔",
          )}
        />
        <Toggle
          label={L("Buyer on FBR's Active Taxpayers List?", "کیا خریدار ایف بی آر کی ایکٹو ٹیکس پیئر لسٹ میں ہے؟")}
          value={buyer}
          onChange={(x) => setBuyer(x as "atl" | "non")}
          options={[
            { value: "atl", label: L("Filer (ATL)", "فائلر") },
            { value: "non", label: L("Non-filer", "نان فائلر") },
          ]}
        />
        <Toggle
          label={L("Seller on the Active Taxpayers List?", "کیا فروخت کنندہ ایکٹو ٹیکس پیئر لسٹ میں ہے؟")}
          value={seller}
          onChange={(x) => setSeller(x as "atl" | "non")}
          options={[
            { value: "atl", label: L("Filer (ATL)", "فائلر") },
            { value: "non", label: L("Non-filer", "نان فائلر") },
          ]}
        />
      </div>

      <section className="mt-6 rounded-2xl bg-surface p-5 shadow-card">
        <h2 className="font-bold text-black">{L("Provincial and local charges", "صوبائی اور مقامی اخراجات")}</h2>
        <p className="mt-1 text-sm text-muted">
          {region === "punjab"
            ? L(
                "Punjab stamp duty, registration fee and any PLRA or society charges change often, and official pages did not agree when we checked on 16 Nov 2026. Enter the figures your sub-registrar, PLRA centre or society office quotes.",
                "پنجاب میں اسٹامپ ڈیوٹی، رجسٹریشن فیس اور PLRA یا سوسائٹی کے چارجز اکثر بدلتے ہیں، اور 16 نومبر 2026 کو سرکاری صفحات میں فرق تھا۔ وہی رقم لکھیں جو سب رجسٹرار، PLRA سینٹر یا سوسائٹی آفس بتائے۔",
              )
            : L(
                "Islamabad stamp duty, capital value tax (CVT) and registration fees are set by the ICT administration and could not be confirmed from an official page on 16 Nov 2026. Enter the figures the sub-registrar, CDA or your society quotes.",
                "اسلام آباد میں اسٹامپ ڈیوٹی، کیپیٹل ویلیو ٹیکس (CVT) اور رجسٹریشن فیس کی تازہ شرح 16 نومبر 2026 کو کسی سرکاری صفحے سے تصدیق نہیں ہو سکی۔ وہی رقم لکھیں جو سب رجسٹرار، CDA یا سوسائٹی بتائے۔",
              )}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumField label={L("Stamp duty", "اسٹامپ ڈیوٹی")} suffix="%" value={stamp} onChange={setStamp} placeholder={L("as quoted", "جو بتایا جائے")} />
          {region === "ict" && (
            <NumField label={L("Capital value tax (CVT)", "کیپیٹل ویلیو ٹیکس")} suffix="%" value={cvt} onChange={setCvt} placeholder={L("as quoted", "جو بتایا جائے")} />
          )}
          <NumField label={L("Registration fee", "رجسٹریشن فیس")} suffix="PKR" value={reg} onChange={setReg} placeholder="0" />
          <NumField label={L("Society / authority transfer fee", "سوسائٹی / اتھارٹی ٹرانسفر فیس")} suffix="PKR" value={society} onChange={setSociety} placeholder="0" />
          <NumField label={L("Other charges", "دیگر اخراجات")} suffix="PKR" value={other} onChange={setOther} placeholder="0" hint={L("e.g. e-registration, mutation, NOC fees", "مثلاً ای رجسٹریشن، انتقال، NOC فیس")} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-surface p-5 shadow-card" aria-live="polite">
        <h2 className="font-bold text-black">{L("Estimate", "اندازہ")}</h2>
        <dl className="mt-2 divide-y divide-border">
          <ResultRow k={L(`Buyer: FBR advance tax, s.236K (${res.buyerTaxPct}% of ${formatPkr(f)})`, `خریدار: ایف بی آر ایڈوانس ٹیکس، 236K (${formatPkr(f)} کا ${res.buyerTaxPct}%)`)} v={formatPkr(res.buyerTax)} />
          {res.stamp > 0 && <ResultRow k={L("Buyer: stamp duty (as entered)", "خریدار: اسٹامپ ڈیوٹی (آپ کے مطابق)")} v={formatPkr(res.stamp)} />}
          {res.cvt > 0 && <ResultRow k={L("Buyer: CVT (as entered)", "خریدار: CVT (آپ کے مطابق)")} v={formatPkr(res.cvt)} />}
          {res.fees > 0 && <ResultRow k={L("Fees (as entered)", "فیس (آپ کے مطابق)")} v={formatPkr(res.fees)} />}
          <ResultRow k={L("Buyer pays in total", "خریدار کل ادا کرے گا")} v={formatPkr(res.buyerTotal)} strong />
          <ResultRow k={L(`Seller: FBR advance tax, s.236C (${res.sellerTaxPct}% of ${formatPkr(p)})`, `فروخت کنندہ: ایف بی آر ایڈوانس ٹیکس، 236C (${formatPkr(p)} کا ${res.sellerTaxPct}%)`)} v={formatPkr(res.sellerTax)} strong />
        </dl>
        {!provincialEntered && (
          <p className="mt-3 text-sm text-amber-900">
            {L("Stamp duty and fees are not included until you enter them above.", "اسٹامپ ڈیوٹی اور فیس اوپر لکھنے تک شامل نہیں۔")}
          </p>
        )}
        {res.filerSaving > 0 && (
          <p className="mt-3 rounded-lg bg-ice px-3 py-2 text-sm font-medium text-black">
            {L(
              `As a filer, the buyer's 236K tax on this value would be ${formatPkr(res.buyerTax - res.filerSaving)}, which is ${formatPkr(res.filerSaving)} less.`,
              `فائلر ہونے کی صورت میں اس قیمت پر خریدار کا 236K ٹیکس ${formatPkr(res.buyerTax - res.filerSaving)} ہوتا، یعنی ${formatPkr(res.filerSaving)} کم۔`,
            )}
          </p>
        )}
      </section>

      <ShareBar
        className="mt-6"
        path={sharePath}
        campaign="transfer-cost"
        title={{ en: "Buying or selling with someone? Send them this estimate.", ur: "کسی کے ساتھ سودا ہے؟ یہ اندازہ انہیں بھیجیں۔" }}
        en={shareEn}
        ur={shareUr}
      />

      <section className="mt-8 space-y-3 text-sm text-muted">
        <h2 className="text-base font-bold text-black">{L("FBR rates used (Tax Year 2027)", "استعمال شدہ ایف بی آر ریٹ (ٹیکس سال 2027)")}</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-ice">
              <tr>
                <th className="px-3 py-2 text-start font-semibold">{L("Section", "سیکشن")}</th>
                <th className="px-3 py-2 text-start font-semibold">{L("Value", "قیمت")}</th>
                <th className="px-3 py-2 text-end font-semibold">{L("Filer (ATL)", "فائلر")}</th>
                <th className="px-3 py-2 text-end font-semibold">{L("Non-filer", "نان فائلر")}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums text-black">
              <tr className="border-t border-border"><td className="px-3 py-2">236K {L("buyer", "خریدار")}</td><td className="px-3 py-2">{L("up to Rs 50 million", "5 کروڑ تک")}</td><td className="px-3 py-2 text-end">1.25%</td><td className="px-3 py-2 text-end">10.5%</td></tr>
              <tr className="border-t border-border"><td className="px-3 py-2">236K {L("buyer", "خریدار")}</td><td className="px-3 py-2">{L("Rs 50–100 million", "5 سے 10 کروڑ")}</td><td className="px-3 py-2 text-end">1.25%</td><td className="px-3 py-2 text-end">14.5%</td></tr>
              <tr className="border-t border-border"><td className="px-3 py-2">236K {L("buyer", "خریدار")}</td><td className="px-3 py-2">{L("above Rs 100 million", "10 کروڑ سے زیادہ")}</td><td className="px-3 py-2 text-end">1.25%</td><td className="px-3 py-2 text-end">18.5%</td></tr>
              <tr className="border-t border-border"><td className="px-3 py-2">236C {L("seller", "فروخت کنندہ")}</td><td className="px-3 py-2">{L("any value", "کوئی بھی قیمت")}</td><td className="px-3 py-2 text-end">2.75%</td><td className="px-3 py-2 text-end">11.5%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          {L(
            "These apply to transfers from 1 July 2026 to 30 June 2027. The 236K rate is charged on the whole fair market value at the rate for its band. Some cases are exempt or taxed differently, and the Income Tax Ordinance, 2001 prevails over the rate card. Capital gains tax and other federal taxes are not included. This is an estimate, not tax advice.",
            "یہ شرحیں یکم جولائی 2026 سے 30 جون 2027 تک کے ٹرانسفر پر لاگو ہیں۔ 236K پوری فیئر مارکیٹ ویلیو پر اس کے درجے کی شرح سے لگتا ہے۔ بعض صورتوں میں چھوٹ یا الگ شرح ہوتی ہے، اور انکم ٹیکس آرڈیننس 2001 ریٹ کارڈ پر فوقیت رکھتا ہے۔ کیپیٹل گین ٹیکس اور دیگر وفاقی ٹیکس شامل نہیں۔ یہ اندازہ ہے، ٹیکس مشورہ نہیں۔",
          )}
        </p>
        <h3 className="pt-2 font-semibold text-black">{L("Sources (checked 16 Nov 2026)", "حوالہ جات (16 نومبر 2026)")}</h3>
        <ul className="list-disc space-y-1 ps-5">
          <li>
            <a className="font-semibold text-primary" href={FBR_TY2027.url} target="_blank" rel="noopener noreferrer">
              {FBR_TY2027.label}
            </a>
            {" · "}
            <a className="text-primary" href={FBR_TY2027.page} target="_blank" rel="noopener noreferrer">
              {L("FBR rate cards page", "ایف بی آر ریٹ کارڈ صفحہ")}
            </a>
          </li>
          <li>
            <a className="text-primary" href="https://e.fbr.gov.pk/ATLSearch.aspx" target="_blank" rel="noopener noreferrer">
              {L("Check Active Taxpayers List status (FBR)", "ایکٹو ٹیکس پیئر لسٹ میں نام چیک کریں (ایف بی آر)")}
            </a>
          </li>
          <li>
            {region === "punjab" ? (
              <a className="text-primary" href="https://bor.punjab.gov.pk/" target="_blank" rel="noopener noreferrer">
                {L("Board of Revenue Punjab (stamp duty and registration)", "بورڈ آف ریونیو پنجاب (اسٹامپ ڈیوٹی اور رجسٹریشن)")}
              </a>
            ) : (
              <a className="text-primary" href="https://www.cda.gov.pk/public/onlinePropertyVerification" target="_blank" rel="noopener noreferrer">
                {L("CDA online property verification", "CDA آن لائن پراپرٹی ویریفکیشن")}
              </a>
            )}
          </li>
        </ul>
      </section>

      <PostFreeCta className="mt-8" />
      <RelatedLinks links={[PAGE.rentVsBuy, PAGE.loans, PAGE.transfer, PAGE.sale, PAGE.blog]} />
    </div>
  );
}
