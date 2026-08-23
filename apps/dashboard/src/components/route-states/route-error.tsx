import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";

import * as m from "@/paraglide/messages.js";

export function RouteError({ error }: { error: Error }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{m.routeErrorTitle()}</EmptyTitle>
          <EmptyDescription>
            {error.message || m.routeErrorDescription()}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
