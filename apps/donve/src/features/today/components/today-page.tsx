import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CircleCheck,
  CreditCard,
  Inbox,
  LayoutTemplate,
  PackageCheck,
  Plus,
  type LucideIcon
} from "lucide-react";

import { fetchOperatingSummary } from "@/features/leads/api";
import { leadKeys } from "@/features/leads/query-keys";
import { fetchLandingPages } from "@/features/studio/api";
import { landingKeys } from "@/features/studio/query-keys";
import { leadSourceLabel } from "@/lib/lead-source-label";
import * as m from "@/paraglide/messages.js";

export function TodayPage() {
  const summaryQuery = useQuery({
    queryKey: leadKeys.operatingSummary(),
    queryFn: fetchOperatingSummary
  });
  const offersQuery = useQuery({
    queryKey: landingKeys.list(),
    queryFn: fetchLandingPages
  });

  const isPending = summaryQuery.isPending || offersQuery.isPending;
  const error = summaryQuery.error ?? offersQuery.error;

  if (isPending) {
    return <TodaySkeleton />;
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{m.todayErrorTitle()}</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <Button
          onClick={() => {
            void Promise.all([summaryQuery.refetch(), offersQuery.refetch()]);
          }}
          variant="outline"
        >
          {m.commonRetry()}
        </Button>
      </Empty>
    );
  }

  const liveOffers =
    offersQuery.data?.filter((offer) => offer.isPublished).length ?? 0;
  const hasOffers = (offersQuery.data?.length ?? 0) > 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium text-brand">{m.todayEyebrow()}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {m.todayTitle()}
          </h1>
          <p className="text-muted-foreground">{m.todayDescription()}</p>
        </div>
        <Button render={<Link to="/offers" />}>
          <Plus />
          {m.todayCreateOffer()}
        </Button>
      </header>

      <section aria-labelledby="today-queue-title" className="space-y-3">
        <div>
          <h2 id="today-queue-title" className="text-xl font-semibold">
            {m.todayQueueTitle()}
          </h2>
          <p className="text-sm text-muted-foreground">
            {m.todayQueueDescription()}
          </p>
        </div>
        <Card>
          <CardContent className="space-y-2 pt-6">
            {(summaryQuery.data?.nextActions ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {m.todayQueueEmpty()}
              </p>
            ) : (
              summaryQuery.data?.nextActions.map((action) => (
                <QueueRow action={action} key={action.kind} />
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="daily-summary-title" className="space-y-3">
        <div>
          <h2 id="daily-summary-title" className="text-xl font-semibold">
            Nhịp vận hành hôm nay
          </h2>
          <p className="text-sm text-muted-foreground">
            Chỉ những con số giúp bạn biết việc tiếp theo, không phải báo cáo
            BI.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <SummaryMetric
            label="Lead mới"
            value={summaryQuery.data?.leads ?? 0}
          />
          <SummaryMetric
            label="Đơn tạo"
            value={summaryQuery.data?.orders ?? 0}
          />
          <SummaryMetric
            label="Đã thanh toán"
            value={summaryQuery.data?.paid ?? 0}
          />
          <SummaryMetric
            label="Chưa giao"
            value={summaryQuery.data?.pendingFulfillment ?? 0}
          />
          <SummaryMetric
            label="Tiền cần xác nhận"
            value={summaryQuery.data?.unresolvedPayments ?? 0}
          />
          <SummaryMetric label={m.todayLiveOffers()} value={liveOffers} />
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="size-4 text-brand" />
                Nguồn tạo đơn
              </CardTitle>
              <CardDescription>
                So sánh lead và đơn đã thanh toán theo nguồn link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(summaryQuery.data?.sources ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có dữ liệu nguồn trong hôm nay.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {summaryQuery.data?.sources.slice(0, 5).map((source) => (
                    <li
                      className="flex items-center justify-between gap-3"
                      key={source.source}
                    >
                      <span className="truncate">
                        {leadSourceLabel(source.source)}
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        {source.leads} lead · {source.paidOrders} paid
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {!hasOffers && (
        <Card className="border-brand-border/70 bg-brand-muted/40">
          <CardHeader>
            <CardTitle>{m.todayGettingStartedTitle()}</CardTitle>
            <CardDescription>
              {m.todayGettingStartedDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link to="/offers" />}>
              {m.todayCreateFirstOffer()}
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      )}

      <section
        aria-labelledby="today-status-title"
        className="grid gap-4 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle
              id="today-status-title"
              className="flex items-center gap-2 text-base"
            >
              <CircleCheck className="size-4 text-success" />
              {m.todaySystemStatus()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {m.todaySystemReady()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutTemplate className="size-4 text-brand" />
              {m.todayNextStepTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {hasOffers
              ? m.todayNextStepWithOffer()
              : m.todayNextStepWithoutOffer()}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
      </CardContent>
    </Card>
  );
}

const QUEUE_ROW_STYLE: Record<
  "fulfillment" | "lead" | "payment",
  { icon: LucideIcon; accent: string }
> = {
  // Most urgent — money already collected, customer is waiting on delivery.
  fulfillment: { icon: PackageCheck, accent: "text-destructive" },
  lead: { icon: Inbox, accent: "text-brand" },
  payment: { icon: CreditCard, accent: "text-muted-foreground" }
};

function QueueRow({
  action
}: {
  action: { kind: string; label: string; count: number; href: string };
}) {
  const style =
    QUEUE_ROW_STYLE[action.kind as keyof typeof QUEUE_ROW_STYLE] ??
    QUEUE_ROW_STYLE.payment;
  const Icon = style.icon;
  return (
    <a
      className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      href={action.href}
    >
      <span className="flex items-center gap-2">
        <Icon aria-hidden className={`size-4 ${style.accent}`} />
        {action.label}
      </span>
      <span className="flex items-center gap-2 font-semibold">
        {action.count}
        <ArrowRight className="size-4" />
      </span>
    </a>
  );
}

function TodaySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label={m.todayLoading()}
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-72 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted" />
      </div>
      <div className="h-40 animate-pulse rounded-xl border bg-muted/50" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="h-16 animate-pulse rounded-xl border bg-muted/50"
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
