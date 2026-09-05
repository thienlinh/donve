import type { DetectedForm, WireLeadFormInput } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@dv/ui/components/shadcn/select";
import { useMemo, useState } from "react";

const CANONICAL_FIELDS = ["fullName", "phone", "email", "persona"] as const;
const CANONICAL_LABEL: Record<(typeof CANONICAL_FIELDS)[number], string> = {
  fullName: "Họ tên",
  phone: "Số điện thoại",
  email: "Email",
  persona: "Persona"
};

/** Re-parses `html` client-side (same document order as the server's `detectImportForms`, so
 * `import-form-<i>` selectors line up) to list each detected form's own field names — the
 * server only persists `{selector, wired}` (`customPageBundles`), not the field list, since
 * that's only ever needed live at wiring time, never after.
 *
 * Falls back to `id` when a field has no `name` — mirrors the server's `fieldIdentifier()`
 * (`apps/api/src/lib/custom-import.ts`) exactly, since hand-rolled/AI-generated HTML commonly
 * identifies inputs by `id` alone. */
function listFormFields(html: string, index: number): string[] {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelectorAll("form")[index];
  if (!form) return [];
  return [...form.querySelectorAll("input, textarea, select")]
    .map((el) => el.getAttribute("name") ?? el.getAttribute("id") ?? "")
    .filter((name) => name.length > 0);
}

// Best-effort substrings per canonical target, checked case-insensitively against each
// detected field identifier. A canonical field is only pre-selected when exactly one
// detected identifier matches — an ambiguous match is left unmapped rather than guessed
// wrong, since a wrong auto-map silently miscaptures lead data.
const GUESS_SUBSTRINGS: Record<(typeof CANONICAL_FIELDS)[number], string[]> = {
  fullName: ["name", "ten", "hoten", "fullname"],
  phone: ["phone", "sdt", "dienthoai", "tel"],
  email: ["mail"],
  persona: ["persona", "vaitro", "nhucau"]
};

function guessMapping(fields: string[]): Record<string, string> {
  const guess: Record<string, string> = {};
  for (const canonical of CANONICAL_FIELDS) {
    const substrings = GUESS_SUBSTRINGS[canonical];
    const matches = fields.filter((field) => {
      const lower = field.toLowerCase();
      return substrings.some((s) => lower.includes(s));
    });
    const [match] = matches;
    if (matches.length === 1 && match) guess[canonical] = match;
  }
  return guess;
}

function FormMappingRow({
  form,
  index,
  html,
  onWire,
  wiring
}: {
  form: DetectedForm;
  index: number;
  html: string;
  onWire: (input: WireLeadFormInput) => void;
  wiring: boolean;
}) {
  const fields = useMemo(() => listFormFields(html, index), [html, index]);
  const [mapping, setMapping] = useState<Record<string, string>>(() =>
    guessMapping(fields)
  );
  // `html` arrives from a separate, slower-resolving query than the fields it's derived
  // from, so the fields list used above can start empty and fill in on a later render —
  // re-guess once when that happens. This is the "adjust state during render" pattern
  // (React docs), not an effect, so it never fights a user's own edits once fields settle.
  const [guessedFor, setGuessedFor] = useState(() => fields.join(","));
  const fieldsKey = fields.join(",");
  if (fieldsKey !== guessedFor) {
    setGuessedFor(fieldsKey);
    setMapping(guessMapping(fields));
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border p-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Form #{index + 1}</span>
        {form.wired ? (
          <Badge variant="outline">Đã kết nối</Badge>
        ) : (
          <Badge variant="outline">Chưa kết nối</Badge>
        )}
      </div>
      {!form.wired ? (
        <>
          {CANONICAL_FIELDS.map((canonical) => (
            <div key={canonical} className="flex items-center gap-2 text-xs">
              <span className="w-24 shrink-0">
                {CANONICAL_LABEL[canonical]}
              </span>
              <Select
                value={mapping[canonical] ?? ""}
                onValueChange={(value) =>
                  setMapping((prev) => ({ ...prev, [canonical]: value ?? "" }))
                }
              >
                <SelectTrigger className="h-8 flex-1">
                  <SelectValue placeholder="(không map)" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button
            size="sm"
            disabled={wiring}
            onClick={() =>
              onWire({
                selector: form.selector,
                fieldMapping: {
                  fullName: mapping.fullName || undefined,
                  phone: mapping.phone || undefined,
                  email: mapping.email || undefined,
                  persona: mapping.persona || undefined
                }
              })
            }
          >
            Kết nối biểu mẫu khách hàng
          </Button>
        </>
      ) : null}
    </div>
  );
}

export function LeadFormWizard({
  html,
  detectedForms,
  onWire,
  wiring
}: {
  html: string;
  detectedForms: DetectedForm[];
  onWire: (input: WireLeadFormInput) => void;
  wiring: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {detectedForms.map((form, index) => (
        <FormMappingRow
          key={form.selector}
          form={form}
          index={index}
          html={html}
          onWire={onWire}
          wiring={wiring}
        />
      ))}
    </div>
  );
}
