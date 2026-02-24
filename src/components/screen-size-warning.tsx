import { Monitor } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ScreenSizeWarning() {
  return (
    <div className="voiceink-soft-bg min-h-screen px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-md">
        <Card className="border-amber-300 bg-white/95 text-slate-900 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-amber-700">
              <Monitor className="h-5 w-5" />
              Bigger Screen Required
            </CardTitle>
            <CardDescription className="text-slate-600">
              Open iOS Doodler supports iPad and desktop only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>Use a larger display to access template editing and screenshot generation features.</p>
            <p className="text-slate-500">Minimum recommended width: 768px.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
