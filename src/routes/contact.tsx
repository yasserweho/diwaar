import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { sendContact, type ContactTopic } from "@/lib/contact.functions";
import { tx, useLang } from "@/lib/i18n";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo(
      "Contact diwaar.com",
      "Send a message to diwaar.com about a listing, a search, or your account.",
      { path: "/contact" },
    ),
  component: ContactPage,
});

const TOPICS: { id: ContactTopic; en: string; ur: string }[] = [
  { id: "listing", en: "A listing", ur: "ایک اشتہار" },
  { id: "search", en: "Search or an area", ur: "تلاش یا علاقہ" },
  { id: "account", en: "My account", ur: "میرا اکاؤنٹ" },
  { id: "other", en: "Something else", ur: "کچھ اور" },
];

function ContactPage() {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("listing");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError(tx(lang, "Enter your name.", "اپنا نام لکھیں۔"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(tx(lang, "Enter a valid email.", "درست ای میل لکھیں۔"));
      return;
    }
    if (message.trim().length < 10) {
      setError(tx(lang, "Write a message of at least 10 characters.", "کم از کم ۱۰ حروف کا پیغام لکھیں۔"));
      return;
    }
    setBusy(true);
    try {
      await sendContact({ data: { name, email, phone, topic, message } });
      setSent(true);
    } catch (err) {
      const text = err instanceof Error ? err.message : "";
      setError(
        text && text.length < 160
          ? text
          : tx(lang, "The message could not be sent. Try again.", "پیغام نہیں گیا۔ دوبارہ کوشش کریں۔"),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">diwaar.com</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">
        {tx(lang, "Contact us", "رابطہ کریں")}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {tx(
          lang,
          "Write about the site, a listing, or your account. For a property itself, use the phone or WhatsApp on that ad. Include an email if you want a reply.",
          "سائٹ، اشتہار، یا اکاؤنٹ کے بارے میں لکھیں۔ خود جائیداد کے لیے اسی اشتہار کا فون یا واٹس ایپ استعمال کریں۔ جواب اسی ای میل پر آئے گا جو آپ لکھیں گے۔",
        )}
      </p>

      {sent ? (
        <div className="mt-8 rounded-xl bg-surface p-5 shadow-card">
          <p className="font-semibold text-black">{tx(lang, "Message received.", "پیغام مل گیا۔")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {tx(lang, "Your message is saved.", "آپ کا پیغام محفوظ ہو گیا۔")}
          </p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary">
            {tx(lang, "Back to the homepage", "مرکزی صفحہ")}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label={tx(lang, "Name", "نام")}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label={tx(lang, "Email", "ای میل")}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label={tx(lang, "Phone, if you want a call", "فون، اگر کال چاہیے")}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label={tx(lang, "About", "متعلق")}>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as ContactTopic)}
              className={inputClass}
              style={inputStyle}
            >
              {TOPICS.map((item) => (
                <option key={item.id} value={item.id} style={{ color: "#000" }}>
                  {tx(lang, item.en, item.ur)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={tx(lang, "Message", "پیغام")}>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className={`${inputClass} h-auto py-3`}
              style={inputStyle}
            />
          </Field>
          {error && <p className="text-sm text-hot">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? tx(lang, "Sending…", "بھیجا جا رہا ہے…") : tx(lang, "Send message", "پیغام بھیجیں")}
          </button>
        </form>
      )}
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-black">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-border bg-white px-3 text-base text-black outline-none focus:border-primary";
const inputStyle = { color: "#000", backgroundColor: "#fff" };
