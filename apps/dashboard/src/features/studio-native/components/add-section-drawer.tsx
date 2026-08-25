import { componentMetadata, exampleProps } from "@dv/studio-catalog";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";

/**
 * Category-grouped component picker, used by `strategy/architecture-page.tsx`'s Wizard AI
 * step 3 (manual "+ Thêm section" before the AI content fill). The studio-native canvas itself
 * no longer uses this — Puck's own built-in component picker replaced it there.
 */
export function AddSectionDrawer({
  open,
  onOpenChange,
  onInsert
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (componentId: string, props: Record<string, unknown>) => void;
}) {
  const byCategory = new Map<string, (typeof componentMetadata)[number][]>();
  for (const meta of componentMetadata) {
    if (
      meta.componentId === "page_root" ||
      meta.componentId === "raw_html_block"
    ) {
      continue;
    }
    const list = byCategory.get(meta.category) ?? [];
    list.push(meta);
    byCategory.set(meta.category, list);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Thêm section</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          {[...byCategory.entries()].map(([category, items]) => (
            <div key={category} className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((meta) => (
                  <Button
                    key={meta.componentId}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onInsert(
                        meta.componentId,
                        exampleProps[meta.componentId] ?? {}
                      );
                      onOpenChange(false);
                    }}
                  >
                    {meta.componentId}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
