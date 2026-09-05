import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";

/** One plain-text field in a Strategy Brief section (`business`, `funnel`, `offer`, …) —
 * every section is a flat `Record<string, string | undefined>` except the array fields
 * handled separately by `StringArrayField`/`ClaimsField` below. */
export function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const id = `strategy-field-${label}`;
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function StringArrayField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const id = `strategy-field-${label}`;
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value.join(", ")}
        placeholder="Ngăn cách bằng dấu phẩy"
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        }
      />
    </div>
  );
}
