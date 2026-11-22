import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useEffect } from "react";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Init gtag
    const win = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    win.dataLayer = win.dataLayer || [];
    win.gtag = function gtag(...args: unknown[]) {
      win.dataLayer!.push(args);
    };
    win.gtag("js", new Date());
    win.gtag("config", GA_ID);
  }, []);

  return null;
}

/** Site-wide analytics: Vercel Analytics (always) + optional Google Analytics 4. */
export function SiteAnalytics() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics />
    </>
  );
}
