import { Badge } from "@dv/ui/components/shadcn/badge";
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

import { fetchOrgs } from "../api";

/**
 * First `/platform` screen (docs/architecture/platform-admin.md §5/§7) — read-only list of
 * every org, intentionally the only view until a real ops case needs more (org detail,
 * disable, refund-assist...). Each of those is its own future endpoint + its own audit action,
 * not something this page grows into implicitly.
 */
export function PlatformOrgsPage() {
  const { data, error, isPending } = useQuery({
    queryKey: ["platform", "orgs"],
    queryFn: fetchOrgs
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
        <CardDescription>
          Cross-tenant, read-only. Every view is recorded in{" "}
          <code>platform_audit_logs</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Loading organizations…
          </div>
        )}

        {error && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Couldn't load organizations</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {data && data.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No organizations yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>AI credit</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.slug}</TableCell>
                  <TableCell>
                    <Badge
                      variant={org.plan === "free" ? "outline" : "default"}
                    >
                      {org.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.aiCreditBalance}</TableCell>
                  <TableCell>{org.createdAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
