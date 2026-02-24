import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenSizeWarning } from "@/components/screen-size-warning";

export default function NotFound() {
  return (
    <>
      <div className="md:hidden">
        <ScreenSizeWarning />
      </div>

      <div className="voiceink-soft-bg hidden min-h-screen px-6 py-16 text-slate-900 md:block">
        <div className="mx-auto max-w-2xl">
          <Card className="border-slate-200 bg-white/95 text-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <SearchX className="h-6 w-6 text-sky-600" />
                Page Not Found
              </CardTitle>
              <CardDescription className="text-slate-600">
                The page you requested does not exist in Open iOS Doodler.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back To Studio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
