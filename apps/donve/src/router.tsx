import { createRouter } from "@tanstack/react-router";

import { RouteError } from "@/components/route-states/route-error";
import { RouteNotFound } from "@/components/route-states/route-not-found";
import { RoutePending } from "@/components/route-states/route-pending";

import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPendingComponent: RoutePending,
  defaultErrorComponent: RouteError,
  defaultNotFoundComponent: RouteNotFound
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
