import type { ReactNode } from "react";
import { WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-2 border-dashed py-12 text-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="font-display text-lg font-bold">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </Card>
  );
}

export function DataError({ what }: { what: string }) {
  return (
    <Card className="flex flex-col items-center gap-2 border-destructive/30 bg-destructive/5 py-10 text-center">
      <WifiOff className="size-6 text-destructive" aria-hidden />
      <p className="font-medium">Couldn&apos;t load {what}</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        The live spreadsheet didn&apos;t respond. It usually fixes itself —
        refresh in a moment.
      </p>
    </Card>
  );
}
