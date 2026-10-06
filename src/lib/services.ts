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
  {
    slug: "houses-for-sale",
    title: "Houses for sale",
    titleUr: "مکان فروخت",
    summary: "Search houses by city, area, beds and price.",
    summaryUr: "شہر، علاقہ، بیڈ اور قیمت کے حساب سے مکان تلاش کریں۔",
    description: "Search houses for sale in Pakistan by city, area, beds and price on diwaar.com.",
    points: [
      "Open search and leave the type on House.",
      "Narrow it with city, area and price.",
      "Save a house to compare it with two others.",
    ],
    pointsUr: [
      "تلاش کھولیں اور قسم مکان رکھیں۔",
      "شہر، علاقہ اور قیمت سے محدود کریں۔",
      "مکان محفوظ کر کے دو دیگر سے موازنہ کر سکتے ہیں۔",
    ],
    cta: { href: "/search?purpose=buy&type=house", label: "Search houses", labelUr: "مکان تلاش کریں" },
    also: { href: "/compare", label: "Compare", labelUr: "موازنہ" },
  },
  {
    slug: "plots-for-sale",
    title: "Plots for sale",
    titleUr: "پلاٹ فروخت",
    summary: "Search residential plots by city and society, then check the map.",
    summaryUr: "شہر اور سوسائٹی کے حساب سے پلاٹ تلاش کریں، پھر نقشہ دیکھیں۔",
    description: "Search plots for sale in Pakistan and open the society map on diwaar.com.",
    points: [
      "Filter search to Plot.",
      "Use the area name of the society, such as DHA or Bahria.",
      "Confirm the file with the society before you pay a token.",
    ],
    pointsUr: [
      "تلاش میں پلاٹ چنیں۔",
      "سوسائٹی کا نام لکھیں، جیسے ڈی ایچ اے یا بحریہ۔",
      "ٹوکن سے پہلے سوسائٹی سے فائل کی تصدیق کریں۔",
    ],
    cta: { href: "/search?purpose=buy&type=plot", label: "Search plots", labelUr: "پلاٹ تلاش کریں" },
    also: { href: "/maps", label: "Plot maps", labelUr: "نقشے" },
  },
  {
    slug: "flats-for-sale",
    title: "Flats for sale",
    titleUr: "فلیٹ فروخت",
    summary: "Search apartments by city, beds and price.",
    summaryUr: "شہر، بیڈ اور قیمت کے حساب سے فلیٹ تلاش کریں۔",
    description: "Search flats and apartments for sale in Pakistan on diwaar.com.",
    points: [
      "Filter search to Flat.",
      "Check beds, covered area and the floor if the listing says it.",
      "Ask the seller who holds the title and whether society dues are clear.",
    ],
    pointsUr: [
      "تلاش میں فلیٹ چنیں۔",
      "بیڈ، رقبہ اور منزل دیکھیں اگر اشتہار میں لکھی ہو۔",
      "بیچنے والے سے پوچھیں نام کس کے پاس ہے اور سوسائٹی کے بقایا جات صاف ہیں یا نہیں۔",
    ],
    cta: { href: "/search?purpose=buy&type=flat", label: "Search flats", labelUr: "فلیٹ تلاش کریں" },
  },
  {
    slug: "commercial-property",
    title: "Commercial property",
    titleUr: "کمرشل جائیداد",
    summary: "Search shops, offices and other commercial space for sale or rent.",
    summaryUr: "دکان، دفتر اور دیگر کمرشل جگہ فروخت یا کرایے کے لیے تلاش کریں۔",
    description: "Search shops, offices and commercial property for sale or rent in Pakistan on diwaar.com.",
    points: [
      "Filter search to Commercial.",
      "Switch to Rent if you need a shop or office on rent.",
      "List a commercial unit the same way as a house.",
    ],
    pointsUr: [
      "تلاش میں کمرشل چنیں۔",
      "کرایے کی دکان یا دفتر کے لیے کرایہ چنیں۔",
      "کمرشل یونٹ مکان کی طرح اشتہار لگایا جا سکتا ہے۔",
    ],
    cta: { href: "/search?purpose=buy&type=commercial", label: "Search commercial", labelUr: "کمرشل تلاش کریں" },
    also: { href: "/search?purpose=rent&type=commercial", label: "Commercial rent", labelUr: "کمرشل کرایہ" },
  },
  {
    slug: "portions",
    title: "Portions",
    titleUr: "پورشن",
    summary: "Search upper and lower portions, mostly for rent.",
    summaryUr: "بالائی اور زیریں پورشن تلاش کریں، زیادہ تر کرایے کے لیے۔",
    description: "Search portions for rent or sale in Pakistan on diwaar.com.",
    points: [
      "Filter search to Portion.",
      "Most portion ads are rentals. Switch purpose if you need a sale.",
      "Ask which floor, who pays the utilities, and whether the entrance is separate.",
    ],
    pointsUr: [
      "تلاش میں پورشن چنیں۔",
      "زیادہ تر پورشن کرایے کے ہیں۔ فروخت چاہیے تو مقصد بدلیں۔",
      "پوچھیں کون سی منزل، بل کون دے گا، اور داخلہ الگ ہے یا نہیں۔",
    ],
    cta: { href: "/search?purpose=rent&type=portion", label: "Search portions", labelUr: "پورشن تلاش کریں" },
  },
  {
    slug: "farm-houses",
    title: "Farm houses",
    titleUr: "فارم ہاؤس",
    summary: "Search farm houses on the edge of the city.",
    summaryUr: "شہر کے کنارے فارم ہاؤس تلاش کریں۔",
    description: "Search farm houses for sale in Pakistan on diwaar.com.",
    points: [
      "Filter search to Farm House.",
      "Check the land size in kanal or acre, not only the covered area.",
      "Ask about the approach road, water and whether the land is residential or agricultural.",
    ],
    pointsUr: [
      "تلاش میں فارم ہاؤس چنیں۔",
      "رقبہ کنال یا ایکڑ میں دیکھیں، صرف تعمیر شدہ رقبہ نہیں۔",
      "سڑک، پانی، اور زمین رہائشی ہے یا زرعی، یہ پوچھیں۔",
    ],
    cta: { href: "/search?purpose=buy&type=farmhouse", label: "Search farm houses", labelUr: "فارم ہاؤس تلاش کریں" },
  },
  {
    slug: "new-projects",
    title: "New projects",
    titleUr: "نئے منصوبے",
    summary: "See launching and under-construction societies, with the status written on the page.",
    summaryUr: "لانچنگ اور زیر تعمیر سوسائٹیاں دیکھیں، حیثیت صفحے پر لکھی ہوتی ہے۔",
    description: "Browse new housing projects and societies in Pakistan on diwaar.com.",
    points: [
      "Each project page names the developer, city and status.",
      "A launch is not the same as a developed sector. Read the status before you book.",
      "Payment plans on a page are what was published, not a promise from diwaar.com.",
    ],
    pointsUr: [
      "ہر منصوبے پر ڈویلپر، شہر اور حیثیت لکھی ہے۔",
      "لانچ اور تیار سیکٹر ایک نہیں۔ بکنگ سے پہلے حیثیت پڑھیں۔",
      "ادائیگی کا منصوبہ وہ ہے جو شائع ہوا، دیوار کا وعدہ نہیں۔",
    ],
    cta: { href: "/projects", label: "See projects", labelUr: "منصوبے دیکھیں" },
  },
  {
    slug: "construction-cost",
    title: "Construction cost",
    titleUr: "تعمیراتی لاگت",
    summary: "Estimate grey structure and finishing from covered area. It is a guide, not a contractor quote.",
    summaryUr: "تعمیر شدہ رقبے سے گرے سٹرکچر اور فنشنگ کا اندازہ۔ یہ ٹھیکیدار کا کوٹیشن نہیں۔",
    description:
      "Estimate grey-structure and finishing cost for a house in Pakistan on diwaar.com. Not a contractor quotation.",
    points: [
      "Enter the covered area.",
      "The split is grey structure and finishing.",
      "Rates move with steel, cement and the finish you choose. Get a written quote before you start.",
    ],
    pointsUr: [
      "تعمیر شدہ رقبہ لکھیں۔",
      "تقسیم گرے سٹرکچر اور فنشنگ میں ہے۔",
      "شرح سٹیل، سیمنٹ اور فنش کے ساتھ بدلتی ہے۔ شروع سے پہلے تحریری کوٹیشن لیں۔",
    ],
    cta: { href: "/tools?tab=build", label: "Open the estimator", labelUr: "تخمینہ کھولیں" },
  },
  {
    slug: "area-converter",
    title: "Area converter",
    titleUr: "رقبہ کنورٹر",
    summary: "Convert marla, kanal, square feet and square yards.",
    summaryUr: "مرلہ، کنال، مربع فٹ اور مربع گز بدل لیں۔",
    description: "Convert marla, kanal, square feet and square yards on diwaar.com.",
    points: [
      "Pakistan uses more than one marla. A 225 square foot marla and a 272 square foot marla are both in use.",
      "The converter shows the unit you pick.",
      "Match the unit to the society’s own documents before you agree a price per marla.",
    ],
    pointsUr: [
      "پاکستان میں ایک سے زیادہ مرلہ رائج ہیں۔ ۲۲۵ اور ۲۷۲ مربع فٹ دونوں استعمال ہوتے ہیں۔",
      "کنورٹر وہ یونٹ دکھاتا ہے جو آپ چنیں۔",
      "فی مرلہ قیمت سے پہلے سوسائٹی کے کاغذات والا یونٹ ملائیں۔",
    ],
    cta: { href: "/tools?tab=area", label: "Open the converter", labelUr: "کنورٹر کھولیں" },
  },
  {
    slug: "compare-homes",
    title: "Compare homes",
    titleUr: "مکانوں کا موازنہ",
    summary: "Put up to three listings side by side: price, size, beds and location.",
    summaryUr: "تین تک اشتہار ساتھ رکھیں: قیمت، رقبہ، بیڈ اور جگہ۔",
    description: "Compare up to three property listings side by side on diwaar.com.",
    points: [
      "Add a listing to compare from its page.",
      "You can hold three at a time.",
      "The table uses the price and size written on each ad.",
    ],
    pointsUr: [
      "اشتہار کے صفحے سے موازنہ میں شامل کریں۔",
      "ایک وقت میں تین رکھ سکتے ہیں۔",
      "جدول وہ قیمت اور رقبہ دکھاتا ہے جو اشتہار پر لکھا ہے۔",
    ],
    cta: { href: "/compare", label: "Open compare", labelUr: "موازنہ کھولیں" },
    also: { href: "/saved", label: "Saved homes", labelUr: "محفوظ جائیدادیں" },
  },
  {
    slug: "price-alerts",
    title: "Price alerts",
    titleUr: "قیمت الرٹ",
    summary: "Save a search on this device and open the same filters again.",
    summaryUr: "تلاش اس ڈیوائس پر محفوظ کریں اور وہی فلٹر دوبارہ کھولیں۔",
    description: "Save a property search on diwaar.com and open the same city, type and price filters again.",
    points: [
      "Run a search, then save it.",
      "Alerts stay on this browser. They are not an email or SMS service.",
      "Open the saved search any time from Alerts.",
    ],
    pointsUr: [
      "تلاش چلائیں، پھر محفوظ کریں۔",
      "الرٹ اسی براؤزر پر رہتے ہیں۔ یہ ای میل یا ایس ایم ایس سروس نہیں۔",
      "محفوظ تلاش الرٹس سے دوبارہ کھولیں۔",
    ],
    cta: { href: "/alerts", label: "Your alerts", labelUr: "آپ کے الرٹس" },
    also: { href: "/search?purpose=buy", label: "Start a search", labelUr: "تلاش شروع کریں" },
  },
  {
    slug: "property-investment",
    title: "Property investment",
    titleUr: "جائیداد میں سرمایہ",
    summary: "Read published blocks and yields. These are not an offer to sell you a share.",
    summaryUr: "شائع شدہ بلاکس اور منافع پڑھیں۔ یہ حصہ بیچنے کی پیشکش نہیں۔",
    description:
      "Read property investment notes for Pakistan on diwaar.com. Figures are published examples, not an offer of shares.",
    points: [
      "Each note shows a ticket size, term and a stated yield.",
      "Diwaar is not selling those shares and is not a broker for them.",
      "Check the developer and the title yourself before you send money.",
    ],
    pointsUr: [
      "ہر نوٹ میں رقم، مدت اور لکھا ہوا منافع ہے۔",
      "دیوار یہ حصص نہیں بیچتی اور ان کا بروکر نہیں۔",
      "رقم بھیجنے سے پہلے ڈویلپر اور نام خود چیک کریں۔",
    ],
    cta: { href: "/invest", label: "Read investment notes", labelUr: "سرمایہ نوٹس" },
    also: { href: "/trends", label: "Price trends", labelUr: "رجحانات" },
  },
  {
    slug: "market-questions",
    title: "Market questions",
    titleUr: "مارکیٹ کے سوال",
    summary: "Ask about a society, a file or a transfer, and read what others already asked.",
    summaryUr: "سوسائٹی، فائل یا ٹرانسفر کے بارے میں پوچھیں، اور پہلے پوچھے گئے سوال پڑھیں۔",
    description: "Ask and read Pakistan property questions on the diwaar.com community board.",
    points: [
      "Post a question with the city.",
      "Answers are from other people on the board, not from diwaar.com staff.",
      "Do not send token money because of a forum reply.",
    ],
    pointsUr: [
      "شہر کے ساتھ سوال لکھیں۔",
      "جواب بورڈ کے دوسرے لوگوں کے ہیں، دیوار کے عملے کے نہیں۔",
      "فورم کے جواب پر ٹوکن کی رقم نہ بھیجیں۔",
    ],
    cta: { href: "/community", label: "Open the board", labelUr: "بورڈ کھولیں" },
  },
];

export function serviceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
