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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-1.5">
        <Logo variant="full" className="h-9 w-auto" />
        <p className="text-sm text-muted-foreground">{m.appTagline()}</p>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
