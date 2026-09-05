import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  LoaderCircle
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { authClient } from "@/features/auth/auth-client";
import { fetchOrganizations } from "@/features/auth/queries";
import { createCampaign } from "@/features/campaigns/api";
import { createProduct } from "@/features/products/api";
import { createManualLandingPage } from "@/features/studio/api";
import { queryClient } from "@/lib/query-client";
import * as m from "@/paraglide/messages.js";

const DRAFT_KEY = "donve-first-offer-draft";
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

const setupSchema = z.object({
  workspaceName: z.string().trim().min(1, "Nhập tên cửa hàng của bạn"),
  productType: z.enum(["course", "service", "product", "other"]),
  productName: z.string().trim().min(1, "Nhập tên offer"),
  audience: z.string().trim().min(1, "Mô tả khách hàng bạn muốn giúp"),
  outcome: z.string().trim().min(1, "Mô tả kết quả khách nhận được"),
  description: z.string().trim().min(1, "Thêm mô tả ngắn cho offer"),
  price: z.coerce.number().int().nonnegative("Giá không hợp lệ"),
  delivery: z.enum(["link", "zalo", "schedule", "manual"]),
  channel: z.enum(["tiktok_bio", "tiktok_video", "facebook", "zalo", "direct"])
});

type SetupProgress = {
  organizationId?: string;
  productId?: string;
  campaignId?: string;
  landingId?: string;
};
type SetupValues = z.infer<typeof setupSchema>;

const defaultValues: SetupValues = {
  workspaceName: "",
  productType: "course",
  productName: "",
  audience: "",
  outcome: "",
  description: "",
  price: 0,
  delivery: "link",
  channel: "tiktok_bio"
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const productTypes = [
  ["course", "Khóa học"],
  ["service", "Coaching / dịch vụ"],
  ["product", "Sản phẩm số"],
  ["other", "Khác"]
] as const;

const deliveryOptions = [
  ["link", "Gửi link hoặc tài liệu"],
  ["zalo", "Mời vào nhóm Zalo"],
  ["schedule", "Đặt lịch hẹn"],
  ["manual", "Tôi tự giao sau"]
] as const;

const channelOptions = [
  ["tiktok_bio", "TikTok bio"],
  ["tiktok_video", "TikTok video"],
  ["facebook", "Facebook"],
  ["zalo", "Zalo"],
  ["direct", "Gửi trực tiếp"]
] as const;

const stepTitles = [
  "Bạn đang bán gì?",
  "Mô tả offer",
  "Cách nhận khách",
  "Kiểm tra và tạo"
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => readDraft());
  const { values } = draft;
  const [progress, setProgress] = useState<SetupProgress>(draft.progress);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...values, ...progress })
    );
  }, [progress, values]);

  const update = <K extends keyof SetupValues>(key: K, value: SetupValues[K]) =>
    setDraft((current) => ({
      ...current,
      values: { ...current.values, [key]: value }
    }));

  const stepError = useMemo(() => validateStep(step, values), [step, values]);

  function next() {
    setError(null);
    if (stepError) {
      setError(stepError);
      return;
    }
    setStep((current) => Math.min(current + 1, stepTitles.length - 1));
  }

  function back() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit() {
    const parsed = setupSchema.safeParse(values);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Kiểm tra lại thông tin offer"
      );
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      let currentProgress = progress;
      const organizations = await fetchOrganizations();
      const existingOrganization =
        (currentProgress.organizationId &&
          organizations.find(
            (organization) => organization.id === currentProgress.organizationId
          )) ??
        organizations.find(
          (organization) => organization.name === values.workspaceName
        );
      const organization =
        existingOrganization ??
        (
          await authClient.organization.create({
            name: values.workspaceName,
            slug: slugify(values.workspaceName)
          })
        ).data;
      if (!organization) {
        throw new Error("Chưa tạo được workspace");
      }
      await authClient.organization.setActive({
        organizationId: organization.id
      });
      currentProgress = { ...currentProgress, organizationId: organization.id };
      setProgress(currentProgress);
      await queryClient.invalidateQueries();

      const productId = currentProgress.productId
        ? currentProgress.productId
        : (
            await createProduct({
              type: values.productType,
              name: values.productName,
              price: values.price,
              description: values.description,
              images: [],
              attributes: {
                audience: values.audience,
                outcome: values.outcome,
                fulfillmentType: values.delivery,
                salesChannel: values.channel
              },
              isActive: true
            })
          ).id;
      currentProgress = { ...currentProgress, productId };
      setProgress(currentProgress);

      const campaignId = currentProgress.campaignId
        ? currentProgress.campaignId
        : (
            await createCampaign({
              assignmentMode: "manual",
              name: values.productName,
              status: "draft",
              goal: `${values.audience} nhận được ${values.outcome}`,
              formConfig: {
                fields: [
                  {
                    key: "fullName",
                    label: "Họ và tên",
                    type: "text",
                    required: true
                  },
                  {
                    key: "phone",
                    label: "Số điện thoại",
                    type: "tel",
                    required: true
                  },
                  {
                    key: "email",
                    label: "Email",
                    type: "email",
                    required: false
                  }
                ],
                popups: {}
              },
              paymentConfig: {
                enabled: false,
                amountSource: "product",
                transferPrefix: slugify(values.productName).slice(0, 24)
              },
              productIds: [productId]
            })
          ).id;
      currentProgress = { ...currentProgress, campaignId };
      setProgress(currentProgress);

      const landingId = currentProgress.landingId
        ? currentProgress.landingId
        : (
            await createManualLandingPage({
              name: `Trang bán ${values.productName}`,
              campaignId
            })
          ).id;
      window.localStorage.removeItem(DRAFT_KEY);
      await queryClient.invalidateQueries();
      await navigate({ to: "/offers/$id", params: { id: landingId } });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Chưa tạo được offer. Bạn có thể thử lại ngay."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section className="space-y-6 lg:pt-8">
          <div className="space-y-3">
            <p className="text-sm font-medium text-brand">{m.appName()}</p>
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Từ ý tưởng đến offer đầu tiên, không cần học module.
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Trả lời vài câu hỏi về việc bạn đang bán. Đơn Về sẽ dựng trang
              bán, form nhận lead, mã đơn và bước nhận tiền để bạn kiểm tra
              trước khi chia sẻ.
            </p>
          </div>
          <ol aria-label="Tiến độ tạo offer" className="space-y-3 text-sm">
            {stepTitles.map((title, index) => (
              <li className="flex items-start gap-3" key={title}>
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${index <= step ? "border-brand bg-brand text-brand-foreground" : "text-muted-foreground"}`}
                >
                  {index < step ? (
                    <Check aria-hidden className="size-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={
                    index === step ? "font-medium" : "text-muted-foreground"
                  }
                >
                  {title}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{stepTitles[step]}</CardTitle>
            <CardDescription>
              Bước {step + 1}/{stepTitles.length} · Bạn có thể quay lại sửa
              trước khi tạo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && <WhatSelling values={values} update={update} />}
            {step === 1 && <OfferDetails values={values} update={update} />}
            {step === 2 && <DeliveryDetails values={values} update={update} />}
            {step === 3 && <Review values={values} />}
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button
                disabled={step === 0 || isSubmitting}
                onClick={back}
                variant="ghost"
              >
                <ArrowLeft /> Quay lại
              </Button>
              {step < stepTitles.length - 1 ? (
                <Button onClick={next}>
                  Tiếp tục <ArrowRight />
                </Button>
              ) : (
                <Button disabled={isSubmitting} onClick={() => void submit()}>
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <CircleCheck />
                  )}
                  {isSubmitting ? "Đang tạo offer…" : "Tạo offer nháp"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function WhatSelling({ values, update }: FormProps) {
  return (
    <div className="space-y-5">
      <Field label="Tên cửa hàng hoặc workspace" htmlFor="workspaceName">
        <Input
          id="workspaceName"
          value={values.workspaceName}
          onChange={(event) => update("workspaceName", event.target.value)}
          placeholder="Ví dụ: Phương Mai Education"
        />
      </Field>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Bạn đang muốn bán gì?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {productTypes.map(([value, label]) => (
            <button
              className={`rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${values.productType === value ? "border-brand bg-brand-muted/40" : ""}`}
              key={value}
              onClick={() => update("productType", value)}
              type="button"
            >
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function OfferDetails({ values, update }: FormProps) {
  return (
    <div className="space-y-5">
      <Field label="Tên offer" htmlFor="productName">
        <Input
          id="productName"
          value={values.productName}
          onChange={(event) => update("productName", event.target.value)}
          placeholder="Ví dụ: Khóa học Xây kênh viral"
        />
      </Field>
      <Field label="Dành cho ai?" htmlFor="audience">
        <Textarea
          id="audience"
          rows={3}
          value={values.audience}
          onChange={(event) => update("audience", event.target.value)}
          placeholder="Ví dụ: Chủ shop mới bán hàng qua TikTok"
        />
      </Field>
      <Field label="Kết quả khách nhận được" htmlFor="outcome">
        <Textarea
          id="outcome"
          rows={3}
          value={values.outcome}
          onChange={(event) => update("outcome", event.target.value)}
          placeholder="Ví dụ: Có lịch nội dung 30 ngày và biết cách chốt đơn"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Giá (VND)" htmlFor="price">
          <Input
            id="price"
            inputMode="numeric"
            min="0"
            type="number"
            value={values.price}
            onChange={(event) => update("price", Number(event.target.value))}
          />
        </Field>
        <Field label="Mô tả ngắn" htmlFor="description">
          <Input
            id="description"
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Một câu dễ hiểu"
          />
        </Field>
      </div>
    </div>
  );
}

function DeliveryDetails({ values, update }: FormProps) {
  return (
    <div className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">
          Sau khi khách thanh toán, bạn giao thế nào?
        </legend>
        <div className="grid gap-2">
          {deliveryOptions.map(([value, label]) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-muted/40"
              key={value}
            >
              <input
                checked={values.delivery === value}
                className="accent-brand"
                name="delivery"
                onChange={() => update("delivery", value)}
                type="radio"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">
          Bạn sẽ chia sẻ offer từ đâu?
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {channelOptions.map(([value, label]) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-muted/40"
              key={value}
            >
              <input
                checked={values.channel === value}
                className="accent-brand"
                name="channel"
                onChange={() => update("channel", value)}
                type="radio"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function Review({ values }: { values: SetupValues }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-lg font-semibold">
          {values.productName || "Offer chưa đặt tên"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {values.description}
        </p>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <ReviewItem label="Khách hàng" value={values.audience} />
        <ReviewItem label="Kết quả" value={values.outcome} />
        <ReviewItem
          label="Giá"
          value={`${values.price.toLocaleString("vi-VN")} VND`}
        />
        <ReviewItem
          label="Kênh chính"
          value={
            channelOptions.find(([value]) => value === values.channel)?.[1] ??
            values.channel
          }
        />
        <ReviewItem
          label="Cách giao"
          value={
            deliveryOptions.find(([value]) => value === values.delivery)?.[1] ??
            values.delivery
          }
        />
      </dl>
      <p className="text-sm text-muted-foreground">
        Offer sẽ được tạo ở trạng thái nháp. Bạn sẽ kiểm tra trang mobile, form
        test, mã QR và bước giao trước khi publish.
      </p>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "Chưa nhập"}</dd>
    </div>
  );
}

type FormProps = {
  values: SetupValues;
  update: <K extends keyof SetupValues>(key: K, value: SetupValues[K]) => void;
};
function Field({
  label,
  htmlFor,
  children
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function validateStep(step: number, values: SetupValues): string | null {
  const fields: (keyof SetupValues)[][] = [
    ["workspaceName"],
    ["productName", "audience", "outcome", "description", "price"],
    ["delivery", "channel"],
    []
  ];
  const partial = setupSchema.safeParse(values);
  if (step === 3 || partial.success) return null;
  const fieldSet = new Set(fields[step]);
  const issue = partial.error.issues.find((item) =>
    fieldSet.has(item.path[0] as keyof SetupValues)
  );
  return issue?.message ?? null;
}

function readDraft(): { values: SetupValues; progress: SetupProgress } {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return { values: defaultValues, progress: {} };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const values = setupSchema.partial().parse(parsed);
    const progress: SetupProgress = {
      organizationId:
        typeof parsed.organizationId === "string"
          ? parsed.organizationId
          : undefined,
      productId:
        typeof parsed.productId === "string" ? parsed.productId : undefined,
      campaignId:
        typeof parsed.campaignId === "string" ? parsed.campaignId : undefined,
      landingId:
        typeof parsed.landingId === "string" ? parsed.landingId : undefined
    };
    return { values: { ...defaultValues, ...values }, progress };
  } catch {
    return { values: defaultValues, progress: {} };
  }
}
