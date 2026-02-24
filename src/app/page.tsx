import type { Metadata } from "next";

import { DoodlerStudio } from "@/components/doodler-studio";
import { ScreenSizeWarning } from "@/components/screen-size-warning";

export const metadata: Metadata = {
  title: "Create Localized iOS App Store Screenshots",
  description:
    "Upload one or many screenshot templates, place text once, preview every language, and generate grouped outputs for iPhone and iPad.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open iOS Doodler",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Tool for generating localized iOS App Store screenshots from reusable templates.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="md:hidden">
        <ScreenSizeWarning />
      </div>
      <div className="hidden md:block">
        <DoodlerStudio />
      </div>
    </>
  );
}
