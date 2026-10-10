import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DiwaarWordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    seo("Sign in to Diwaar", "Sign in to save listings, post ads and manage your Diwaar account.", {
      noindex: true,
      path: "/login",
    }),
  component: LoginPage });

function inAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|Instagram|WhatsApp|Line\/|Snapchat|LinkedInApp|Grok|Musical_ly|TikTok|WebView|; wv\)/i.test(
    navigator.userAgent,
  );
}

/** Keep post-login return paths on this site. Anything else falls back to home. */
function safeReturnPath(raw: string | null): string {
  if (!raw) return "/";
  let path = raw;
  try {
    path = decodeURIComponent(raw);
  } catch {
    return "/";
  }
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || path.includes("://")) return "/";
  if (path.startsWith("/login")) return "/";
  return path;
}

function returnPathFromLocation(): string {
  if (typeof window === "undefined") return "/";
  return safeReturnPath(new URLSearchParams(window.location.search).get("redirect"));
}

function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [embedded, setEmbedded] = useState(false);
  const [note, setNote] = useState("");
  const [opening, setOpening] = useState<"google" | "x" | null>(null);

  // Phone OTP
  const [phone, setPhone] = useState("+92");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneBusy, setPhoneBusy] = useState(false);

  const google = GROK_PROVIDERS.find((p) => p.providerId === "grok-google");
  const x = GROK_PROVIDERS.find((p) => p.providerId === "grok-x");

  function startSocial(providerId: string, which: "google" | "x", auto = false) {
    if (inAppBrowser()) {
      setNote("Open diwaar.com in Safari or Chrome. Google sign-in does not run inside this app.");
      return;
    }
    setNote("");
    setOpening(which);
    if (!auto) {
      try {
        sessionStorage.removeItem("diwaar-google-retry");
      } catch {
        /* ignore */
      }
    }
    const back = returnPathFromLocation();
    void signIn(providerId, {
      callbackURL: back,
      errorCallbackURL: back === "/" ? "/login" : `/login?redirect=${encodeURIComponent(back)}`,
    }).catch((err) => {
      setOpening(null);
      setNote(err instanceof Error ? err.message : "Could not open Google. Tap Google to try again.");
    });
  }

  useEffect(() => {
    setEmbedded(inAppBrowser());
    const params = new URLSearchParams(window.location.search);
    const code = params.getAll("error").filter(Boolean).at(-1) ?? "";
    if (!code || !google) return;
    const back = returnPathFromLocation();
    window.history.replaceState({}, "", back === "/" ? "/login" : `/login?redirect=${encodeURIComponent(back)}`);
    const cancelled = code === "access_denied";
    const retryable =
      !cancelled &&
      /state_|invalid_code|no_code|please_restart|internal_server|unable_to_get_user_info|^google$/.test(code);
    let already = false;
    try {
      already = sessionStorage.getItem("diwaar-google-retry") === "1";
      if (retryable && !already) sessionStorage.setItem("diwaar-google-retry", "1");
    } catch {
      already = true;
    }
    if (retryable && !already && !inAppBrowser()) {
      startSocial(google.providerId, "google", true);
      return;
    }
    setNote(
      cancelled
        ? "Google sign-in was closed. Tap Google to try again."
        : "Google sign-in did not finish. Tap Google to try again.",
    );
    // startSocial is stable for this mount; we only want the URL error once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const back = returnPathFromLocation();
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          name: name.trim() || "Diwaar user",
          email: email.trim(),
          password,
          callbackURL: back,
        });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: back,
        });
        if (res.error) {
          const message = res.error.message ?? "Could not sign in";
          if (/invalid email or password/i.test(message)) {
            setMode("up");
            throw new Error(
              "No Diwaar password for that Gmail yet. Create one below — it is not your Google password.",
            );
          }
          throw new Error(message);
        }
      }
      window.location.assign(back);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in");
      setBusy(false);
    }
  }

  async function sendPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = phone.trim();
    if (!cleaned.startsWith("+") || cleaned.length < 10) {
      toast.error("Enter a full number starting with + (example: +923001234567)");
      return;
    }
    setPhoneBusy(true);
    try {
      const res = await authClient.phoneNumber.sendOtp({ phoneNumber: cleaned });
      if (res.error) throw new Error(res.error.message);
      setOtpSent(true);
      toast.success("Code sent. Check your SMS.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setPhoneBusy(false);
    }
  }

  async function verifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setPhoneBusy(true);
    const back = returnPathFromLocation();
    try {
      const res = await authClient.phoneNumber.verify({
        phoneNumber: phone.trim(),
        code: otp.trim(),
      });
      if (res.error) throw new Error(res.error.message);
      window.location.assign(back);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid or expired code");
      setPhoneBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 pb-28">
      <DiwaarWordmark />
      <h1 className="mt-6 text-3xl font-extrabold text-black">
        {mode === "in" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Sign in with Google, X, phone number, or Gmail. Saved homes, ads and alerts stay on your account.
      </p>
      {embedded && (
        <p className="mt-4 rounded-xl bg-ice px-3 py-3 text-sm text-primary-dark">
          Google blocks Gmail sign-in inside WhatsApp, Instagram and in-app browsers. Open diwaar.com in Safari or Chrome, or create a password below.
        </p>
      )}
      {note && (
        <p className="mt-4 rounded-xl bg-ice px-3 py-3 text-sm text-primary-dark">{note}</p>
      )}
      {authEnabled ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {google && (
              <button
                type="button"
                disabled={opening !== null}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-black disabled:opacity-60"
                onClick={() => startSocial(google.providerId, "google")}
              >
                <GoogleLogo />
                {opening === "google" ? "Opening…" : "Google"}
              </button>
            )}
            {x && (
              <button
                type="button"
                disabled={opening !== null}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-black disabled:opacity-60"
                onClick={() => startSocial(x.providerId, "x")}
              >
                <XLogo />
                {opening === "x" ? "Opening…" : "X"}
              </button>
            )}
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Or use your phone number</p>
            {!otpSent ? (
              <form onSubmit={(e) => void sendPhoneOtp(e)} className="mt-3 space-y-3">
                <input
                  className={field}
                  type="tel"
                  required
                  autoComplete="tel"
                  aria-label="Phone number"
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button type="submit" disabled={phoneBusy} className="w-full">
                  {phoneBusy ? "Sending…" : "Send code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={(e) => void verifyPhoneOtp(e)} className="mt-3 space-y-3">
                <p className="text-sm text-muted">Enter the 6-digit code sent to {phone}</p>
                <input
                  className={field}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
                  aria-label="Verification code"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button type="submit" disabled={phoneBusy} className="w-full">
                  {phoneBusy ? "Verifying…" : "Verify and sign in"}
                </Button>
                <button
                  type="button"
                  className="text-sm font-semibold text-primary"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  Change number
                </button>
              </form>
            )}
          </div>

          <form onSubmit={(e) => void onEmail(e)} className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Or use your Gmail address</p>
            {mode === "up" && (
              <input className={field} aria-label="Name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input
              className={field}
              type="email"
              required
              autoComplete="email"
              aria-label="Email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={field}
              type="password"
              required
              minLength={8}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              aria-label={mode === "up" ? "Choose a password" : "Password"}
              placeholder={mode === "up" ? "Choose a password (8+ characters)" : "Diwaar password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Please wait" : mode === "in" ? "Sign in with Gmail address" : "Create account with Gmail"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-primary"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
          >
            {mode === "in" ? "First time? Create a password for your Gmail" : "Already created a password? Sign in"}
          </button>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted">Sign-in is turned off.</p>
      )}
      <p className="mt-6 text-sm text-muted">
        <a href="/privacy" className="font-semibold text-primary">
          Privacy policy
        </a>
      </p>
    </div>
  );
}

const field = "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-5 shrink-0" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l.1.1 6.3 5.3C37.4 38.4 44 33 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
