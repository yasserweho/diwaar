/**
 * Pure maths for the free tools on /tools/rent-vs-buy and /tools/transfer-cost.
 * Kept free of React so it can be unit-tested and reused in share text.
 */

/** Parse a typed number; commas are ignored and anything invalid is 0. */
export function num(v: string) {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function monthlyInstalment(principal: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = annualRatePct / 100 / 12;
  if (principal <= 0) return 0;
  if (i === 0) return principal / n;
  return (principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

export type RentVsBuyInput = {
  price: number;
  rent: number; // monthly rent for a comparable home today
  downPct: number;
  ratePct: number; // annual markup on the loan
  tenureYears: number;
  stayYears: number; // how long you expect to live there
  rentUpPct: number; // yearly rent increase
  growthPct: number; // yearly change in the home's value
  returnPct: number; // yearly return on money you don't spend
  buyCostPct: number; // one-off transfer / registration costs, % of price
  upkeepPct: number; // yearly maintenance, % of price
};

export type RentVsBuyYear = {
  year: number;
  rentPaid: number;
  ownerPaid: number;
  homeValue: number;
  loanLeft: number;
  buyWorth: number;
  rentWorth: number;
};

/**
 * Month-by-month comparison. Both households start with the same cash
 * (down payment + buying costs). Whoever has the lower monthly outgoing
 * invests the difference at `returnPct`. Net worth: buyer = home value −
 * loan left + buyer's savings; renter = renter's savings.
 */
export function rentVsBuy(x: RentVsBuyInput) {
  const down = (x.price * Math.min(100, Math.max(0, x.downPct))) / 100;
  const upfront = down + (x.price * Math.max(0, x.buyCostPct)) / 100;
  const principal = Math.max(0, x.price - down);
  const emi = monthlyInstalment(principal, x.ratePct, x.tenureYears);
  const loanMonths = Math.max(1, Math.round(x.tenureYears * 12));
  const i = x.ratePct / 100 / 12;
  const r = Math.pow(1 + x.returnPct / 100, 1 / 12) - 1;
  const months = Math.max(1, Math.round(x.stayYears * 12));

  let balance = principal;
  let rent = x.rent;
  let renterSavings = upfront;
  let buyerSavings = 0;
  let rentPaid = 0;
  let ownerPaid = upfront;
  let breakEvenYear: number | null = null;
  const years: RentVsBuyYear[] = [];

  for (let m = 1; m <= months; m++) {
    const homeValueStart = x.price * Math.pow(1 + x.growthPct / 100, (m - 1) / 12);
    const upkeep = (homeValueStart * Math.max(0, x.upkeepPct)) / 100 / 12;
    let pay = 0;
    if (m <= loanMonths && balance > 0) {
      const interest = balance * i;
      pay = Math.min(emi, balance + interest);
      balance = Math.max(0, balance + interest - pay);
    }
    const ownerOut = pay + upkeep;
    renterSavings *= 1 + r;
    buyerSavings *= 1 + r;
    if (ownerOut > rent) renterSavings += ownerOut - rent;
    else buyerSavings += rent - ownerOut;
    rentPaid += rent;
    ownerPaid += ownerOut;
    if (m % 12 === 0 || m === months) {
      const homeValue = x.price * Math.pow(1 + x.growthPct / 100, m / 12);
      const buyWorth = homeValue - balance + buyerSavings;
      const year = Math.ceil(m / 12);
      years.push({ year, rentPaid, ownerPaid, homeValue, loanLeft: balance, buyWorth, rentWorth: renterSavings });
      if (breakEvenYear === null && buyWorth >= renterSavings) breakEvenYear = year;
    }
    if (m % 12 === 0) rent *= 1 + x.rentUpPct / 100;
  }
  const last = years[years.length - 1];
  return { emi, down, upfront, principal, years, last, breakEvenYear };
}

/** FBR advance tax on property transfers, Tax Year 2027 (transfers 1 July 2026 to 30 June 2027). */
export const FBR_TY2027 = {
  label: "FBR Withholding Tax Rate Card, Tax Year 2027 (updated to 30 June 2026, Finance Act 2026)",
  url: "https://download1.fbr.gov.pk/Docs/202681113864992WithholdingTaxRatesCard2027.pdf",
  page: "https://www.fbr.gov.pk/withholding-taxes-rate-card/174298/174301",
  /** s.236K, buyer, % of fair market value. Non-ATL rate depends on the value band. */
  buyerPct(fmv: number, atl: boolean) {
    if (atl) return 1.25;
    if (fmv <= 50_000_000) return 10.5;
    if (fmv <= 100_000_000) return 14.5;
    return 18.5;
  },
  /** s.236C, seller, % of gross consideration. */
  sellerPct(_price: number, atl: boolean) {
    return atl ? 2.75 : 11.5;
  },
};

export type TransferInput = {
  price: number;
  fmv: number;
  buyerAtl: boolean;
  sellerAtl: boolean;
  stampPct: number;
  cvtPct: number;
  regFee: number;
  societyFee: number;
  otherFee: number;
};

export function transferCost(x: TransferInput) {
  const buyerTaxPct = FBR_TY2027.buyerPct(x.fmv, x.buyerAtl);
  const sellerTaxPct = FBR_TY2027.sellerPct(x.price, x.sellerAtl);
  const buyerTax = (x.fmv * buyerTaxPct) / 100;
  const sellerTax = (x.price * sellerTaxPct) / 100;
  // Provincial / ICT charges are worked out on the higher of the deed price and the official value.
  const base = Math.max(x.price, x.fmv);
  const stamp = (base * Math.max(0, x.stampPct)) / 100;
  const cvt = (base * Math.max(0, x.cvtPct)) / 100;
  const fees = Math.max(0, x.regFee) + Math.max(0, x.societyFee) + Math.max(0, x.otherFee);
  const provincial = stamp + cvt + fees;
  return {
    buyerTaxPct,
    sellerTaxPct,
    buyerTax,
    sellerTax,
    stamp,
    cvt,
    fees,
    provincial,
    buyerTotal: buyerTax + provincial,
    filerSaving: x.buyerAtl ? 0 : buyerTax - (x.fmv * FBR_TY2027.buyerPct(x.fmv, true)) / 100,
  };
}
