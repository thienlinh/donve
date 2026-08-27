import type { CampaignWithProducts } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@dv/ui/components/shadcn/popover";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, X } from "lucide-react";
import { useState } from "react";

import {
  useActiveOrganizationQuery,
  useSessionQuery
} from "@/features/auth/queries";
import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import { fetchProducts } from "@/features/products/api";
import { productKeys } from "@/features/products/query-keys";
import * as m from "@/paraglide/messages.js";

import { createSavedView, deleteSavedView, fetchSavedViews } from "../api";
import { emptyLeadFilters, type LeadFilterState } from "../filters";
import { leadKeys } from "../query-keys";

/** `savedView.filterJson` is stored as exactly `currentFilters` (a `LeadFilterState`) at save
 * time — `jsonRecordSchema` on the wire just means the contract can't pin down the shape, so
 * this re-validates the known string fields defensively instead of trusting a blind cast. */
function filterJsonToState(
  filterJson: Record<string, unknown>
): LeadFilterState {
  const asString = (key: Exclude<keyof LeadFilterState, "repeatCustomer">) =>
    typeof filterJson[key] === "string"
      ? filterJson[key]
      : emptyLeadFilters[key];
  return {
    search: asString("search"),
    campaignId: asString("campaignId"),
    productId: asString("productId"),
    utmSource: asString("utmSource"),
    assigneeId: asString("assigneeId"),
    paid: asString("paid") as LeadFilterState["paid"],
    repeatCustomer: filterJson.repeatCustomer === true,
    dateFrom: asString("dateFrom"),
    dateTo: asString("dateTo")
  };
}

export function LeadsFilterBar({
  value,
  onChange,
  onApplySavedView
}: {
  value: LeadFilterState;
  onChange: (next: LeadFilterState) => void;
  onApplySavedView: (filters: LeadFilterState) => void;
}) {
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns
  });
  const { data: products } = useQuery({
    queryKey: productKeys.list(),
    queryFn: fetchProducts
  });
  const { data: activeOrganization } = useActiveOrganizationQuery();

  function set<K extends keyof LeadFilterState>(
    key: K,
    fieldValue: LeadFilterState[K]
  ) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-48 flex-1 flex-col gap-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="leads-search">
          {m.leadsFilterSearchLabel()}
        </label>
        <Input
          id="leads-search"
          value={value.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder={m.leadsFilterSearchPlaceholder()}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="leads-campaign"
        >
          {m.leadsFilterCampaignLabel()}
        </label>
        <NativeSelect
          id="leads-campaign"
          value={value.campaignId}
          onChange={(e) => set("campaignId", e.target.value)}
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
        <label
          className="text-xs text-muted-foreground"
          htmlFor="leads-product"
        >
          {m.leadsFilterProductLabel()}
        </label>
        <NativeSelect
          id="leads-product"
          value={value.productId}
          onChange={(e) => set("productId", e.target.value)}
        >
          <NativeSelectOption value="">{m.commonAll()}</NativeSelectOption>
          {products?.map((product) => (
            <NativeSelectOption key={product.id} value={product.id}>
              {product.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex min-w-32 flex-col gap-1.5">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="leads-utm-source"
        >
          {m.leadsFilterUtmSourceLabel()}
        </label>
        <Input
          id="leads-utm-source"
          value={value.utmSource}
          onChange={(e) => set("utmSource", e.target.value)}
          placeholder={m.leadsFilterUtmSourcePlaceholder()}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="leads-assignee"
        >
          {m.leadsFilterAssigneeLabel()}
        </label>
        <NativeSelect
          id="leads-assignee"
          value={value.assigneeId}
          onChange={(e) => set("assigneeId", e.target.value)}
        >
          <NativeSelectOption value="">{m.commonAll()}</NativeSelectOption>
          <NativeSelectOption value="unassigned">
            {m.leadsUnassigned()}
          </NativeSelectOption>
          {activeOrganization?.members.map((member) => (
            <NativeSelectOption key={member.id} value={member.userId}>
              {member.user.name || member.user.email}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="leads-paid">
          {m.leadsFilterPaidLabel()}
        </label>
        <NativeSelect
          id="leads-paid"
          value={value.paid}
          onChange={(e) =>
            set("paid", e.target.value as LeadFilterState["paid"])
          }
        >
          <NativeSelectOption value="">{m.commonAll()}</NativeSelectOption>
          <NativeSelectOption value="true">
            {m.leadsFilterPaidYes()}
          </NativeSelectOption>
          <NativeSelectOption value="false">
            {m.leadsFilterPaidNo()}
          </NativeSelectOption>
        </NativeSelect>
      </div>
      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <Checkbox
          checked={value.repeatCustomer}
          onCheckedChange={(checked) => set("repeatCustomer", checked)}
        />
        {m.leadsFilterRepeatCustomerLabel()}
      </label>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="leads-date-from"
        >
          {m.leadsFilterDateFromLabel()}
        </label>
        <Input
          id="leads-date-from"
          type="date"
          value={value.dateFrom}
          onChange={(e) => set("dateFrom", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="leads-date-to"
        >
          {m.leadsFilterDateToLabel()}
        </label>
        <Input
          id="leads-date-to"
          type="date"
          value={value.dateTo}
          onChange={(e) => set("dateTo", e.target.value)}
        />
      </div>

      <SavedViewsBar currentFilters={value} onApply={onApplySavedView} />
    </div>
  );
}

/** "Lưu view" popover + the row of saved-view chips — a filter-bar snapshot (`filterJson`)
 * shared org-wide or private to the saving user. */
function SavedViewsBar({
  currentFilters,
  onApply
}: {
  currentFilters: LeadFilterState;
  onApply: (filters: LeadFilterState) => void;
}) {
  const queryClient = useQueryClient();
  const { data: session } = useSessionQuery();
  const { data: activeOrganization } = useActiveOrganizationQuery();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canShare =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [shared, setShared] = useState(false);

  const { data: savedViews } = useQuery({
    queryKey: leadKeys.savedViews(),
    queryFn: fetchSavedViews
  });

  const create = useMutation({
    mutationFn: () =>
      createSavedView({
        name: name.trim(),
        filterJson: currentFilters as unknown as Record<string, unknown>,
        shared
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.savedViews() });
      setOpen(false);
      setName("");
      setShared(false);
    },
    onError: () =>
      toast.add({ title: m.leadsSavedViewSaveErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteSavedView(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: leadKeys.savedViews() })
  });

  return (
    <div className="flex w-full flex-wrap items-center gap-2 border-t pt-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button size="sm" variant="outline">
              <Bookmark /> {m.leadsSavedViewSaveButton()}
            </Button>
          }
        />
        <PopoverContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="saved-view-name">
                {m.leadsSavedViewNameLabel()}
              </Label>
              <Input
                id="saved-view-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={m.leadsSavedViewNamePlaceholder()}
              />
            </div>
            {canShare && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={shared}
                  onCheckedChange={(checked) => setShared(checked)}
                />
                {m.leadsSavedViewShareLabel()}
              </label>
            )}
            <Button
              size="sm"
              disabled={!name.trim() || create.isPending}
              onClick={() => create.mutate()}
            >
              {create.isPending
                ? m.commonLoading()
                : m.leadsSavedViewSaveConfirm()}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {savedViews?.map((savedView) => (
        <span
          key={savedView.id}
          className="flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-xs"
        >
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => onApply(filterJsonToState(savedView.filterJson))}
          >
            {savedView.name}
          </button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={m.leadsSavedViewDeleteLabel()}
            disabled={remove.isPending}
            onClick={() => remove.mutate(savedView.id)}
          >
            <X />
          </Button>
        </span>
      ))}
    </div>
  );
}
