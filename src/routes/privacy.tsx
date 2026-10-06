import { createFileRoute, Link } from "@tanstack/react-router";
import { tx, useLang } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo(
      "Privacy policy",
      "What diwaar.com stores when you sign in, list a property, write a review, or send a message.",
      { path: "/privacy" },
    ),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    h: "Who this covers",
    hUr: "یہ کس کے لیے ہے",
    p: "This policy is for people who use diwaar.com. The site is the operator. To ask a question about your information, use the contact page. There is no separate postal address on this page.",
    pUr: "یہ پالیسی ان لوگوں کے لیے ہے جو diwaar.com استعمال کرتے ہیں۔ سائٹ خود چلانے والی ہے۔ اپنی معلومات کے بارے میں رابطے کے صفحے سے پوچھیں۔ اس صفحے پر الگ ڈاک کا پتہ نہیں۔",
  },
  {
    h: "Your account",
    hUr: "آپ کا اکاؤنٹ",
    p: "If you sign in with Gmail, diwaar.com receives the name, email address and profile photo Google sends. If you create a password on diwaar.com, that password is stored for this site only. It is not your Google password. A session cookie keeps you signed in on this browser.",
    pUr: "اگر آپ جی میل سے سائن اِن کریں تو diwaar.com وہ نام، ای میل اور تصویر لیتی ہے جو گوگل بھیجتا ہے۔ اگر آپ یہاں پاس ورڈ بنائیں تو وہ صرف اس سائٹ کے لیے محفوظ ہوتا ہے۔ یہ گوگل کا پاس ورڈ نہیں۔ سیشن کوکی اسی براؤزر پر سائن اِن رکھتی ہے۔",
  },
  {
    h: "What you publish",
    hUr: "جو آپ شائع کرتے ہیں",
    p: "A listing you post, including the price, area and photos, is shown in search. A review shows the name, city if you add one, rating and text to anyone on the site. A community post is public in the same way. Do not put a private phone number in a review if you do not want it seen. A contact-form message, with your name, email, optional phone and text, is saved for the site desk and is not published.",
    pUr: "جو اشتہار آپ لگائیں، قیمت، علاقہ اور تصاویر سمیت، تلاش میں دکھتا ہے۔ تبصرے میں نام، شہر اگر آپ لکھیں، درجہ اور تحریر ہر کسی کو نظر آتی ہے۔ کمیونٹی کی پوسٹ بھی اسی طرح کھلی ہے۔ تبصرے میں نجی فون نمبر نہ لکھیں اگر آپ نہیں چاہتے وہ نظر آئے۔ رابطے کے فارم کا پیغام، نام، ای میل، فون اگر ہو، اور تحریر، سائٹ کے ڈیسک کے لیے محفوظ ہوتا ہے اور شائع نہیں ہوتا۔",
  },
  {
    h: "Saved on this browser",
    hUr: "اس براؤزر پر محفوظ",
    p: "Saved homes, alerts, compare, language, currency and area unit stay in this browser. If you are signed in, listings, alerts, wanted ads and similar items are also saved to your account so they can load again on this site.",
    pUr: "محفوظ جائیدادیں، الرٹس، موازنہ، زبان، کرنسی اور رقبے کی اکائی اسی براؤزر میں رہتی ہیں۔ اگر آپ سائن اِن ہوں تو اشتہارات، الرٹس، مطلوب اور ملتی جلتی چیزیں اکاؤنٹ پر بھی محفوظ ہوتی ہیں تاکہ دوبارہ کھل سکیں۔",
  },
  {
    h: "Payments",
    hUr: "ادائیگی",
    p: "If you record a payment, the site stores the method you chose, such as bank transfer, JazzCash or EasyPaisa, and the account or mobile number you type, on your account. diwaar.com does not ask for a card number on this page.",
    pUr: "اگر آپ ادائیگی درج کریں تو سائٹ آپ کا چنا ہوا طریقہ، جیسے بینک ٹرانسفر، جاز کیش یا ایزی پیسہ، اور جو اکاؤنٹ یا موبائل نمبر آپ لکھیں، آپ کے اکاؤنٹ پر رکھتی ہے۔ diwaar.com اس صفحے پر کارڈ نمبر نہیں مانگتی۔",
  },
  {
    h: "What we do not do",
    hUr: "جو ہم نہیں کرتے",
    p: "diwaar.com does not sell your name, email or phone number. The site does not run an advertising network on your account. Loan figures, build-cost figures and the price index are estimates. They are not a bank offer or a valuation.",
    pUr: "diwaar.com آپ کا نام، ای میل یا فون نمبر نہیں بیچتی۔ سائٹ آپ کے اکاؤنٹ پر اشتہاری نیٹ ورک نہیں چلاتی۔ لون، تعمیراتی لاگت اور قیمت انڈیکس اندازے ہیں۔ یہ بینک کی پیشکش یا ویلیوایشن نہیں۔",
  },
  {
    h: "Removal",
    hUr: "ہٹانا",
    p: "You can remove a listing from My ads while you are signed in. To ask for a review, a contact message or an account to be removed, use the contact page and the email on that account. This policy was last updated on 6 October 2026.",
    pUr: "سائن اِن ہونے پر آپ اشتہار میرے اشتہارات سے ہٹا سکتے ہیں۔ تبصرہ، رابطے کا پیغام یا اکاؤنٹ ہٹوانے کے لیے رابطے کا صفحہ استعمال کریں اور اسی اکاؤنٹ کی ای میل لکھیں۔ یہ پالیسی آخری بار ۶ اکتوبر ۲۰۲۶ کو تازہ کی گئی۔",
  },
];

function PrivacyPage() {
  const { lang } = useLang();
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">diwaar.com</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Privacy policy", "رازداری کی پالیسی")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {tx(lang, "Last updated 6 October 2026.", "آخری تازہ کاری ۶ اکتوبر ۲۰۲۶۔")}
      </p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.h}>
            <h2 className="text-xl font-semibold text-black">{tx(lang, section.h, section.hUr)}</h2>
            <p className="mt-2 text-sm leading-relaxed">{tx(lang, section.p, section.pUr)}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm">
        <Link to="/contact" className="font-semibold text-primary">
          {tx(lang, "Contact diwaar.com", "diwaar.com سے رابطہ")}
        </Link>
      </p>
    </article>
  );
}
