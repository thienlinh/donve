import { Toaster } from "@dv/ui/components/shadcn/toast";
import { TooltipProvider } from "@dv/ui/components/shadcn/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "@/components/theme-provider";
import { queryClient } from "@/lib/query-client";

export const Route = createRootRoute({
  component: RootComponent
});

function RootComponent() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster>
            <Outlet />
          </Toaster>
        </TooltipProvider>
        {import.meta.env.DEV && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
