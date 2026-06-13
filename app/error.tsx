"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <WifiOff className="size-8 text-destructive" aria-hidden />
      <div>
        <p className="font-display text-xl font-bold">Something went wrong</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t load this page. The live data source may be
          temporarily unavailable.
        </p>
      </div>
      <Button onClick={reset} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
