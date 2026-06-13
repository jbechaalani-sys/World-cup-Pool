"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Animates from the previous value to the new one (ease-out cubic).
 * Initial render shows `value` verbatim → no hydration mismatch.
 * Respects prefers-reduced-motion (snaps instantly).
 */
export function CountUp({
  value,
  className,
  duration = 700,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const to = value;
    const from = fromRef.current;
    if (reduce || from === to) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);

  return <span className={className}>{display}</span>;
}
