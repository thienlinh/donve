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
 * that's only ever needed live at wiring time, never after. */
function listFormFields(html: string, index: number): string[] {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelectorAll("form")[index];
  if (!form) return [];
  return [...form.querySelectorAll("input, textarea, select")]
    .map((el) => el.getAttribute("name") ?? "")
    .filter((name) => name.length > 0);
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
  const [mapping, setMapping] = useState<Record<string, string>>({});

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
            Kết nối Lead Capture
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
