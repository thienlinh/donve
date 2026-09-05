import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@dv/ui/components/shadcn/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@dv/ui/components/shadcn/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import { fetchUsageSummary } from "../api";
import { usageSummaryKeys } from "../query-keys";

// Literal (not `m.usageInsightsChartLabel()`) — same convention as
// `campaign-analytics-dialog.tsx`'s own `chartConfig`, a module-scope constant evaluated once
// at import time, before paraglide's locale context is necessarily ready.
const chartConfig = {
  count: { label: "Actions", color: "var(--chart-1)" }
} satisfies ChartConfig;

/** Founder-only, internal usage telemetry (see `packages/db/src/schema/tracking.ts`'s
 * `appUsageEvents`) — same 30-day-summary shape as `CampaignAnalyticsDialog`, but for in-app
 * feature usage instead of visitor-facing landing-page conversion. */
export function UsageInsightsCard() {
  const {
    data: summary,
    isPending,
    error
  } = useQuery({
    queryKey: usageSummaryKeys.all(),
    queryFn: fetchUsageSummary
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.usageInsightsTitle()}</CardTitle>
        <CardDescription>{m.usageInsightsDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={summary?.totalEvents === 0}
          errorTitle={m.usageInsightsLoadErrorTitle()}
          emptyTitle={m.usageInsightsEmptyTitle()}
          emptyIcon={<Activity />}
        />

        {summary && summary.totalEvents > 0 && (
          <>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {m.usageInsightsTotalEvents()}
              </span>
              <span className="text-lg font-medium">{summary.totalEvents}</span>
            </div>

            <ChartContainer config={chartConfig} className="h-48 w-full">
              <BarChart data={summary.days}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) => value.slice(5)}
                  minTickGap={24}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={2} />
              </BarChart>
            </ChartContainer>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">
                {m.usageInsightsByEventTitle()}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{m.usageInsightsColumnEvent()}</TableHead>
                    <TableHead>{m.usageInsightsColumnCount()}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.byEvent.map((row) => (
                    <TableRow key={row.eventName}>
                      <TableCell className="font-medium">
                        {row.eventName}
                      </TableCell>
                      <TableCell>{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
