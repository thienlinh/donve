import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // `_authenticated`'s own beforeLoad is what actually gates on session —
    // "/" is just the entry point into the authenticated area.
    throw redirect({ to: "/landings" });
  }
});
