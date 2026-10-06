import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ReviewSection, Stars } from "@/components/reviews";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { tx, useLang } from "@/lib/i18n";
import { sendReview } from "@/lib/review.functions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reviews")({
  head: () =>
    seo(
      "diwaar.com reviews",
      "Read reviews from people who used diwaar.com, or leave your own.",
      { path: "/reviews" },
    ),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError(tx(lang, "Enter your name.", "اپنا نام لکھیں۔"));
      return;
    }
    if (body.trim().length < 20) {
      setError(tx(lang, "Write at least 20 characters.", "کم از کم ۲۰ حروف لکھیں۔"));
      return;
    }
    setBusy(true);
    try {
      await sendReview({ data: { name, city, rating, body } });
      setSent(true);
      setBody("");
      setTick((n) => n + 1);
    } catch {
      setError(tx(lang, "The review could not be saved. Try again.", "تبصرہ محفوظ نہیں ہوا۔ دوبارہ کوشش کریں۔"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">diwaar.com</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">{tx(lang, "Reviews", "تبصرے")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {tx(
          lang,
          "These are written by people who used the form. diwaar.com does not invent reviews.",
          "یہ وہ لوگ لکھتے ہیں جو فارم استعمال کرتے ہیں۔ diwaar.com خود تبصرے نہیں بناتی۔",
        )}
      </p>
      <div className="mt-8" key={tick}>
        <ReviewSection limit={24} showLink={false} />
      </div>

      <h2 className="mt-12 text-xl font-semibold text-black">{tx(lang, "Write a review", "تبصرہ لکھیں")}</h2>
      {sent && (
        <p className="mt-3 text-sm font-semibold text-black">{tx(lang, "Your review is on the page.", "آپ کا تبصرہ صفحے پر آ گیا۔")}</p>
      )}
      <form onSubmit={onSubmit} className="mt-4 max-w-xl space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-black">{tx(lang, "Name", "نام")}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} style={inputStyle} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-black">{tx(lang, "City, optional", "شہر، اگر لکھنا چاہیں")}</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} style={inputStyle} />
        </label>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-black">{tx(lang, "Rating", "درجہ")}</legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="h-11 rounded-md border border-border bg-white px-3 text-sm font-semibold text-black"
                aria-pressed={rating === n}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <Stars rating={rating} />
          </div>
        </fieldset>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-black">{tx(lang, "Review", "تبصرہ")}</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className={`${inputClass} h-auto py-3`} style={inputStyle} />
        </label>
        {error && <p className="text-sm text-hot">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? tx(lang, "Saving…", "محفوظ ہو رہا ہے…") : tx(lang, "Publish review", "تبصرہ شائع کریں")}
        </button>
      </form>
      <RelatedLinks links={[PAGE.sale, PAGE.add, PAGE.about, PAGE.contact, PAGE.faq]} />
    </article>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-border bg-white px-3 text-base text-black outline-none focus:border-primary";
const inputStyle = { color: "#000", backgroundColor: "#fff" };
