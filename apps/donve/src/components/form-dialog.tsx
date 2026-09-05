import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import type { FormEventHandler, ReactElement, ReactNode } from "react";

import * as m from "@/paraglide/messages.js";

/**
 * Dialog + header + submit/cancel footer chrome shared by `campaign-form-dialog.tsx`,
 * `product-form-dialog.tsx`, `skill-form-dialog.tsx`, `add-domain-dialog.tsx` — each still owns
 * its own react-hook-form + zodResolver setup and field markup, passed in as `children`.
 */
export function FormDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  submitLabel,
  isPending,
  onSubmit,
  children,
  contentClassName
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  title: string;
  description: string;
  submitLabel: string;
  isPending: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  contentClassName?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {children}
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {m.commonCancel()}
                </Button>
              }
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? m.commonLoading() : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
