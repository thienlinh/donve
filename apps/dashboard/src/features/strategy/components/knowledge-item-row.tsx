import type { KnowledgeItem, KnowledgeStatus } from "@dv/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@dv/ui/components/shadcn/select";
import { Textarea } from "@dv/ui/components/shadcn/textarea";

const STATUS_LABEL: Record<KnowledgeStatus, string> = {
  fact: "🟢 Fact",
  inference: "🟡 Suy luận",
  unknown: "⚪ Chưa rõ"
};

/**
 * `technical/ui-ux-design.md` §Wizard AI: "mỗi field có badge 🟢 Fact / 🟡 Suy luận / ⚪ Chưa
 * rõ — cần bạn xác nhận" + "Mọi field sửa tay được inline (click-to-edit)".
 */
export function KnowledgeItemRow({
  item,
  onChange
}: {
  item: KnowledgeItem;
  onChange: (next: KnowledgeItem) => void;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {item.label}
        </span>
        <Select
          value={item.status}
          onValueChange={(status) =>
            status && onChange({ ...item, status: status })
          }
        >
          <SelectTrigger size="sm" className="h-6 w-auto text-xs">
            <SelectValue>{STATUS_LABEL[item.status]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={item.value}
        onChange={(e) => onChange({ ...item, value: e.target.value })}
        rows={2}
        className="text-sm"
      />
      {item.sourceRef ? (
        <span className="text-xs text-muted-foreground">
          Nguồn: {item.sourceRef}
        </span>
      ) : null}
    </div>
  );
}
