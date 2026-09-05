import { Logo } from "@dv/ui/components/dv/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Check } from "lucide-react";
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
    <div className="relative grid min-h-svh overflow-hidden bg-background lg:grid-cols-[minmax(0,1fr)_minmax(28rem,36rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--brand-glow),transparent)]"
      />
      <aside className="hidden flex-col justify-between bg-brand-soft/35 p-10 lg:flex xl:p-16">
        <BrandLockup />
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-brand">{m.appName()}</p>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
              {m.authSideTitle()}
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              {m.authSideDescription()}
            </p>
          </div>
          <ul className="grid gap-4 text-sm">
            <ValueItem>{m.authValueLead()}</ValueItem>
            <ValueItem>{m.authValuePayment()}</ValueItem>
            <ValueItem>{m.authValueNext()}</ValueItem>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">{m.appTagline()}</p>
      </aside>
      <main className="flex min-w-0 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden">
            <BrandLockup />
          </div>
          <Card className="w-full border-brand-border/60 shadow-[0_1px_0_0_var(--brand-border)]">
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function BrandLockup() {
  return (
    <div className="flex items-center gap-3">
      <Logo variant="mark" alt={m.appName()} className="size-9" />
      <div className="space-y-0.5">
        <p className="font-semibold tracking-tight">{m.appName()}</p>
        <p className="text-xs text-muted-foreground">{m.appTagline()}</p>
      </div>
    </div>
  );
}

function ValueItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
        <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
      </span>
      <span>{children}</span>
    </li>
  );
}
