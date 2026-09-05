import { QueryClient } from "@tanstack/react-query";

import { ApiClientError } from "./api-client";

// A 4xx from the API (not found, forbidden, feature-gated, validation) will fail the exact
// same way on retry — the default 3-retry backoff just leaves the user staring at a spinner
// for several extra seconds before the real error shows up. Only retry what a transient
// network blip or a 5xx could plausibly fix.
function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) return true;
  return error.status >= 500;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isRetryable(error) && failureCount < 3
    }
  }
});
