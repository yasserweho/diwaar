import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { tx, useLang } from "@/lib/i18n";
import { listReviews, type PublicReview } from "@/lib/review.functions";

export function ReviewSection({ limit = 3, showLink = true }: { limit?: number; showLink?: boolean }) {
  const { lang } = useLang();
  const [items, setItems] = useState<PublicReview[] | null>(null);

  useEffect(() => {
    let live = true;
    listReviews()
      .then((rows) => {
        if (live) setItems(rows);
      })
      .catch(() => {
        if (live) setItems([]);
      });
    return () => {
      live = false;
    };
  }, []);

  const shown = (items ?? []).slice(0, limit);

  return (
    <div>
      {items === null ? (
        <p className="text-sm text-muted">{tx(lang, "Loading reviews…", "تبصرے لوڈ ہو رہے ہیں…")}</p>
      ) : shown.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted">
          {tx(
            lang,
            "No reviews yet. If you have used diwaar.com, you can leave one.",
            "ابھی کوئی تبصرہ نہیں۔ اگر آپ نے diwaar.com استعمال کی ہے تو لکھ سکتے ہیں۔",
          )}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((review) => (
            <li key={review.id} className="rounded-xl border border-border bg-white p-4">
              <Stars rating={review.rating} />
              <p className="mt-3 text-sm leading-relaxed text-black">{review.body}</p>
              <p className="mt-3 text-sm font-semibold text-black">{review.name}</p>
              {review.city && <p className="text-xs text-muted">{review.city}</p>}
            </li>
          ))}
        </ul>
      )}
      {showLink && (
        <Link to="/reviews" className="mt-4 inline-block text-sm font-semibold text-primary">
          {tx(lang, "Read and write reviews", "تبصرے پڑھیں اور لکھیں")}
        </Link>
      )}
    </div>
  );
}

export function Stars({ rating }: { rating: number }) {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className="text-sm tracking-widest text-primary" aria-label={`${n} out of 5`}>
      <span>{"●".repeat(n)}</span>
      <span className="text-border">{"●".repeat(5 - n)}</span>
    </p>
  );
}
