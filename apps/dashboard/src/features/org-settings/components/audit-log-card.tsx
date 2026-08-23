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
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";

import * as m from "@/paraglide/messages.js";

import { fetchAuditLogs } from "../api";
import { auditLogKeys } from "../query-keys";

/** FR-A-05 — read-only list, no filters/pagination yet since `listRecent` just caps at 200. */
export function AuditLogCard() {
  const {
    data: logs,
    isPending,
    error
  } = useQuery({
    queryKey: auditLogKeys.all(),
    queryFn: fetchAuditLogs
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.auditLogTitle()}</CardTitle>
        <CardDescription>{m.auditLogDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> {m.commonLoading()}
          </div>
        )}

        {error && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.auditLogLoadErrorTitle()}</EmptyTitle>
              {error.message && (
                <EmptyDescription>{error.message}</EmptyDescription>
              )}
            </EmptyHeader>
          </Empty>
        )}

        {logs && logs.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.auditLogEmptyTitle()}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        {logs && logs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{m.auditLogColumnAction()}</TableHead>
                <TableHead>{m.auditLogColumnTarget()}</TableHead>
                <TableHead>{m.auditLogColumnActor()}</TableHead>
                <TableHead>{m.auditLogColumnTime()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    {log.targetType
                      ? `${log.targetType}${log.targetId ? ` · ${log.targetId}` : ""}`
                      : "—"}
                  </TableCell>
                  <TableCell>{log.actorId ?? "—"}</TableCell>
                  <TableCell>{log.createdAt.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
