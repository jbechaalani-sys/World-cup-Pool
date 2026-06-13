import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { Movement } from "@/lib/rank-delta";
import { cn } from "@/lib/utils";

/** Fixed-width movement indicator so rows stay column-aligned. */
export function RankArrow({ movement, show }: { movement: Movement; show: boolean }) {
  if (!show || movement.dir === "new") {
    return <span className="inline-flex w-7 shrink-0" aria-hidden />;
  }
  if (movement.dir === "same") {
    return (
      <span className="inline-flex w-7 shrink-0 justify-center text-same" aria-label="no change">
        <Minus className="size-3" aria-hidden />
      </span>
    );
  }
  const up = movement.dir === "up";
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex w-7 shrink-0 items-center justify-center text-[11px] font-bold nums",
        up ? "text-up" : "text-down",
      )}
      aria-label={`${up ? "up" : "down"} ${movement.delta} ${movement.delta === 1 ? "place" : "places"}`}
    >
      <Icon className="size-3" aria-hidden />
      {movement.delta}
    </span>
  );
}
