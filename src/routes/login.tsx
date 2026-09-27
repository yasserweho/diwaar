import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DiwaarWordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: LoginPage });

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

  const gmail = GROK_PROVIDERS.find((p) => p.providerId === "grok-google");
  const others = GROK_PROVIDERS.filter((p) => p.providerId !== "grok-google");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 pb-28">
      <DiwaarWordmark />
      <h1 className="mt-6 text-3xl font-extrabold text-primary-dark">
        {mode === "in" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Use your Gmail. Saved homes, ads and alerts stay on your account.
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
          <div className="mt-6 grid gap-2">
            {gmail && (
              <Button
                variant="primary"
                className="h-12 w-full"
                onClick={() => {
                  if (inAppBrowser()) {
                    setGoogleFailed(true);
                    setMode("up");
                    toast.error("Open diwaar.com in Safari or Chrome to use Gmail, or create a password below.");
                    return;
                  }
                  void signIn(gmail.providerId, {
                    callbackURL: "/",
                    errorCallbackURL: "/login?error=google",
                  }).catch((err) => {
                    setGoogleFailed(true);
                    toast.error(err instanceof Error ? err.message : "Could not sign in with Gmail");
                  });
                }}
              >
                Continue with Gmail
              </Button>
            )}
            {others.map((p) => (
              <Button
                key={p.providerId}
                variant="outline"
                onClick={() => {
                  if (inAppBrowser()) {
                    toast.error("Open diwaar.com in Safari or Chrome. This sign-in is blocked in this app.");
                    return;
                  }
                  void signIn(p.providerId, {
                    callbackURL: "/",
                    errorCallbackURL: "/login?error=google",
                  }).catch((err) => {
                    toast.error(err instanceof Error ? err.message : "Could not sign in");
                  });
                }}
              >
                Continue with {p.label}
              </Button>
            ))}
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
    </div>
  );
}

const field = "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
