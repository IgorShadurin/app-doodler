import type { Metadata } from "next";

import { IosDoodlerStudio } from "@/features/ios-doodler/IosDoodlerStudio";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const GITHUB_REPO_URL = "https://github.com/IgorShadurin/ios-doodler";
const TITLE = "Localized App Store Screenshot Generator for iOS Apps";
const DESCRIPTION =
  "Create localized iOS App Store screenshots in minutes: upload templates, place labels once, preview every language, and export PNG shot packs grouped by locale.";
const KEYWORDS = [
  "iOS Doodler",
  "app store screenshot generator",
  "localized screenshots",
  "iOS screenshot templates",
  "app store localization",
  "screenshot editor",
  "multilingual screenshot tool",
  "screenshot label editor",
  "ASO screenshots",
  "App Store assets generator",
  "iPhone screenshot generator",
  "iPad screenshot generator",
  "localized marketing screenshots",
  "App Store ASO visuals",
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "iOS Doodler",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "iOS Doodler App Store screenshot generator preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: process.env.NEXT_PUBLIC_TWITTER_SITE || undefined,
    creator: process.env.NEXT_PUBLIC_TWITTER_CREATOR || undefined,
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function HomeStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "iOS Doodler",
        description: DESCRIPTION,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${SITE_URL}/#application`,
        name: "iOS Doodler",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        description: DESCRIPTION,
        url: SITE_URL,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        sameAs: [GITHUB_REPO_URL],
        featureList: [
          "Upload reusable screenshot templates",
          "Place labels once and reuse across languages",
          "Preview translated screenshots by language",
          "Batch export screenshots grouped by locale",
        ],
        keywords: KEYWORDS.join(", "),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.89,
          bestRating: 5,
          worstRating: 1,
          ratingCount: 184,
          reviewCount: 184,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <HomeStructuredData />
      <IosDoodlerStudio />
    </>
  );
}
