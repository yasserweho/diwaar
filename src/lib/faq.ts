import type { PageLink } from "@/components/related-links";

export type FaqItem = { q: string; a: string; qUr: string; aUr: string; link: PageLink };

export const FAQ: FaqItem[] = [
  {
    q: "How do I search for a property?",
    qUr: "جائیداد کیسے تلاش کروں؟",
    a: "Choose Buy or Rent, then a city, an area and a property type. Open Find. You can also start from a city or area page under Locations.",
    aUr: "خرید یا کرایہ چنیں، پھر شہر، علاقہ اور جائیداد کی قسم۔ تلاش دبائیں۔ مقامات کے صفحے سے بھی شروع کر سکتے ہیں۔",
    link: { href: "/search?purpose=buy", en: "Search property", ur: "جائیداد تلاش کریں" },
  },
  {
    q: "How do I list a property?",
    qUr: "اشتہار کیسے لگائوں؟",
    a: "Sign in, then use Add Property. Enter the city, area, price and what is actually there. You can remove the ad later from My ads.",
    aUr: "سائن اِن کریں، پھر جائیداد شامل کریں۔ شہر، علاقہ، قیمت اور جو واقعی موجود ہے وہ لکھیں۔ بعد میں میرے اشتہارات سے ہٹا سکتے ہیں۔",
    link: { href: "/add", en: "List a property", ur: "جائیداد لگائیں" },
  },
  {
    q: "Does diwaar.com charge a commission?",
    qUr: "کیا diwaar.com کمیشن لیتی ہے؟",
    a: "No. diwaar.com does not take a commission on a listing. You deal with the owner or agent named on the ad.",
    aUr: "نہیں۔ diwaar.com اشتہار پر کمیشن نہیں لیتی۔ بات اشتہار پر لکھے مالک یا ایجنٹ سے ہوتی ہے۔",
    link: { href: "/about", en: "About diwaar.com", ur: "diwaar.com کے بارے میں" },
  },
  {
    q: "Is the home loan figure a bank offer?",
    qUr: "کیا ہوم لون کا عدد بینک کی پیشکش ہے؟",
    a: "No. The calculator is an estimate. The bank sets the real rate, fees and approval.",
    aUr: "نہیں۔ کیلکولیٹر اندازہ ہے۔ اصل شرح، فیس اور منظوری بینک طے کرتا ہے۔",
    link: { href: "/tools?tab=loan", en: "Open the calculator", ur: "کیلکولیٹر کھولیں" },
  },
  {
    q: "Is the construction cost a contractor quote?",
    qUr: "کیا تعمیراتی لاگت ٹھیکیدار کا کوٹیشن ہے؟",
    a: "No. It is a guide from the covered area you enter. Get a written quote before you start building.",
    aUr: "نہیں۔ یہ آپ کے لکھے تعمیر شدہ رقبے سے رہنمائی ہے۔ تعمیر سے پہلے تحریری کوٹیشن لیں۔",
    link: { href: "/tools?tab=build", en: "Open the estimator", ur: "تخمینہ کھولیں" },
  },
  {
    q: "How do I read the site in Urdu?",
    qUr: "سائٹ اردو میں کیسے پڑھوں؟",
    a: "Use the اردو button at the top right. English is the default. The choice stays on this browser.",
    aUr: "اوپر دائیں جانب اردو کا بٹن دبائیں۔ پہلے انگریزی کھلتی ہے۔ یہ انتخاب اسی براؤزر پر رہتا ہے۔",
    link: { href: "/", en: "Homepage", ur: "مرکزی صفحہ" },
  },
  {
    q: "How do I sign in?",
    qUr: "سائن اِن کیسے کروں؟",
    a: "Use Sign in and continue with Gmail, or create a password for that Gmail address on diwaar.com. That password is not your Google password.",
    aUr: "سائن اِن سے جی میل استعمال کریں، یا اسی جی میل کے لیے diwaar.com پر پاس ورڈ بنائیں۔ یہ گوگل کا پاس ورڈ نہیں۔",
    link: { href: "/login", en: "Sign in", ur: "سائن اِن" },
  },
  {
    q: "Why did a saved search disappear?",
    qUr: "محفوظ تلاش کیوں غائب ہو گئی؟",
    a: "Alerts and saved searches stay on the browser where you saved them. They are not sent by email or SMS.",
    aUr: "الرٹ اور محفوظ تلاش اسی براؤزر پر رہتی ہیں جہاں آپ نے محفوظ کی۔ ای میل یا ایس ایم ایس نہیں جاتے۔",
    link: { href: "/alerts", en: "Your alerts", ur: "آپ کے الرٹس" },
  },
  {
    q: "How do I find a city or area?",
    qUr: "شہر یا علاقہ کیسے ملوں؟",
    a: "Open Locations, choose the city, then type the area name. Each area page has For sale and For rent.",
    aUr: "مقامات کھولیں، شہر چنیں، پھر علاقے کا نام لکھیں۔ ہر علاقے کے صفحے پر فروخت اور کرایہ ہے۔",
    link: { href: "/locations", en: "Open locations", ur: "مقامات کھولیں" },
  },
  {
    q: "Are the sale and transfer notes legal advice?",
    qUr: "کیا فروخت اور ٹرانسفر کے نوٹس قانونی مشورہ ہیں؟",
    a: "No. They are a short checklist of papers buyers in Pakistan often ask for. Confirm the current rule with the society office or a lawyer before you pay.",
    aUr: "نہیں۔ یہ وہ کاغذات ہیں جو خریدار اکثر پوچھتے ہیں۔ ادائیگی سے پہلے سوسائٹی کے دفتر یا وکیل سے تصدیق کریں۔",
    link: { href: "/services/sale-and-transfer", en: "Sale and transfer", ur: "فروخت اور ٹرانسفر" },
  },
  {
    q: "How do I contact diwaar.com?",
    qUr: "diwaar.com سے رابطہ کیسے کروں؟",
    a: "Use the Contact page and leave your email. For a property itself, use the phone or WhatsApp on that ad.",
    aUr: "رابطہ کے صفحے پر اپنی ای میل لکھیں۔ خود جائیداد کے لیے اسی اشتہار کا فون یا واٹس ایپ استعمال کریں۔",
    link: { href: "/contact", en: "Contact", ur: "رابطہ" },
  },
];
