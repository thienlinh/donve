import {
  courseAttributesSchema,
  createProductSchema,
  productTypeValues,
  type CreateProductInput,
  type Product,
  type ProductType
} from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { FormDialog } from "@/components/form-dialog";
import { fromDateInputValue, toDateInputValue } from "@/lib/date-input";
import * as m from "@/paraglide/messages.js";

import { createProduct, updateProduct } from "../api";
import { productKeys } from "../query-keys";

export const productTypeLabels: Record<ProductType, string> = {
  course: m.productsTypeCourse(),
  product: m.productsTypeProduct(),
  service: m.productsTypeService(),
  other: m.productsTypeOther()
};

/** `createProductSchema` keeps `attributes` as a generic JSONB bag on the wire (FR-C-06
 * extensibility — new product types never need a schema migration), but the form itself
 * validates course attributes against the real `courseAttributesSchema` shape. */
const productFormSchema = createProductSchema.extend({
  // Same reasoning as the campaign form's date fields — `attributes.startsAt` already arrives as
  // a real `Date | undefined` via the `fromDateInputValue` bridge, not a raw string, so this uses
  // plain `z.date()` instead of `courseAttributesSchema`'s wire-facing `z.coerce.date()`.
  attributes: courseAttributesSchema.extend({ startsAt: z.date().optional() })
});
type ProductFormValues = z.infer<typeof productFormSchema>;

/** Kept as local state — `images` only ever holds one URL here, and that's out of scope for
 * this pass (FR-C-01/02 only asked for course attributes to move onto RHF). */
interface LocalFormState {
  imageUrl: string;
}

function localStateFor(product?: Product): LocalFormState {
  return { imageUrl: product?.images[0] ?? "" };
}

function defaultValuesFor(product?: Product): ProductFormValues {
  const attrs = product?.type === "course" ? product.attributes : {};
  return {
    type: product?.type ?? "product",
    name: product?.name ?? "",
    price: product?.price ?? 0,
    description: product?.description ?? "",
    images: product?.images ?? [],
    attributes: {
      zaloGroupUrl:
        typeof attrs.zaloGroupUrl === "string" ? attrs.zaloGroupUrl : "",
      activationInstructions:
        typeof attrs.activationInstructions === "string"
          ? attrs.activationInstructions
          : "",
      startsAt:
        typeof attrs.startsAt === "string"
          ? new Date(attrs.startsAt)
          : undefined,
      classSchedule:
        typeof attrs.classSchedule === "string" ? attrs.classSchedule : ""
    },
    isActive: product?.isActive ?? true
  };
}

export function ProductFormDialog({ product }: { product?: Product }) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(() => localStateFor(product));
  const queryClient = useQueryClient();
  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    // No explicit `useForm<ProductFormValues>` — same reasoning as campaign-form-dialog: letting
    // TS infer from `resolver` + `defaultValues` avoids a spurious mismatch against the coerced
    // `price`/`attributes.startsAt` schema fields.
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValuesFor(product)
  });
  const type = watch("type");

  useEffect(() => {
    if (!open) return;
    reset(defaultValuesFor(product));
    // oxlint-disable-next-line react-doctor/no-chain-state-updates -- RHF's reset() isn't a React state setter; this is the one real setState here.
    setLocal(localStateFor(product));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resets the form to the current product only when the dialog opens
  }, [open]);

  const save = useMutation({
    mutationFn: (values: CreateProductInput) =>
      product ? updateProduct(product.id, values) : createProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.productsSaveErrorToast(), type: "error" })
  });

  const onSubmit = handleSubmit((values) => {
    save.mutate({
      ...values,
      attributes: values.type === "course" ? values.attributes : {},
      images: local.imageUrl ? [local.imageUrl] : []
    });
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          size={isEdit ? "icon-sm" : "sm"}
          variant={isEdit ? "ghost" : "default"}
        >
          {isEdit ? m.commonEdit() : m.productsAddButton()}
        </Button>
      }
      title={isEdit ? m.productsEditDialogTitle() : m.productsAddDialogTitle()}
      description={m.productsDialogDescription()}
      submitLabel={m.productsSaveSubmit()}
      isPending={isSubmitting || save.isPending}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-type">{m.productsTypeLabel()}</Label>
        <NativeSelect
          id="product-type"
          className="w-full"
          {...register("type")}
        >
          {productTypeValues.map((value) => (
            <NativeSelectOption key={value} value={value}>
              {productTypeLabels[value]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-name">{m.productsNameLabel()}</Label>
        <Input id="product-name" className="w-full" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-price">{m.productsPriceLabel()}</Label>
        <Input
          id="product-price"
          type="number"
          min={0}
          step={1000}
          className="w-full"
          {...register("price")}
        />
        {errors.price && (
          <p className="text-xs text-destructive">{errors.price.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-description">
          {m.productsDescriptionLabel()}
        </Label>
        <Textarea
          id="product-description"
          className="w-full"
          rows={3}
          {...register("description")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-image">{m.productsImageLabel()}</Label>
        <Input
          id="product-image"
          className="w-full"
          value={local.imageUrl}
          onChange={(e) =>
            setLocal((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
          placeholder="https://..."
        />
      </div>
      {type === "course" && (
        <div className="flex flex-col gap-3 rounded-md border p-3">
          <span className="text-xs font-medium text-muted-foreground">
            {m.productsCourseFieldsTitle()}
          </span>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="course-zalo">{m.productsCourseZaloLabel()}</Label>
            <Input
              id="course-zalo"
              className="w-full"
              {...register("attributes.zaloGroupUrl")}
              placeholder="https://zalo.me/g/..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="course-activation">
              {m.productsCourseActivationLabel()}
            </Label>
            <Textarea
              id="course-activation"
              className="w-full"
              rows={2}
              {...register("attributes.activationInstructions")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="course-schedule">
              {m.productsCourseClassScheduleLabel()}
            </Label>
            <Textarea
              id="course-schedule"
              className="w-full"
              rows={2}
              {...register("attributes.classSchedule")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="course-starts-at">
              {m.productsCourseStartsAtLabel()}
            </Label>
            <Controller
              control={control}
              name="attributes.startsAt"
              render={({ field }) => (
                <Input
                  id="course-starts-at"
                  type="date"
                  className="w-full"
                  value={toDateInputValue(field.value)}
                  onChange={(e) =>
                    field.onChange(
                      fromDateInputValue(e.target.value) ?? undefined
                    )
                  }
                />
              )}
            />
          </div>
        </div>
      )}
    </FormDialog>
  );
}
