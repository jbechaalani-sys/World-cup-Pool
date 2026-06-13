import type { ReactNode } from "react";

export function PageTitle({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon && (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
