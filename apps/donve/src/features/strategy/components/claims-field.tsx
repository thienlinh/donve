import type { StrategyBrief } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Trash2 } from "lucide-react";

type Claim = StrategyBrief["message"]["supportingClaims"][number];

/** Product principle #6: every claim carries `evidenceRef` — the UI enforces this can't
 * silently become an empty string, matching the Strategy Agent prompt's own rule. */
export function ClaimsField({
  claims,
  onChange
}: {
  claims: Claim[];
  onChange: (claims: Claim[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">
        Supporting claims (mỗi claim cần evidenceRef)
      </span>
      {claims.map((claim, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={claim.claim}
            placeholder="Claim"
            onChange={(e) => {
              const next = [...claims];
              next[index] = { ...claim, claim: e.target.value };
              onChange(next);
            }}
          />
          <Input
            value={claim.evidenceRef}
            placeholder="evidenceRef"
            className="max-w-40"
            onChange={(e) => {
              const next = [...claims];
              next[index] = { ...claim, evidenceRef: e.target.value };
              onChange(next);
            }}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(claims.filter((_, i) => i !== index))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => onChange([...claims, { claim: "", evidenceRef: "" }])}
      >
        + Claim
      </Button>
    </div>
  );
}
