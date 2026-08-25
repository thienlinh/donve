import {
  campaignAssignmentModeValues,
  campaignFormConfigSchema,
  campaignPaymentConfigSchema,
  campaignStatusValues,
  createCampaignSchema,
  type CampaignAssignmentMode,
  type CampaignFormConfig,
  type CampaignPaymentConfig,
  type CampaignStatus,
  type CampaignWithProducts,
  type CreateCampaignInput
} from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { Switch } from "@dv/ui/components/shadcn/switch";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { EntityImageField } from "@/components/entity-image-field";
import { FormDialog } from "@/components/form-dialog";
import { fetchProducts } from "@/features/products/api";
import { productKeys } from "@/features/products/query-keys";
import { fromDateInputValue, toDateInputValue } from "@/lib/date-input";
import * as m from "@/paraglide/messages.js";

import { createCampaign, updateCampaign } from "../api";
import { campaignKeys } from "../query-keys";

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  draft: m.campaignsStatusDraft(),
  active: m.campaignsStatusActive(),
  paused: m.campaignsStatusPaused(),
  ended: m.campaignsStatusEnded()
};

const campaignAssignmentModeLabels: Record<CampaignAssignmentMode, string> = {
  manual: m.campaignsAssignmentModeManual(),
  round_robin: m.campaignsAssignmentModeRoundRobin()
};

const formFieldTypeValues = ["text", "select", "checkbox"] as const;
type FormFieldType = (typeof formFieldTypeValues)[number];
const emptyPopupCopy = { title: "", body: "" };

/** RHF's own values type: same as `CreateCampaignInput` but with `startsAt`/`endsAt` as plain
 * `Date | null` (no `undefined`, so the date `<Input>` always has a defined value to control),
 * `formConfig`/`paymentConfig` filled in (not optional, so every nested field can be registered),
 * and one field the wire contract doesn't have — `utmDefaultsList`, a key/value array mirroring
 * `utmDefaults` (a `Record<string, string>`) that only gets folded back into that shape on
 * submit, the same way `formConfig.fields[].options` round-trips through comma-separated text. */
interface CampaignFormValues extends Omit<
  CreateCampaignInput,
  "startsAt" | "endsAt"
> {
  startsAt: Date | null;
  endsAt: Date | null;
  formConfig: CampaignFormConfig;
  paymentConfig: CampaignPaymentConfig;
  utmDefaultsList: { key: string; value: string }[];
}

/** `createCampaignSchema` extended with the form-only `utmDefaultsList` field so the zod
 * resolver doesn't strip it before `onSubmit` sees it (plain zod objects drop unknown keys). */
const campaignFormSchema = createCampaignSchema.extend({
  // `defaultValuesFor` always fills these in, so the form's own schema requires them (unlike
  // the wire `createCampaignSchema`, where they're optional partial-update fields) — and uses
  // plain `z.date()` instead of `z.coerce.date()` since the date `<Input>`s already hand back
  // real `Date | null` values via the `fromDateInputValue` bridge, not raw strings.
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  formConfig: campaignFormConfigSchema,
  paymentConfig: campaignPaymentConfigSchema,
  productIds: z.array(z.string()),
  utmDefaultsList: z.array(z.object({ key: z.string(), value: z.string() }))
});

function defaultValuesFor(campaign?: CampaignWithProducts): CampaignFormValues {
  return {
    name: campaign?.name ?? "",
    status: campaign?.status ?? "draft",
    goal: campaign?.goal ?? "",
    startsAt: campaign?.startsAt ?? null,
    endsAt: campaign?.endsAt ?? null,
    assignmentMode: campaign?.assignmentMode ?? "manual",
    productIds: campaign?.productIds ?? [],
    formConfig: {
      fields: (campaign?.formConfig.fields ?? []).map((field) => ({
        key: field.key,
        label: field.label ?? "",
        type: formFieldTypeValues.includes(field.type as FormFieldType)
          ? (field.type as FormFieldType)
          : "text",
        required: field.required ?? false,
        options: field.options ?? []
      })),
      popups: {
        registered: campaign?.formConfig.popups.registered ?? emptyPopupCopy,
        paid: campaign?.formConfig.popups.paid ?? emptyPopupCopy,
        manualPending:
          campaign?.formConfig.popups.manualPending ?? emptyPopupCopy
      }
    },
    paymentConfig: {
      enabled: campaign?.paymentConfig.enabled ?? false,
      bankBin: campaign?.paymentConfig.bankBin ?? "",
      accountNumber: campaign?.paymentConfig.accountNumber ?? "",
      accountName: campaign?.paymentConfig.accountName ?? "",
      sepayAuto: campaign?.paymentConfig.sepayAuto ?? false,
      zaloGroupUrl: campaign?.paymentConfig.zaloGroupUrl ?? "",
      transferPrefix: campaign?.paymentConfig.transferPrefix ?? ""
    },
    utmDefaultsList: Object.entries(campaign?.utmDefaults ?? {}).map(
      ([key, value]) => ({ key, value })
    )
  };
}

export function CampaignFormDialog({
  campaign
}: {
  campaign?: CampaignWithProducts;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = Boolean(campaign);

  const { data: products } = useQuery({
    queryKey: productKeys.list(),
    queryFn: fetchProducts
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    // No explicit `useForm<CampaignFormValues>` — letting TS infer the field-values type from
    // `resolver` + `defaultValues` together avoids a spurious mismatch between the schema's
    // input type (defaults/optionals) and `CampaignFormValues`'s fully-populated shape.
    resolver: zodResolver(campaignFormSchema),
    defaultValues: defaultValuesFor(campaign)
  });

  const formFields = useFieldArray({ control, name: "formConfig.fields" });
  const utmDefaults = useFieldArray({ control, name: "utmDefaultsList" });
  const productIds = watch("productIds");
  const paymentEnabled = watch("paymentConfig.enabled");

  useEffect(() => {
    if (!open) return;
    reset(defaultValuesFor(campaign));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resets the form to the current campaign only when the dialog opens
  }, [open]);

  const save = useMutation({
    mutationFn: (values: CreateCampaignInput) =>
      campaign ? updateCampaign(campaign.id, values) : createCampaign(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.campaignsSaveErrorToast(), type: "error" })
  });

  const onSubmit = handleSubmit((values) => {
    const utmDefaultsRecord: Record<string, string> = {};
    for (const { key, value } of values.utmDefaultsList) {
      if (key.trim()) utmDefaultsRecord[key.trim()] = value;
    }

    const popups: CampaignFormConfig["popups"] = {};
    for (const kind of ["registered", "paid", "manualPending"] as const) {
      const popup = values.formConfig.popups[kind];
      if (popup?.title.trim()) popups[kind] = popup;
    }

    save.mutate({
      name: values.name,
      status: values.status,
      goal: values.goal || null,
      assignmentMode: values.assignmentMode,
      productIds: values.productIds,
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      formConfig: {
        fields: values.formConfig.fields
          .filter((field) => field.key.trim())
          .map((field) => ({
            key: field.key.trim(),
            label: field.label || undefined,
            type: field.type,
            required: field.required,
            options: field.type === "select" ? field.options : undefined
          })),
        popups
      },
      paymentConfig: {
        enabled: values.paymentConfig.enabled,
        bankBin: values.paymentConfig.bankBin || undefined,
        accountNumber: values.paymentConfig.accountNumber || undefined,
        accountName: values.paymentConfig.accountName || undefined,
        sepayAuto: values.paymentConfig.sepayAuto,
        zaloGroupUrl: values.paymentConfig.zaloGroupUrl || undefined,
        transferPrefix: values.paymentConfig.transferPrefix || undefined
      },
      utmDefaults: utmDefaultsRecord
    });
  });

  const productIdSet = new Set(productIds);
  function toggleProduct(id: string) {
    setValue(
      "productIds",
      productIdSet.has(id)
        ? productIds.filter((p) => p !== id)
        : [...productIds, id],
      { shouldValidate: true }
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          size={isEdit ? "icon-sm" : "sm"}
          variant={isEdit ? "ghost" : "default"}
        >
          {isEdit ? m.commonEdit() : m.campaignsAddButton()}
        </Button>
      }
      title={
        isEdit ? m.campaignsEditDialogTitle() : m.campaignsAddDialogTitle()
      }
      description={m.campaignsDialogDescription()}
      submitLabel={m.campaignsSaveSubmit()}
      isPending={isSubmitting || save.isPending}
      onSubmit={onSubmit}
      contentClassName="max-h-[85vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-name">{m.campaignsNameLabel()}</Label>
        <Input id="campaign-name" className="w-full" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-status">{m.campaignsStatusLabel()}</Label>
        <NativeSelect
          id="campaign-status"
          className="w-full"
          {...register("status")}
        >
          {campaignStatusValues.map((value) => (
            <NativeSelectOption key={value} value={value}>
              {campaignStatusLabels[value]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-goal">{m.campaignsGoalLabel()}</Label>
        <Input id="campaign-goal" className="w-full" {...register("goal")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-assignment-mode">
          {m.campaignsAssignmentModeLabel()}
        </Label>
        <NativeSelect
          id="campaign-assignment-mode"
          className="w-full"
          {...register("assignmentMode")}
        >
          {campaignAssignmentModeValues.map((value) => (
            <NativeSelectOption key={value} value={value}>
              {campaignAssignmentModeLabels[value]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="campaign-starts-at">
            {m.campaignsStartsAtLabel()}
          </Label>
          <Controller
            control={control}
            name="startsAt"
            render={({ field }) => (
              <Input
                id="campaign-starts-at"
                type="date"
                className="w-full"
                value={toDateInputValue(field.value)}
                onChange={(e) =>
                  field.onChange(fromDateInputValue(e.target.value))
                }
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="campaign-ends-at">{m.campaignsEndsAtLabel()}</Label>
          <Controller
            control={control}
            name="endsAt"
            render={({ field }) => (
              <Input
                id="campaign-ends-at"
                type="date"
                className="w-full"
                value={toDateInputValue(field.value)}
                onChange={(e) =>
                  field.onChange(fromDateInputValue(e.target.value))
                }
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{m.campaignsProductsLabel()}</Label>
        <div className="flex max-h-32 flex-col gap-2 overflow-y-auto rounded-md border p-2">
          {!products || products.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              {m.campaignsProductsEmpty()}
            </span>
          ) : (
            products.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={productIdSet.has(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                />
                {product.name}
              </label>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-3">
        <span className="text-xs font-medium text-muted-foreground">
          {m.campaignsOgImageSectionTitle()}
        </span>
        {campaign ? (
          <EntityImageField
            image={{
              ownerType: "campaign",
              ownerId: campaign.id,
              kind: "og_image"
            }}
            label={m.campaignsOgImageLabel()}
            description={m.campaignsOgImageDescription()}
          />
        ) : (
          <span className="text-xs text-muted-foreground">
            {m.campaignsOgImageCreateFirstHint()}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {m.campaignsFormFieldsSectionTitle()}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              formFields.append({
                key: "",
                label: "",
                type: "text",
                required: false,
                options: []
              })
            }
          >
            <Plus /> {m.campaignsFormFieldAddButton()}
          </Button>
        </div>
        {formFields.fields.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            {m.campaignsFormFieldsEmpty()}
          </span>
        ) : (
          formFields.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 rounded-md border p-2"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Input
                  {...register(`formConfig.fields.${index}.key`)}
                  placeholder={m.campaignsFormFieldKeyPlaceholder()}
                />
                <Input
                  {...register(`formConfig.fields.${index}.label`)}
                  placeholder={m.campaignsFormFieldLabelLabel()}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <NativeSelect {...register(`formConfig.fields.${index}.type`)}>
                  <NativeSelectOption value="text">
                    {m.campaignsFormFieldTypeText()}
                  </NativeSelectOption>
                  <NativeSelectOption value="select">
                    {m.campaignsFormFieldTypeSelect()}
                  </NativeSelectOption>
                  <NativeSelectOption value="checkbox">
                    {m.campaignsFormFieldTypeCheckbox()}
                  </NativeSelectOption>
                </NativeSelect>
                <Controller
                  control={control}
                  name={`formConfig.fields.${index}.required`}
                  render={({ field: requiredField }) => (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={requiredField.value}
                        onCheckedChange={requiredField.onChange}
                      />
                      {m.campaignsFormFieldRequiredLabel()}
                    </label>
                  )}
                />
              </div>
              {watch(`formConfig.fields.${index}.type`) === "select" && (
                <Controller
                  control={control}
                  name={`formConfig.fields.${index}.options`}
                  render={({ field: optionsField }) => (
                    <Input
                      value={(optionsField.value ?? []).join(", ")}
                      onChange={(e) =>
                        optionsField.onChange(
                          e.target.value
                            .split(",")
                            .map((o) => o.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={m.campaignsFormFieldOptionsPlaceholder()}
                    />
                  )}
                />
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="self-end text-destructive"
                onClick={() => formFields.remove(index)}
              >
                <Trash2 /> {m.campaignsFormFieldRemoveLabel()}
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-3">
        <span className="text-xs font-medium text-muted-foreground">
          {m.campaignsPopupsSectionTitle()}
        </span>
        {(
          [
            ["registered", m.campaignsPopupRegisteredTitle()],
            ["paid", m.campaignsPopupPaidTitle()],
            ["manualPending", m.campaignsPopupManualPendingTitle()]
          ] as const
        ).map(([kind, title]) => (
          <div key={kind} className="flex flex-col gap-1.5">
            <Label>{title}</Label>
            <Input
              {...register(`formConfig.popups.${kind}.title`)}
              placeholder={m.campaignsPopupTitleLabel()}
            />
            <Textarea
              {...register(`formConfig.popups.${kind}.body`)}
              placeholder={m.campaignsPopupBodyLabel()}
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {m.campaignsPaymentSectionTitle()}
          </span>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="paymentConfig.enabled"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <span className="text-xs">{m.campaignsPaymentEnabledLabel()}</span>
          </div>
        </div>
        {paymentEnabled && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="campaign-bank-bin">
                  {m.campaignsBankBinLabel()}
                </Label>
                <Input
                  id="campaign-bank-bin"
                  className="w-full"
                  {...register("paymentConfig.bankBin")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="campaign-account-number">
                  {m.campaignsAccountNumberLabel()}
                </Label>
                <Input
                  id="campaign-account-number"
                  className="w-full"
                  {...register("paymentConfig.accountNumber")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="campaign-account-name">
                {m.campaignsAccountNameLabel()}
              </Label>
              <Input
                id="campaign-account-name"
                className="w-full"
                {...register("paymentConfig.accountName")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="campaign-transfer-prefix">
                {m.campaignsTransferPrefixLabel()}
              </Label>
              <Input
                id="campaign-transfer-prefix"
                className="w-full"
                {...register("paymentConfig.transferPrefix")}
              />
            </div>
            <Controller
              control={control}
              name="paymentConfig.sepayAuto"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  {m.campaignsSepayAutoLabel()}
                </label>
              )}
            />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="campaign-zalo-url">
                {m.campaignsZaloUrlLabel()}
              </Label>
              <Input
                id="campaign-zalo-url"
                className="w-full"
                {...register("paymentConfig.zaloGroupUrl")}
                placeholder="https://zalo.me/g/..."
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {m.campaignsUtmDefaultsSectionTitle()}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => utmDefaults.append({ key: "", value: "" })}
          >
            <Plus /> {m.campaignsUtmDefaultAddButton()}
          </Button>
        </div>
        {utmDefaults.fields.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            {m.campaignsUtmDefaultsEmpty()}
          </span>
        ) : (
          utmDefaults.fields.map((row, index) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input
                {...register(`utmDefaultsList.${index}.key`)}
                placeholder={m.campaignsUtmKeyPlaceholder()}
              />
              <Input
                {...register(`utmDefaultsList.${index}.value`)}
                placeholder={m.campaignsUtmValuePlaceholder()}
              />
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={m.campaignsUtmRemoveLabel()}
                className="text-destructive"
                onClick={() => utmDefaults.remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))
        )}
      </div>
    </FormDialog>
  );
}
