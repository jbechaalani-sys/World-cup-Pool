import { flagCodeFor, teamShort } from "@/lib/flags";
import { cn } from "@/lib/utils";

/**
 * Real SVG flag via flagcdn (handles England/Scotland/Wales sub-codes that
 * emoji flags render as a blank black flag). Falls back to a 3-letter chip
 * when the team isn't mapped — no client JS / onError needed.
 */
export function Flag({ team, className }: { team: string; className?: string }) {
  const code = flagCodeFor(team);

  if (!code) {
    return (
      <span
        className={cn(
          "inline-flex h-4 w-6 items-center justify-center rounded-[3px] border border-border bg-secondary text-[8px] font-bold leading-none text-secondary-foreground",
          className,
        )}
        aria-label={team}
        title={team}
      >
        {teamShort(team)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- many tiny external flag SVGs; next/image optimization is counterproductive here
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      aria-hidden
      loading="lazy"
      className={cn(
        "inline-block h-4 w-6 rounded-[3px] border border-border/60 object-cover align-middle",
        className,
      )}
    />
  );
}
