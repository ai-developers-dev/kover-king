import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useMatch,
} from "@tanstack/react-router";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import appCss from "~/styles/app.css?url";

// Analytics / verification are env-gated and no-op until set (drop in later
// with no code change). VITE_ vars are inlined at build time.
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const GSC_VERIFICATION = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" },
      // Google Search Console domain verification (no-op until VITE_GSC_VERIFICATION is set).
      ...(GSC_VERIFICATION
        ? [{ name: "google-site-verification", content: GSC_VERIFICATION }]
        : []),
      {
        name: "description",
        content:
          "Independent insurance agency in Springfield, IL. Compare auto, home, business & life insurance rates from 30+ carriers. Serving Central Illinois for over 30 years.",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Kover King Insurance Agency" },
      { name: "language", content: "en" },
      { name: "revisit-after", content: "7 days" },
      { name: "geo.region", content: "US-IL" },
      { name: "geo.placename", content: "Springfield, Illinois" },
      { name: "geo.position", content: "39.7817;-89.6501" },
      { name: "ICBM", content: "39.7817, -89.6501" },
      { name: "format-detection", content: "telephone=no" },
      { name: "theme-color", content: "#E9560C" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Kover King Insurance" },
      { property: "og:url", content: "https://koverking.com" },
      { property: "og:image", content: "https://koverking.com/og-image.png" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://koverking.com/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      // NOTE: canonical is intentionally NOT set here. Each route sets its own
      // self-referencing canonical so pages don't all inherit the homepage URL.
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap",
      },
    ],
    // GA4 — loads only when VITE_GA_ID is set; otherwise no scripts emitted.
    scripts: GA_ID
      ? [
          { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
          {
            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          },
        ]
      : [],
  }),
  component: RootComponent,
});

function RootComponent() {
  const isAdmin = useMatch({ from: "/admin_/dashboard", shouldThrow: false });
  const isPpc = useMatch({ from: "/home-ppc-form", shouldThrow: false });
  const isQuoteContinue = useMatch({ from: "/quote-continue", shouldThrow: false });
  const showChrome = !isAdmin && !isPpc && !isQuoteContinue;

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col bg-surface">
        {showChrome && <Header />}
        <main className="flex-1">
          <Outlet />
        </main>
        {showChrome && <Footer />}
        <Scripts />
      </body>
    </html>
  );
}
