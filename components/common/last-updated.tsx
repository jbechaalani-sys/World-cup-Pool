"use client";

import { useEffect, useState } from "react";

function ago(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

/** Relative "updated Xs ago" label. Mounted-gated to avoid hydration drift. */
export function LastUpdated({ asOf }: { asOf: number }) {
  const [, force] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => force((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return <span className="text-muted-foreground">live</span>;
  return (
    <span className="text-muted-foreground">updated {ago(Date.now() - asOf)}</span>
  );
}
