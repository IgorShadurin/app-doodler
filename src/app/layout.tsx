import type { Metadata } from "next";
import { JetBrains_Mono, League_Spartan, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_TITLE = "App Doodler | Localized App Store Screenshot Generator";
const SITE_DESCRIPTION =
  "Create localized iOS App Store screenshots in minutes: upload templates, place labels once, preview every language, and export PNG shot packs grouped by locale.";

const verificationOther: Record<string, string> = {};
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther["msvalidate.01"] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
}
if (process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION) {
  verificationOther["p:domain_verify"] = process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION;
}
if (process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION) {
  verificationOther["facebook-domain-verification"] = process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION;
}
if (process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION) {
  verificationOther["naver-site-verification"] = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: "%s | App Doodler",
  },
  description: SITE_DESCRIPTION,
  applicationName: "App Doodler",
  category: "productivity",
  creator: "App Doodler",
  publisher: "App Doodler",
  referrer: "origin-when-cross-origin",
  keywords: [
    "App Doodler",
    "iOS screenshot generator",
    "App Store screenshots",
    "App Store screenshot generator",
    "localized screenshots",
    "App Store localization",
    "iPhone screenshot templates",
    "iPad screenshot generator",
    "localized app screenshots",
    "screenshot translation tool",
    "multilingual screenshot editor",
    "ASO screenshot generator",
    "app store assets",
    "iOS marketing screenshots",
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
    other: Object.keys(verificationOther).length > 0 ? verificationOther : undefined,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: "App Doodler",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "App Doodler - Localized App Store screenshot generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: process.env.NEXT_PUBLIC_TWITTER_SITE || undefined,
    creator: process.env.NEXT_PUBLIC_TWITTER_CREATOR || undefined,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph.png"],
  },
  other: {
    "format-detection": "telephone=no",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${leagueSpartan.variable} antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
