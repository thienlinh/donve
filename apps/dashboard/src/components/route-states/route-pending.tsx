import { Spinner } from "@dv/ui/components/shadcn/spinner";

export function RoutePending() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <Spinner />
    </div>
  );
}
