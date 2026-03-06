import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "JSON Import Documentation",
  description:
    "JSON schema and examples for importing localized text into App Doodler screenshot shots.",
  alternates: {
    canonical: "/docs/json-import",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JsonImportDocsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <FileJson className="h-6 w-6 text-sky-700" />
          JSON Import Documentation
        </h1>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Studio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>Use any number of text keys per language. You are not limited to headline/subtitle.</p>
          <p>Text keys must match label keys used in Screenshot Editor (for example: headline, subtitle, label_3).</p>
          <p>All languages must contain the same key names and the same key count.</p>
          <p>Use only direct language-map format. Slot overrides and envelope keys are not supported.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported JSON Format</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
{`{
  "en-US": {
    "headline": "Feature One",
    "subtitle": "Main copy",
    "cta": "Try now"
  },
  "de-DE": {
    "headline": "Funktion Eins",
    "subtitle": "Haupttext",
    "cta": "Jetzt testen"
  }
}`}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
