import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { tx, useLang } from "@/lib/i18n";
import { absoluteUrl, facebookHref, whatsappHref, withUtm, xHref } from "@/lib/share";
import { cn } from "@/lib/utils";

type Props = {
  /** Site path or absolute URL of the page being shared. */
  path: string;
  /** Prefilled message (English / Urdu). The URL is appended automatically. */
  en: string;
  ur: string;
  /** Campaign name for UTM tags, e.g. "listing", "city", "tool". */
  campaign?: string;
  /** Heading above the buttons. */
  title?: { en: string; ur: string };
  className?: string;
  compact?: boolean;
  /** Force the message and labels into one language (e.g. an Urdu article). */
  forceLang?: "en" | "ur";
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm5.8 14.05c-.24.69-1.42 1.32-1.97 1.37-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.81 2.01.88 2.15.07.15.12.32.02.51-.1.19-.14.31-.29.48-.14.17-.3.38-.43.5-.14.15-.29.3-.12.6.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.2.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.69.8 1.98.94.29.15.48.22.55.34.07.12.07.69-.17 1.37Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.55V4.63a20.8 20.8 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.17H7.9v2.94h2.55V21h3.05Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M17.75 3h3.07l-6.71 7.67L22 21h-6.18l-4.84-6.33L5.44 21H2.37l7.18-8.2L2 3h6.34l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
    </svg>
  );
}

/**
 * Share buttons built for Pakistan: WhatsApp first (chats and Status), then
 * Facebook, X, copy link and the phone's own share sheet when available.
 */
export function ShareBar({ path, en, ur, campaign = "share", title, className, compact, forceLang }: Props) {
  const { lang: siteLang } = useLang();
  const lang = forceLang ?? siteLang;
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);
  const text = tx(lang, en, ur);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copy() {
    const link = withUtm(url, "copy", campaign);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success(tx(lang, "Link copied", "لنک کاپی ہو گیا"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(tx(lang, "Could not copy. Long-press the address bar instead.", "کاپی نہیں ہو سکا۔ ایڈریس بار سے لنک کاپی کریں۔"));
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: text, text, url: withUtm(url, "native", campaign) });
    } catch {
      /* user closed the sheet */
    }
  }

  const btn =
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-black hover:border-primary";

  return (
    <section className={cn("rounded-2xl bg-surface p-4 shadow-card", className)} aria-label={tx(lang, "Share", "شیئر کریں")}>
      {!compact && (
        <p className="mb-3 text-sm font-semibold text-black">
          {title ? tx(lang, title.en, title.ur) : tx(lang, "Share this page", "یہ صفحہ شیئر کریں")}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappHref(text, withUtm(url, "whatsapp", campaign))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1f9d55] px-4 text-sm font-semibold text-white hover:bg-[#178a49]"
        >
          <WhatsAppIcon />
          {tx(lang, "Share on WhatsApp", "واٹس ایپ پر بھیجیں")}
        </a>
        <a
          href={facebookHref(withUtm(url, "facebook", campaign))}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          aria-label={tx(lang, "Share on Facebook", "فیس بک پر شیئر کریں")}
        >
          <FacebookIcon />
          <span className="hidden sm:inline">Facebook</span>
        </a>
        <a
          href={xHref(text, withUtm(url, "x", campaign))}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
          aria-label={tx(lang, "Share on X", "ایکس پر شیئر کریں")}
        >
          <XIcon />
          <span className="hidden sm:inline">X</span>
        </a>
        <button type="button" onClick={() => void copy()} className={btn}>
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {tx(lang, "Copy link", "لنک کاپی کریں")}
        </button>
        {canNativeShare && (
          <button type="button" onClick={() => void nativeShare()} className={cn(btn, "sm:hidden")} aria-label={tx(lang, "More ways to share", "مزید طریقے")}>
            <Share2 className="size-4" />
          </button>
        )}
      </div>
    </section>
  );
}
