import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/shell";
import { SiteSchema } from "@/components/site-schema";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Diwaar.com — Pakistan's Property Portal";
const SITE = "https://www.diwaar.com";
const DESC =
  "Find houses, flats, plots and commercial property for sale and rent across Pakistan on diwaar.com. Quality listings in Lahore, Karachi, Islamabad and 30+ cities.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0B4A8C" },
      { name: "description", content: DESC },
      { property: "og:site_name", content: "Diwaar.com" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: DESC },
      { property: "og:url", content: SITE },
      { property: "og:image", content: `${SITE}/og.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: APP_NAME },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: `${SITE}/og.jpg` },
      { itemprop: "name", content: APP_NAME },
      { itemprop: "description", content: DESC },
      { itemprop: "image", content: `${SITE}/og.jpg` },
      { itemprop: "url", content: SITE },
      { name: "robots", content: "max-image-preview:large" },
      {
        name: "facebook-domain-verification",
        content: "rp8zx3y7s3oc8as8150t5jni89p6u0",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "sitemap", href: "/sitemap.xml" },
      { rel: "canonical", href: SITE },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <link
          id="diwaar-fonts"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var l=document.getElementById('diwaar-fonts');if(l){var a=function(){l.media='all'};l.onload=a;if(l.sheet)a();}",
          }}
        />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Shell>
            <Outlet />
          </Shell>
          <Toaster position="top-center" richColors />
          <Analytics />
          <SiteSchema />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
