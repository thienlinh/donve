import { Button } from "@dv/ui/components/shadcn/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Link } from "@tanstack/react-router";

import * as m from "@/paraglide/messages.js";

export function RouteNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{m.routeNotFoundTitle()}</EmptyTitle>
          <EmptyDescription>{m.routeNotFoundDescription()}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link to="/" />}>
            {m.routeNotFoundBackButton()}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
