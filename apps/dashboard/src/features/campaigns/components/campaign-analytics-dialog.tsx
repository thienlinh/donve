import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@dv/ui/components/shadcn/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Empty, EmptyHeader, EmptyTitle } from "@dv/ui/components/shadcn/empty";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { useQuery } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import * as m from "@/paraglide/messages.js";

import { fetchCampaignAnalytics } from "../api";
import { campaignKeys } from "../query-keys";

const chartConfig = {
  views: { label: "Views", color: "var(--chart-1)" },
  submits: { label: "Submits", color: "var(--chart-2)" },
  orders: { label: "Orders", color: "var(--chart-3)" }
} satisfies ChartConfig;

/** FR-C-05: 30-day views/submits/orders/reconciled-revenue for one campaign. */
export function CampaignAnalyticsDialog({
  campaignId,
  trigger
}: {
  campaignId: string;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: analytics,
    isPending,
    error
  } = useQuery({
    queryKey: campaignKeys.analytics(campaignId),
    queryFn: () => fetchCampaignAnalytics(campaignId),
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{m.campaignsAnalyticsTitle()}</DialogTitle>
          <DialogDescription>
            {m.campaignsAnalyticsDescription()}
          </DialogDescription>
        </DialogHeader>
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> {m.commonLoading()}
          </div>
        )}
        {error && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.campaignsAnalyticsLoadErrorTitle()}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
        {analytics && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Stat
                label={m.campaignsAnalyticsViews()}
                value={analytics.totals.views}
              />
              <Stat
                label={m.campaignsAnalyticsSubmits()}
                value={analytics.totals.submits}
              />
              <Stat
                label={m.campaignsAnalyticsOrders()}
                value={analytics.totals.orders}
              />
              <Stat
                label={m.campaignsAnalyticsRevenue()}
                value={analytics.totals.revenue.toLocaleString()}
              />
              <Stat
                label={m.campaignsAnalyticsConversion()}
                value={`${(analytics.totals.conversionRate * 100).toFixed(1)}%`}
              />
            </div>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart data={analytics.days}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) => value.slice(5)}
                  minTickGap={24}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="views"
                  type="monotone"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="submits"
                  type="monotone"
                  stroke="var(--color-submits)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="orders"
                  type="monotone"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-medium">{value}</span>
    </div>
  );
}
