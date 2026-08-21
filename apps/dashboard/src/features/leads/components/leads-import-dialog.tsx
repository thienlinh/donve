import type { CampaignWithProducts, LeadImportRow } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Label } from "@dv/ui/components/shadcn/label";
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
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import * as m from "@/paraglide/messages.js";

import { importLeads } from "../api";
import { parseCsv } from "../csv";

const MAPPING_TARGETS = [
  "skip",
  "fullName",
  "phone",
  "email",
  "persona",
  "customFields"
] as const;
type MappingTarget = (typeof MAPPING_TARGETS)[number];

const MAPPING_LABELS: Record<MappingTarget, () => string> = {
  skip: m.leadsImportMappingSkip,
  fullName: m.leadsImportMappingFullName,
  phone: m.leadsImportMappingPhone,
  email: m.leadsImportMappingEmail,
  persona: m.leadsImportMappingPersona,
  customFields: m.leadsImportMappingCustomFields
};

const PREVIEW_ROW_COUNT = 5;

function buildImportRows(
  headers: string[],
  rows: string[][],
  mapping: Record<string, MappingTarget>
): { rows: LeadImportRow[]; skipped: number } {
  const imported: LeadImportRow[] = [];
  let skipped = 0;

  for (const row of rows) {
    const customFields: Record<string, string> = {};
    let fullName = "";
    let phone = "";
    let email = "";
    let persona = "";

    headers.forEach((header, index) => {
      const value = row[index] ?? "";
      switch (mapping[header]) {
        case "fullName":
          fullName = value;
          break;
        case "phone":
          phone = value;
          break;
        case "email":
          email = value;
          break;
        case "persona":
          persona = value;
          break;
        case "customFields":
          if (value) customFields[header] = value;
          break;
        default:
          break;
      }
    });

    if (!fullName || !phone) {
      skipped++;
      continue;
    }
    imported.push({
      fullName,
      phone,
      email: email || null,
      persona: persona || null,
      customFields
    });
  }

  return { rows: imported, skipped };
}

/** module E finding #3 — upload a `.csv`, map its columns to lead fields, then submit through
 * `POST /api/leads/import` (which reuses the same phone-dedupe upsert as the public form). */
export function LeadsImportDialog() {
  const [open, setOpen] = useState(false);
  const [campaignId, setCampaignId] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, MappingTarget>>({});
  const queryClient = useQueryClient();

  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns
  });

  const importMutation = useMutation({
    mutationFn: importLeads,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      toast.add({
        title: m.leadsImportSuccessToast({
          created: result.created,
          merged: result.merged
        }),
        type: "success"
      });
      resetState();
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.leadsImportErrorToast(), type: "error" })
  });

  function resetState() {
    setCampaignId("");
    setHeaders([]);
    setRows([]);
    setMapping({});
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const { headers: parsedHeaders, rows: parsedRows } = parseCsv(
      await file.text()
    );
    setHeaders(parsedHeaders);
    setRows(parsedRows);
    setMapping(Object.fromEntries(parsedHeaders.map((h) => [h, "skip"])));
  }

  function handleSubmit() {
    if (!campaignId) return;
    const { rows: importRows, skipped } = buildImportRows(
      headers,
      rows,
      mapping
    );
    if (importRows.length === 0) {
      toast.add({ title: m.leadsImportNoRowsError(), type: "error" });
      return;
    }
    if (skipped > 0) {
      toast.add({
        title: m.leadsImportSkippedRowsToast({ count: skipped }),
        type: "info"
      });
    }
    importMutation.mutate({ campaignId, rows: importRows });
  }

  const hasFile = headers.length > 0;
  const canSubmit =
    hasFile &&
    Boolean(campaignId) &&
    Object.values(mapping).includes("fullName") &&
    Object.values(mapping).includes("phone");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetState();
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <Upload /> {m.leadsImportButton()}
          </Button>
        }
      />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{m.leadsImportDialogTitle()}</DialogTitle>
          <DialogDescription>
            {m.leadsImportDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="import-campaign">
              {m.leadsFilterCampaignLabel()}
            </Label>
            <NativeSelect
              id="import-campaign"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <NativeSelectOption value="">{m.commonAll()}</NativeSelectOption>
              {campaigns?.map((campaign: CampaignWithProducts) => (
                <NativeSelectOption key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="import-file">{m.leadsImportUploadLabel()}</Label>
            <input
              id="import-file"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
            />
          </div>

          {hasFile && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {headers.map((header) => (
                  <div key={header} className="flex flex-col gap-1">
                    <span className="truncate text-xs font-medium">
                      {header}
                    </span>
                    <NativeSelect
                      value={mapping[header] ?? "skip"}
                      onChange={(e) =>
                        setMapping((prev) => ({
                          ...prev,
                          [header]: e.target.value as MappingTarget
                        }))
                      }
                    >
                      {MAPPING_TARGETS.map((target) => (
                        <NativeSelectOption key={target} value={target}>
                          {MAPPING_LABELS[target]()}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {m.leadsImportPreviewTitle({
                  rows: rows.length,
                  shown: Math.min(rows.length, PREVIEW_ROW_COUNT)
                })}
              </p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, PREVIEW_ROW_COUNT).map((row, i) => (
                      // oxlint-disable-next-line react/no-array-index-key -- read-only preview
                      // of parsed CSV rows, which have no stable identity of their own
                      <TableRow key={i}>
                        {headers.map((header, colIndex) => (
                          <TableCell key={header}>
                            {row[colIndex] ?? ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline">
                {m.commonCancel()}
              </Button>
            }
          />
          <Button
            type="button"
            disabled={!canSubmit || importMutation.isPending}
            onClick={handleSubmit}
          >
            {importMutation.isPending
              ? m.commonLoading()
              : m.leadsImportSubmit()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
