import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="font-display text-5xl font-extrabold text-primary">404</p>
      <p className="text-muted-foreground">That page is offside.</p>
      <Button asChild>
        <Link href="/">Back to the leaderboard</Link>
      </Button>
    </div>
  );
}
