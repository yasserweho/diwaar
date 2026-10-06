export type Service = {
  slug: string;
  title: string;
  titleUr: string;
  summary: string;
  summaryUr: string;
  description: string;
  points: string[];
  pointsUr: string[];
  cta: { href: string; label: string; labelUr: string };
  also?: { href: string; label: string; labelUr: string };
};

export const SERVICES: Service[] = [
  {
    slug: "list-a-property",
    title: "List a property",
    titleUr: "جائیداد کا اشتہار",
    summary: "Post a house, flat, plot or shop for sale or rent. The ad stays on your account.",
    summaryUr: "مکان، فلیٹ، پلاٹ یا دکان فروخت یا کرایے کے لیے لگائیں۔ اشتہار آپ کے اکاؤنٹ پر رہتا ہے۔",
    description:
      "List a house, flat, plot or commercial property for sale or rent on diwaar.com. Add the city, area, price and photos.",
    points: [
      "Choose buy or rent, then the city and area.",
      "Add the price, size and a short description of what is actually there.",
      "The listing appears in search for that city. You can remove it from My ads.",
    ],
    pointsUr: [
      "خرید یا کرایہ چنیں، پھر شہر اور علاقہ۔",
      "قیمت، رقبہ اور مختصر تفصیل لکھیں جو واقعی موجود ہو۔",
      "اشتہار اسی شہر کی تلاش میں آتا ہے۔ میرے اشتہارات سے ہٹا سکتے ہیں۔",
    ],
    cta: { href: "/add", label: "Post your ad", labelUr: "اشتہار لگائیں" },
    also: { href: "/my-ads", label: "My ads", labelUr: "میرے اشتہارات" },
  },
  {
    slug: "rent-a-home",
    title: "Rent a home",
    titleUr: "گھر کرایے پر",
    summary: "Landlords can post a rental. Tenants can search rentals or post what they need.",
    summaryUr: "مالک کرایے کا اشتہار لگائیں۔ کرایہ دار تلاش کر سکتا ہے یا اپنی ضرورت لکھ سکتا ہے۔",
    description:
      "Rent a house, flat or portion in Pakistan, or list a property for rent on diwaar.com.",
    points: [
      "Search rentals by city and area.",
      "Owners post a rent listing the same way as a sale, and choose Rent.",
      "If you cannot find the right place, post a wanted ad with your budget.",
    ],
    pointsUr: [
      "شہر اور علاقے کے حساب سے کرایہ تلاش کریں۔",
      "مالک فروخت کی طرح اشتہار لگائے اور کرایہ چنے۔",
      "صحیح جگہ نہ ملے تو بجٹ کے ساتھ مطلوب اشتہار لگائیں۔",
    ],
    cta: { href: "/search?purpose=rent", label: "Search rentals", labelUr: "کرایہ تلاش کریں" },
    also: { href: "/wanted", label: "Post a wanted ad", labelUr: "مطلوب اشتہار" },
  },
  {
    slug: "home-loans",
    title: "Home loans",
    titleUr: "ہوم لون",
    summary: "Estimate a monthly instalment before you talk to a bank. This is a calculator, not a loan offer.",
    summaryUr: "بینک سے بات سے پہلے ماہانہ قسط کا اندازہ لگائیں۔ یہ کیلکولیٹر ہے، لون کی پیشکش نہیں۔",
    description:
      "Estimate a Pakistan home-loan instalment on diwaar.com. Compare the monthly amount before you apply at a bank.",
    points: [
      "Enter the price, down payment, rate and years.",
      "The result is an estimate. The bank sets the real rate, charges and approval.",
      "Save a loan file on your account if you want to keep the numbers.",
    ],
    pointsUr: [
      "قیمت، ڈاؤن پیمنٹ، شرح اور سال لکھیں۔",
      "نتیجہ اندازہ ہے۔ اصل شرح، چارجز اور منظوری بینک طے کرتا ہے۔",
      "اعداد اپنے اکاؤنٹ کی لون فائل میں رکھ سکتے ہیں۔",
    ],
    cta: { href: "/tools?tab=loan", label: "Open the calculator", labelUr: "کیلکولیٹر کھولیں" },
    also: { href: "/loans", label: "Loan files", labelUr: "لون فائلیں" },
  },
  {
    slug: "price-check",
    title: "Price check",
    titleUr: "قیمت چیک",
    summary: "See how asking prices have moved by city and society before you make an offer.",
    summaryUr: "پیشکش سے پہلے دیکھیں شہر اور سوسائٹی میں مانگی گئی قیمتیں کیسے بدلیں۔",
    description:
      "Check asking-price trends and area guides for houses and plots in Pakistan on diwaar.com. This is not a certified valuation.",
    points: [
      "Open the price index for a city or society.",
      "Read the area guide for streets, plot sizes and what buyers usually ask.",
      "Diwaar does not issue a valuation certificate. Use these pages to compare asking prices only.",
    ],
    pointsUr: [
      "شہر یا سوسائٹی کا قیمت انڈیکس کھولیں۔",
      "علاقائی گائیڈ میں سڑکیں، پلاٹ سائز اور عام مانگ دیکھیں۔",
      "دیوار قیمت کا سرٹیفکیٹ نہیں دیتی۔ یہ صرف مانگی گئی قیمتوں کا موازنہ ہے۔",
    ],
    cta: { href: "/property-index", label: "Open the price index", labelUr: "قیمت انڈیکس" },
    also: { href: "/guides", label: "Area guides", labelUr: "علاقائی گائیڈ" },
  },
  {
    slug: "sale-and-transfer",
    title: "Sale and transfer",
    titleUr: "فروخت اور ٹرانسفر",
    summary: "A short checklist of papers buyers in Pakistan usually ask for. This is not legal advice.",
    summaryUr: "وہ کاغذات جو پاکستان میں خریدار عام طور پر مانگتے ہیں۔ یہ قانونی مشورہ نہیں۔",
    description:
      "A buyer checklist for property sale and transfer in Pakistan: token, agreement, society NOC and mutation. Not legal advice.",
    points: [
      "Ask who is on the title, and whether the society or revenue record matches the seller.",
      "Typical papers include a sale agreement, stamp duty receipt, society NOC or transfer letter, and mutation or intiqal where that applies.",
      "Rules differ by housing society, cantonment and province. Confirm the current requirement with the society office or a lawyer before you pay.",
    ],
    pointsUr: [
      "پوچھیں نام کس کے نام ہے، اور سوسائٹی یا مال کا ریکارڈ بیچنے والے سے ملتا ہے یا نہیں۔",
      "عام کاغذات میں بیع نامہ، اسٹامپ ڈیوٹی، سوسائٹی این او سی یا ٹرانسفر لیٹر، اور جہاں لگے انتقال شامل ہیں۔",
      "قاعدے سوسائٹی، چھاؤنی اور صوبے کے حساب سے بدلتے ہیں۔ ادائیگی سے پہلے دفتر یا وکیل سے تصدیق کریں۔",
    ],
    cta: { href: "/guides", label: "Read area guides", labelUr: "علاقائی گائیڈ" },
    also: { href: "/community", label: "Ask the community", labelUr: "کمیونٹی سے پوچھیں" },
  },
  {
    slug: "find-an-agent",
    title: "Find an agent",
    titleUr: "ایجنٹ تلاش",
    summary: "Look up agents and agencies by city, then open the listings they have actually posted.",
    summaryUr: "شہر کے حساب سے ایجنٹ اور ایجنسی دیکھیں، پھر وہ اشتہارات کھولیں جو انہوں نے لگائے ہیں۔",
    description:
      "Find property agents and agencies in Lahore, Karachi, Islamabad and other cities on diwaar.com.",
    points: [
      "Each agent page shows the city, agency and the listings on their desk.",
      "Agencies are grouped so you can see more than one person at the same office.",
      "Diwaar does not take a commission on these pages. You deal with the agent directly.",
    ],
    pointsUr: [
      "ایجنٹ کے صفحے پر شہر، ایجنسی اور ان کے اشتہارات ہیں۔",
      "ایجنسیاں اکٹھی ہیں تاکہ ایک دفتر کے مزید لوگ نظر آئیں۔",
      "دیوار ان صفحات پر کمیشن نہیں لیتی۔ بات براہ راست ایجنٹ سے ہوتی ہے۔",
    ],
    cta: { href: "/agents", label: "Browse agents", labelUr: "ایجنٹس دیکھیں" },
    also: { href: "/agencies", label: "Browse agencies", labelUr: "ایجنسیاں دیکھیں" },
  },
  {
    slug: "plot-maps",
    title: "Plot maps",
    titleUr: "پلاٹ کے نقشے",
    summary: "Open a society map, pick a block, and see which plots are marked open.",
    summaryUr: "سوسائٹی کا نقشہ کھولیں، بلاک چنیں، اور دیکھیں کون سے پلاٹ کھلے دکھائے گئے ہیں۔",
    description:
      "Browse society plot maps on diwaar.com and see which plots are marked open, on token, or sold.",
    points: [
      "Choose a society, then a plot on the map.",
      "Status is a guide for that map. Confirm the file with the society before you pay a token.",
      "Match an open plot to listings in the same area when a listing exists.",
    ],
    pointsUr: [
      "سوسائٹی چنیں، پھر نقشے پر پلاٹ۔",
      "حیثیت اس نقشے کی رہنمائی ہے۔ ٹوکن سے پہلے سوسائٹی سے فائل کی تصدیق کریں۔",
      "کھلا پلاٹ اسی علاقے کے اشتہار سے ملایا جا سکتا ہے، اگر اشتہار موجود ہو۔",
    ],
    cta: { href: "/maps", label: "Open plot maps", labelUr: "نقشے کھولیں" },
  },
  {
    slug: "buyer-requests",
    title: "Buyer requests",
    titleUr: "خریدار کی درخواست",
    summary: "Post the property you want, with a budget, so agents can match it.",
    summaryUr: "جو جائیداد چاہیے وہ بجٹ کے ساتھ لکھیں، تاکہ ایجنٹ ملا سکیں۔",
    description:
      "Post a wanted ad for a house, plot or flat in Pakistan. Agents on diwaar.com can reply from search.",
    points: [
      "Say the city, type and budget.",
      "Agents see the request on the wanted board.",
      "You can still search listings yourself while the request is up.",
    ],
    pointsUr: [
      "شہر، قسم اور بجٹ لکھیں۔",
      "ایجنٹ مطلوب بورڈ پر درخواست دیکھتے ہیں۔",
      "درخواست کے دوران خود بھی اشتہارات تلاش کر سکتے ہیں۔",
    ],
    cta: { href: "/wanted", label: "See buyer requests", labelUr: "درخواستیں دیکھیں" },
  },
];

export function serviceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
