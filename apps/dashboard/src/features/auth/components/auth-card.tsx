import { Logo } from "@dv/ui/components/dv/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import type { ReactNode } from "react";

import * as m from "@/paraglide/messages.js";

export function AuthCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--brand-glow),transparent)]"
      />
      <div className="flex flex-col items-center gap-2">
        <Logo variant="full" className="h-9 w-[130px]" />
        <p className="text-sm text-muted-foreground">{m.appTagline()}</p>
      </div>
      <Card className="w-full max-w-sm border-brand-border/60 shadow-[0_1px_0_0_var(--brand-border)]">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
