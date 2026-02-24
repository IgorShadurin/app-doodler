import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Open iOS Doodler | iOS Screenshot Generator",
    template: "%s | Open iOS Doodler",
  },
  description:
    "Create App Store screenshots faster: upload templates, place labels once, preview any language, and generate grouped image sets for iPhone and iPad sizes.",
  applicationName: "Open iOS Doodler",
  keywords: [
    "iOS screenshot generator",
    "App Store screenshots",
    "localized screenshots",
    "iPhone screenshot templates",
    "iPad screenshot generator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Open iOS Doodler",
    title: "Open iOS Doodler | iOS Screenshot Generator",
    description:
      "Upload screenshot templates, bind text labels, and export localized iOS screenshot packs.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Open iOS Doodler - Localized iOS screenshot generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open iOS Doodler | iOS Screenshot Generator",
    description:
      "Generate iPhone and iPad screenshots in multiple languages from reusable templates.",
    images: ["/opengraph.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
