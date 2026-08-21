import { connectPaymentConnectionSchema } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Landmark } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as m from "@/paraglide/messages.js";

import { connectPaymentConnection } from "../api";
import { paymentConnectionKeys } from "../query-keys";

/** Non-custodial BYOK-style connect flow (business-analysis.md §4.4, FR-D-15) — mirrors `ConnectAiDialog`. */
export function ConnectPaymentDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(connectPaymentConnectionSchema),
    defaultValues: {
      bankBin: "",
      accountNumber: "",
      accountName: "",
      apiKey: ""
    }
  });

  const connect = useMutation({
    mutationFn: connectPaymentConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentConnectionKeys.list() });
      reset();
      setOpen(false);
    },
    onError: () => setServerError(m.paymentConnectErrorToast())
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    connect.mutate(values);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <Landmark /> {m.paymentConnectButton()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.paymentConnectDialogTitle()}</DialogTitle>
          <DialogDescription>
            {m.paymentConnectDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-bank-bin">{m.paymentBankBinLabel()}</Label>
            <Input
              id="payment-bank-bin"
              inputMode="numeric"
              className="w-full"
              {...register("bankBin")}
            />
            {errors.bankBin && (
              <p className="text-xs text-destructive">
                {errors.bankBin.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-account-number">
              {m.paymentAccountNumberLabel()}
            </Label>
            <Input
              id="payment-account-number"
              className="w-full"
              {...register("accountNumber")}
            />
            {errors.accountNumber && (
              <p className="text-xs text-destructive">
                {errors.accountNumber.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-account-name">
              {m.paymentAccountNameLabel()}
            </Label>
            <Input
              id="payment-account-name"
              className="w-full"
              {...register("accountName")}
            />
            {errors.accountName && (
              <p className="text-xs text-destructive">
                {errors.accountName.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-api-key">{m.paymentApiKeyLabel()}</Label>
            <Input
              id="payment-api-key"
              type="password"
              autoComplete="off"
              className="w-full"
              {...register("apiKey")}
            />
            {errors.apiKey && (
              <p className="text-xs text-destructive">
                {errors.apiKey.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-xs text-destructive">{serverError}</p>
          )}
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {m.commonCancel()}
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting || connect.isPending}>
              {isSubmitting || connect.isPending
                ? m.commonLoading()
                : m.paymentConnectSubmit()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
