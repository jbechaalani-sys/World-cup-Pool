import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { PrizeCards } from "@/components/common/prize-cards";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRIZES, TOURNAMENT } from "@/lib/config";

export const metadata: Metadata = { title: "Rules & Prizes" };

const GROUP_SCORING = [
  { label: "Correct winner + exact score", pts: "3 pts", tone: "text-up" },
  { label: "Correct winner, wrong score", pts: "1 pt", tone: "text-primary" },
  { label: "Wrong winner", pts: "0 pts", tone: "text-muted-foreground" },
];

const KNOCKOUT_SCORING = [
  { label: "Reached Round of 32", pts: "2 pts" },
  { label: "Reached Round of 16", pts: "5 pts" },
  { label: "Reached Quarter-finals", pts: "10 pts" },
  { label: "Reached Semi-finals", pts: "20 pts" },
  { label: "Reached the Final", pts: "40 pts" },
  { label: "World Cup winner", pts: "100 pts" },
];

const RULES = [
  "Predictions lock at kickoff of each match.",
  "Rankings update automatically from the official sheet.",
  "Total points across all stages determine the final standings.",
  "The Group-Stage prize excludes knockout-qualification points.",
];

const TIEBREAKERS = [
  "Most exact scores in the group stage",
  "Most correct winners in the group stage",
];

function Row({ label, pts, tone }: { label: string; pts: string; tone?: string }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-sm text-foreground/90">{label}</span>
      <span className={`shrink-0 font-display text-sm font-bold nums ${tone ?? "text-foreground"}`}>
        {pts}
      </span>
    </li>
  );
}

export default function RulesPage() {
  return (
    <div>
      <PageTitle
        title="Rules & Prizes"
        subtitle={`${TOURNAMENT.matches} matches · ${PRIZES.total} ${PRIZES.currency} prize pool`}
        icon={<Gift className="size-5" aria-hidden />}
      />

      <Card className="mb-5 items-center gap-1 bg-gradient-to-b from-primary/10 to-card py-6 text-center">
        <h2 className="font-display text-xl font-extrabold">
          {TOURNAMENT.title} {TOURNAMENT.subtitle}
        </h2>
        <p className="text-sm text-muted-foreground">
          18 players · {TOURNAMENT.matches} matches · {PRIZES.total} {PRIZES.currency} on the line
        </p>
      </Card>

      <PrizeCards className="mb-6" />

      <Accordion type="multiple" defaultValue={["group", "knockout"]} className="w-full">
        <AccordionItem value="group">
          <AccordionTrigger className="font-display text-base font-bold">
            Group-stage scoring
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {GROUP_SCORING.map((r) => (
                <Row key={r.label} {...r} />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="knockout">
          <AccordionTrigger className="font-display text-base font-bold">
            Knockout-stage scoring
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Points for each team you correctly predict to reach a stage.
            </p>
            <ul>
              {KNOCKOUT_SCORING.map((r) => (
                <Row key={r.label} label={r.label} pts={r.pts} tone="text-primary" />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rules">
          <AccordionTrigger className="font-display text-base font-bold">
            Tournament rules
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tiebreakers">
          <AccordionTrigger className="font-display text-base font-bold">
            Tie-breakers
          </AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground/90">
              {TIEBREAKERS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
