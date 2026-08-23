import type { Lead } from "@dv/contracts";

/** Same column set/quoting as the server's `GET /leads/export` (`apps/api/.../leads/routes.ts`)
 * — this is the bulk-toolbar's "export selected rows" path, which only has the currently
 * loaded page of `Lead`s to work with (no id-scoped export endpoint in the contract), so it
 * builds the CSV client-side instead of round-tripping to the server. */
const EXPORT_COLUMNS = [
  "id",
  "fullName",
  "phone",
  "email",
  "stage",
  "assigneeId",
  "campaignId",
  "createdAt"
] as const satisfies readonly (keyof Lead)[];

function csvCell(value: string | null): string {
  const s = value ?? "";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildLeadsCsv(leads: Lead[]): string {
  const lines = [
    EXPORT_COLUMNS.join(","),
    ...leads.map((lead) =>
      EXPORT_COLUMNS.map((col) => {
        const value = lead[col];
        return csvCell(
          value instanceof Date
            ? value.toISOString()
            : ((value ?? null)?.toString() ?? null)
        );
      }).join(",")
    )
  ];
  return lines.join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  downloadBlob(filename, new Blob([csv], { type: "text/csv;charset=utf-8" }));
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Minimal RFC4180 CSV parser (quoted fields, escaped `""`, commas/newlines inside quotes) —
 * the export route (`apps/api/.../leads/routes.ts`) builds CSV by hand rather than pulling in a
 * library, so import mirrors that: no new dependency for what this state machine covers. */
export function parseCsv(text: string): {
  headers: string[];
  rows: string[][];
} {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...body] = rows;
  return { headers: headers ?? [], rows: body };
}
