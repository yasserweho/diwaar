import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DiwaarWordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GROK_PROVIDERS, authClient, authEnabled } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: LoginPage });

function inAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|Instagram|WhatsApp|Line\/|Snapchat|LinkedInApp/i.test(navigator.userAgent);
}

function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(inAppBrowser());
    const error = new URLSearchParams(window.location.search).get("error");
    if (!error) return;
    toast.error("Sign-in didn't finish. Try again in Chrome or Safari, or use email.");
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
        if (res.error) throw new Error(res.error.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 pb-28">
      <DiwaarWordmark />
      <h1 className="mt-6 text-3xl font-extrabold text-primary-dark">
        {mode === "in" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Saved homes, ads, alerts, payments and loan files stay on your account, not just this browser.
      </p>
      {embedded && (
        <p className="mt-4 rounded-xl bg-ice px-3 py-3 text-sm text-primary-dark">
          Google and X are blocked inside WhatsApp, Facebook and Instagram. Open diwaar.com in Chrome or Safari, or sign in with email below.
        </p>
      )}
      {authEnabled ? (
        <>
          <form onSubmit={(e) => void onEmail(e)} className="mt-6 space-y-3">
            {mode === "up" && (
              <input className={field} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className={field} type="email" required placeholder="Gmail or email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={field} type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Please wait" : mode === "in" ? "Sign in with email" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted">
            Use your Gmail address and a password. The Google button cannot return to www.diwaar.com, which is the “Invalid redirect URI” error.
          </p>
          <div className="mt-3 grid gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                variant="outline"
                onClick={() => {
                  toast.error("Google and X can’t return to www.diwaar.com yet. Sign in with your Gmail address and a password instead.");
                }}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-primary"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
          >
            {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted">Sign-in is turned off.</p>
      )}
    </div>
  );
}

const field = "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
