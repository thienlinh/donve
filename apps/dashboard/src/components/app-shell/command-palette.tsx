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
import { Fragment, useEffect, useState } from "react";

import { navGroups } from "./nav-items";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
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
      setOpen((isOpen) => !isOpen);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {navGroups.map((group, index) => (
          <Fragment key={group.label()}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.label()}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.to}
                  value={item.label()}
                  onSelect={() => {
                    setOpen(false);
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
