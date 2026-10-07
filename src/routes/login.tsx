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

function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [embedded, setEmbedded] = useState(false);
  const [googleFailed, setGoogleFailed] = useState(false);

  useEffect(() => {
    setEmbedded(inAppBrowser());
    const error = new URLSearchParams(window.location.search).get("error");
    if (!error) return;
    setGoogleFailed(true);
    setMode("up");
    toast.error("Gmail didn't finish. Create a Diwaar password for that Gmail address below.");
  }, []);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          name: name.trim() || "Diwaar user",
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
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
      window.location.assign("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in");
      setBusy(false);
    }
  }

  const google = GROK_PROVIDERS.find((p) => p.providerId === "grok-google");
  const x = GROK_PROVIDERS.find((p) => p.providerId === "grok-x");

  function startSocial(providerId: string, which: "google" | "x") {
    if (inAppBrowser()) {
      if (which === "google") {
        setGoogleFailed(true);
        setMode("up");
      }
      toast.error("Open diwaar.com in Safari or Chrome. This sign-in is blocked in this app.");
      return;
    }
    void signIn(providerId, {
      callbackURL: "/",
      errorCallbackURL: `/login?error=${which}`,
    }).catch((err) => {
      if (which === "google") setGoogleFailed(true);
      toast.error(err instanceof Error ? err.message : "Could not sign in");
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 pb-28">
      <DiwaarWordmark />
      <h1 className="mt-6 text-3xl font-extrabold text-black">
        {mode === "in" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Sign in with Google or X. Saved homes, ads and alerts stay on your account.
      </p>
      {embedded && (
        <p className="mt-4 rounded-xl bg-ice px-3 py-3 text-sm text-primary-dark">
          Google blocks Gmail sign-in inside WhatsApp, Instagram and in-app browsers. Open diwaar.com in Safari or Chrome, or create a password below.
        </p>
      )}
      {googleFailed && (
        <p className="mt-4 rounded-xl bg-hot-bg px-3 py-3 text-sm text-hot">
          Gmail sign-in did not finish. Use the same Gmail address below and choose a password for Diwaar. That password is not your Google password.
        </p>
      )}
      {authEnabled ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {google && (
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-black"
                onClick={() => startSocial(google.providerId, "google")}
              >
                <GoogleLogo />
                Google
              </button>
            )}
            {x && (
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-black"
                onClick={() => startSocial(x.providerId, "x")}
              >
                <XLogo />
                X
              </button>
            )}
          </div>
          <form onSubmit={(e) => void onEmail(e)} className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Or use your Gmail address</p>
            {mode === "up" && (
              <input className={field} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input
              className={field}
              type="email"
              required
              autoComplete="email"
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
