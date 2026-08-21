import type { CampaignWithProducts } from "@dv/contracts";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { useQuery } from "@tanstack/react-query";

import { useActiveOrganization } from "@/features/auth/auth-client";
import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import { fetchProducts } from "@/features/products/api";
import { productKeys } from "@/features/products/query-keys";
import * as m from "@/paraglide/messages.js";

import type { LeadFilterState } from "../filters";

export function LeadsFilterBar({
  value,
  onChange
}: {
  value: LeadFilterState;
  onChange: (next: LeadFilterState) => void;
}) {
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns
  });
  const { data: products } = useQuery({
    queryKey: productKeys.list(),
    queryFn: fetchProducts
  });
  const { data: activeOrganization } = useActiveOrganization();

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
    </div>
  );
}
