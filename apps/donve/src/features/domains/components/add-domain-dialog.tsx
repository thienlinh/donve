import { createCustomDomainInputSchema } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@dv/ui/components/shadcn/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormDialog } from "@/components/form-dialog";
import { FeatureRequiredError } from "@/lib/api-client";
import { featureUpgradeCopy } from "@/lib/feature-upgrade-copy";
import * as m from "@/paraglide/messages.js";

import { fetchLandingPages } from "../../studio/api";
import { landingKeys } from "../../studio/query-keys";
import { createCustomDomain } from "../api";
import { customDomainKeys } from "../query-keys";

/** FR-G-04 — the tenant picks which already-published landing page the new domain should
 * serve; the domain itself only becomes live once Cloudflare finishes DCV + SSL issuance
 * (see `DomainRow`'s verify status). */
export function AddDomainDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: landingPages } = useQuery({
    queryKey: landingKeys.list(),
    queryFn: fetchLandingPages
  });
  const publishedPages = (landingPages ?? []).filter((p) => p.isPublished);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createCustomDomainInputSchema),
    defaultValues: { hostname: "", landingPageId: "" }
  });

  const create = useMutation({
    mutationFn: createCustomDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customDomainKeys.list() });
      reset();
      setOpen(false);
    },
    onError: (error) => {
      if (error instanceof FeatureRequiredError) {
        const { title, description } = featureUpgradeCopy(error.featureKey);
        setServerError(`${title}. ${description}`);
        return;
      }
      setServerError(m.domainsAddErrorToast());
    }
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    create.mutate(values);
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
        }
      }}
      trigger={
        <Button size="sm">
          <Globe /> {m.domainsAddButton()}
        </Button>
      }
      title={m.domainsAddDialogTitle()}
      description={m.domainsAddDialogDescription()}
      submitLabel={m.domainsAddSubmit()}
      isPending={isSubmitting || create.isPending}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="domain-hostname">{m.domainsHostnameLabel()}</Label>
        <Input
          id="domain-hostname"
          placeholder="shop.yourbrand.com"
          className="w-full"
          {...register("hostname")}
        />
        {errors.hostname && (
          <p className="text-xs text-destructive">{errors.hostname.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="domain-landing-page">
          {m.domainsLandingPageLabel()}
        </Label>
        <Controller
          control={control}
          name="landingPageId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="domain-landing-page" className="w-full">
                <SelectValue placeholder={m.domainsLandingPagePlaceholder()} />
              </SelectTrigger>
              <SelectContent>
                {publishedPages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.landingPageId && (
          <p className="text-xs text-destructive">
            {errors.landingPageId.message}
          </p>
        )}
      </div>
      {serverError && <p className="text-xs text-destructive">{serverError}</p>}
    </FormDialog>
  );
}
