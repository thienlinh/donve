import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  AssignmentRule,
  AssignmentRuleStrategy,
  CampaignWithProducts,
  UpsertAssignmentRuleInput
} from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, ListChecks, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { QueryState } from "@/components/query-state";
import { SettingsForbidden } from "@/components/settings-forbidden";
import { useActiveOrganizationQuery } from "@/features/auth/queries";
import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import { useCanManageOrg } from "@/hooks/use-can-manage-org";
import * as m from "@/paraglide/messages.js";

import {
  createAssignmentRule,
  deleteAssignmentRule,
  fetchAssignmentRules,
  updateAssignmentRule
} from "../../api";
import { leadKeys } from "../../query-keys";
import { LeadsPageLayout } from "../leads-page-layout";

const STRATEGIES: AssignmentRuleStrategy[] = [
  "round_robin",
  "least_active_leads",
  "fixed_assignee"
];

const strategyLabel: Record<AssignmentRuleStrategy, () => string> = {
  round_robin: m.leadsAssignmentStrategyRoundRobin,
  least_active_leads: m.leadsAssignmentStrategyLeastActive,
  fixed_assignee: m.leadsAssignmentStrategyFixed
};

/** Settings-gated (owner/admin only, same role check `settings-page.tsx`/`members-page.tsx`
 * use) drag-to-reorder list of auto-assignment rules, evaluated in `priority` order. */
export function AssignmentRulesPage() {
  const canManage = useCanManageOrg();

  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AssignmentRule | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const { data: rules, isPending } = useQuery({
    queryKey: leadKeys.assignmentRules(),
    queryFn: fetchAssignmentRules,
    enabled: canManage
  });

  const reorder = useMutation({
    mutationFn: (updates: { id: string; priority: number }[]) =>
      Promise.all(
        updates.map(({ id, priority }) =>
          updateAssignmentRule(id, { priority })
        )
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: leadKeys.assignmentRules() }),
    onError: () =>
      toast.add({ title: m.leadsAssignmentReorderErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAssignmentRule(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: leadKeys.assignmentRules() }),
    onError: () =>
      toast.add({ title: m.leadsAssignmentDeleteErrorToast(), type: "error" })
  });

  const ruleIds = useMemo(() => rules?.map((rule) => rule.id) ?? [], [rules]);

  if (!canManage) {
    return (
      <LeadsPageLayout>
        <SettingsForbidden />
      </LeadsPageLayout>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!rules || !event.over || event.active.id === event.over.id) return;
    const oldIndex = rules.findIndex((r) => r.id === event.active.id);
    const newIndex = rules.findIndex((r) => r.id === event.over?.id);
    const reordered = arrayMove(rules, oldIndex, newIndex);
    reorder.mutate(
      reordered.map((rule, index) => ({ id: rule.id, priority: index }))
    );
  }

  return (
    <LeadsPageLayout>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{m.leadsAssignmentRulesTitle()}</CardTitle>
            <CardDescription>
              {m.leadsAssignmentRulesDescription()}
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingRule(null);
              setFormOpen(true);
            }}
          >
            {m.leadsAssignmentAddRule()}
          </Button>
        </CardHeader>
        <CardContent>
          <QueryState
            isPending={isPending}
            error={null}
            isEmpty={rules?.length === 0}
            errorTitle=""
            emptyTitle={m.leadsAssignmentEmptyTitle()}
            emptyIcon={<ListChecks />}
          />

          {rules && rules.length > 0 && (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={ruleIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {rules.map((rule) => (
                    <RuleRow
                      key={rule.id}
                      rule={rule}
                      onEdit={() => {
                        setEditingRule(rule);
                        setFormOpen(true);
                      }}
                      onDelete={() => remove.mutate(rule.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <RuleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rule={editingRule}
        nextPriority={rules?.length ?? 0}
      />
    </LeadsPageLayout>
  );
}

function RuleRow({
  rule,
  onEdit,
  onDelete
}: {
  rule: AssignmentRule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: rule.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-md border p-3 ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-4" />
      </button>
      <button type="button" className="flex-1 text-left" onClick={onEdit}>
        <span className="font-medium">{strategyLabel[rule.strategy]()}</span>
        {rule.matchPersona && (
          <span className="ms-2 text-xs text-muted-foreground">
            persona: {rule.matchPersona}
          </span>
        )}
      </button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={m.leadsAssignmentRuleDeleteLabel()}
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

// One state object (not 7 separate `useState`s) — these fields all change together as a single
// form and reset together via `resetFrom`, so a combined updater keeps them consistent. Module
// scope since it captures nothing from `RuleFormDialog`'s render
// (react-doctor/prefer-module-scope-pure-function).
function formStateFrom(rule: AssignmentRule | null) {
  return {
    matchCampaignId: rule?.matchCampaignId ?? "",
    matchPersona: rule?.matchPersona ?? "",
    strategy: rule?.strategy ?? "round_robin",
    assigneePoolIds: rule?.assigneePoolIds ?? ([] as string[]),
    fixedAssigneeId: rule?.fixedAssigneeId ?? "",
    slaHours: rule?.slaHours?.toString() ?? "",
    onSlaBreach: rule?.onSlaBreach ?? ""
  };
}

function RuleFormDialog({
  open,
  onOpenChange,
  rule,
  nextPriority
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AssignmentRule | null;
  nextPriority: number;
}) {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = useActiveOrganizationQuery();
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns
  });

  const [form, setForm] = useState(() => formStateFrom(rule));
  const assigneePoolSet = new Set(form.assigneePoolIds);

  function resetFrom(nextRule: AssignmentRule | null) {
    setForm(formStateFrom(nextRule));
  }

  const save = useMutation({
    mutationFn: (input: UpsertAssignmentRuleInput) =>
      rule ? updateAssignmentRule(rule.id, input) : createAssignmentRule(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.assignmentRules() });
      onOpenChange(false);
    },
    onError: () =>
      toast.add({ title: m.leadsAssignmentSaveErrorToast(), type: "error" })
  });

  function toggleAssignee(userId: string) {
    setForm((prev) => ({
      ...prev,
      assigneePoolIds: assigneePoolSet.has(userId)
        ? prev.assigneePoolIds.filter((id) => id !== userId)
        : [...prev.assigneePoolIds, userId]
    }));
  }

  function handleSubmit() {
    save.mutate({
      priority: rule?.priority ?? nextPriority,
      matchCampaignId: form.matchCampaignId || null,
      matchPersona: form.matchPersona.trim() || null,
      strategy: form.strategy,
      assigneePoolIds: form.assigneePoolIds,
      fixedAssigneeId:
        form.strategy === "fixed_assignee"
          ? form.fixedAssigneeId || null
          : null,
      slaHours: form.slaHours ? Number(form.slaHours) : null,
      onSlaBreach: form.onSlaBreach.trim() || null
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) resetFrom(rule);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {rule ? m.leadsAssignmentEditRule() : m.leadsAssignmentAddRule()}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rule-campaign">
              {m.leadsFilterCampaignLabel()}
            </Label>
            <NativeSelect
              id="rule-campaign"
              className="w-full"
              value={form.matchCampaignId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  matchCampaignId: e.target.value
                }))
              }
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
            <Label htmlFor="rule-persona">
              {m.leadsAssignmentPersonaLabel()}
            </Label>
            <Input
              id="rule-persona"
              value={form.matchPersona}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, matchPersona: e.target.value }))
              }
              placeholder={m.leadsAssignmentPersonaPlaceholder()}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rule-strategy">
              {m.leadsAssignmentStrategyLabel()}
            </Label>
            <NativeSelect
              id="rule-strategy"
              className="w-full"
              value={form.strategy}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  strategy: e.target.value as AssignmentRuleStrategy
                }))
              }
            >
              {STRATEGIES.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {strategyLabel[value]()}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {form.strategy === "fixed_assignee" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rule-fixed-assignee">
                {m.leadsAssignmentFixedAssigneeLabel()}
              </Label>
              <NativeSelect
                id="rule-fixed-assignee"
                className="w-full"
                value={form.fixedAssigneeId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fixedAssigneeId: e.target.value
                  }))
                }
              >
                <NativeSelectOption value="">
                  {m.commonAll()}
                </NativeSelectOption>
                {activeOrganization?.members.map((member) => (
                  <NativeSelectOption key={member.id} value={member.userId}>
                    {member.user.name || member.user.email}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label>{m.leadsAssignmentPoolLabel()}</Label>
              <div className="flex flex-col gap-1.5 rounded-md border p-2">
                {activeOrganization?.members.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={assigneePoolSet.has(member.userId)}
                      onCheckedChange={() => toggleAssignee(member.userId)}
                    />
                    {member.user.name || member.user.email}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rule-sla-hours">
              {m.leadsAssignmentSlaLabel()}
            </Label>
            <Input
              id="rule-sla-hours"
              type="number"
              min={1}
              value={form.slaHours}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slaHours: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rule-sla-breach">
              {m.leadsAssignmentSlaBreachLabel()}
            </Label>
            <Input
              id="rule-sla-breach"
              value={form.onSlaBreach}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, onSlaBreach: e.target.value }))
              }
              placeholder={m.leadsAssignmentSlaBreachPlaceholder()}
            />
          </div>
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
            disabled={save.isPending}
            onClick={handleSubmit}
          >
            {save.isPending ? m.commonLoading() : m.commonSave()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
