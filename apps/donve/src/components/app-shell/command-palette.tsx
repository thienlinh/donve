import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@dv/ui/components/shadcn/command";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useSyncExternalStore } from "react";

import * as m from "@/paraglide/messages.js";

import {
  getCommandPaletteOpen,
  setCommandPaletteOpen,
  subscribeCommandPalette
} from "./command-palette-store";
import { navGroups } from "./nav-items";

export function CommandPalette() {
  const open = useSyncExternalStore(
    subscribeCommandPalette,
    getCommandPaletteOpen
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey)
      ) {
        return;
      }

      event.preventDefault();
      setCommandPaletteOpen(!getCommandPaletteOpen());
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder={m.shellCommandPaletteInputPlaceholder()} />
      <CommandList>
        <CommandEmpty>{m.shellCommandPaletteEmpty()}</CommandEmpty>
        {navGroups.map((group, index) => (
          <Fragment key={group.label()}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.label()}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.to}
                  value={item.label()}
                  onSelect={() => {
                    setCommandPaletteOpen(false);
                    void navigate({ to: item.to });
                  }}
                >
                  <item.icon />
                  <span>{item.label()}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
