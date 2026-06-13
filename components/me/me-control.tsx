"use client";

import { useEffect, useState } from "react";
import { Check, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMe } from "./me-provider";

/**
 * Chip/button that opens a searchable "who are you?" picker.
 * `autoPrompt` opens it once on first visit (home page only).
 */
export function MeControl({
  names,
  autoPrompt = false,
}: {
  names: string[];
  autoPrompt?: boolean;
}) {
  const { me, ready, pickerDismissed, choose, dismiss } = useMe();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && !me) dismiss();
  };

  useEffect(() => {
    if (autoPrompt && ready && !me && !pickerDismissed && names.length > 0) {
      setOpen(true);
    }
  }, [autoPrompt, ready, me, pickerDismissed, names.length]);

  return (
    <>
      <Button
        variant={me ? "secondary" : "default"}
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <UserRound className="size-3.5" aria-hidden />
        {me ? `You: ${me}` : "Who are you?"}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-sm">
          <DialogHeader className="px-4 pb-2 pt-4 text-left">
            <DialogTitle>Who are you?</DialogTitle>
            <DialogDescription>
              We&apos;ll highlight your row across the app. Saved on this device only.
            </DialogDescription>
          </DialogHeader>
          <Command className="rounded-t-none border-t">
            <CommandInput placeholder="Search your name…" />
            <CommandList>
              <CommandEmpty>No player found.</CommandEmpty>
              <CommandGroup>
                {names.map((n) => (
                  <CommandItem
                    key={n}
                    value={n}
                    onSelect={() => {
                      choose(n);
                      setOpen(false);
                    }}
                  >
                    {n}
                    {me === n && <Check className="ml-auto size-4" aria-hidden />}
                  </CommandItem>
                ))}
                {me && (
                  <CommandItem
                    value="__clear__"
                    onSelect={() => {
                      choose(null);
                      setOpen(false);
                    }}
                    className="text-muted-foreground"
                  >
                    Clear selection
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
