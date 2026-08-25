import { Badge } from "@dv/ui/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import { fetchOrgs } from "../api";
import { platformKeys } from "../query-keys";
import { PlatformOrgDetail } from "./platform-org-detail";

const routeApi = getRouteApi("/_authenticated/platform");

type StatusFilter = "all" | "active" | "disabled";

/**
 * `/platform` (docs/architecture/platform-admin.md §5/§11) — cross-tenant org list, or the
 * detail view when `?org=` is set. Filtering happens client-side on the full list: the whole
 * point of this screen is that there are few enough orgs to eyeball, and the endpoint already
 * returns all of them for the table.
 * ponytail: move filter/search into `GET /platform/orgs` query params once the list outgrows
 * one page of scrolling.
 */
export function PlatformOrgsPage() {
  const { org: selectedOrgId } = routeApi.useSearch();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const { data, error, isPending } = useQuery({
    queryKey: platformKeys.orgs(),
    queryFn: fetchOrgs
  });

  if (selectedOrgId) return <PlatformOrgDetail orgId={selectedOrgId} />;

  const needle = search.trim().toLowerCase();
  const orgs = (data ?? []).filter((org) => {
    const matchesStatus =
      status === "all" ||
      (status === "disabled"
        ? org.disabledAt !== null
        : org.disabledAt === null);
    const matchesSearch =
      needle === "" ||
      org.name.toLowerCase().includes(needle) ||
      org.slug.toLowerCase().includes(needle) ||
      (org.ownerEmail?.toLowerCase().includes(needle) ?? false);
    return matchesStatus && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.platformOrgsTitle()}</CardTitle>
        <CardDescription>{m.platformOrgsDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={m.platformOrgsSearchPlaceholder()}
          />
          <NativeSelect
            className="max-w-40"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <NativeSelectOption value="all">
              {m.platformOrgsStatusAll()}
            </NativeSelectOption>
            <NativeSelectOption value="active">
              {m.platformOrgsStatusActive()}
            </NativeSelectOption>
            <NativeSelectOption value="disabled">
              {m.platformOrgsStatusDisabled()}
            </NativeSelectOption>
          </NativeSelect>
        </div>

        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={orgs.length === 0}
          errorTitle={m.platformOrgsLoadErrorTitle()}
          emptyTitle={m.platformOrgsEmptyTitle()}
          emptyIcon={<Building2 />}
          loadingLabel={m.platformOrgsLoading()}
        />

        {orgs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{m.platformOrgsColumnName()}</TableHead>
                <TableHead>{m.platformOrgsColumnOwner()}</TableHead>
                <TableHead>{m.platformOrgsColumnPlan()}</TableHead>
                <TableHead>{m.platformOrgsColumnStatus()}</TableHead>
                <TableHead>{m.platformOrgsColumnAiCredit()}</TableHead>
                <TableHead>{m.platformOrgsColumnCreated()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/platform"
                      search={{ org: org.id }}
                      className="underline-offset-4 hover:underline"
                    >
                      {org.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {org.slug}
                    </div>
                  </TableCell>
                  <TableCell>{org.ownerEmail ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={org.plan === "free" ? "outline" : "default"}
                    >
                      {org.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={org.disabledAt ? "destructive" : "secondary"}
                    >
                      {org.disabledAt
                        ? m.platformOrgsStatusDisabled()
                        : m.platformOrgsStatusActive()}
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
