import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";

import { QueryState } from "@/components/query-state";
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
        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={logs?.length === 0}
          errorTitle={m.auditLogLoadErrorTitle()}
          emptyTitle={m.auditLogEmptyTitle()}
          emptyIcon={<ScrollText />}
        />

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
