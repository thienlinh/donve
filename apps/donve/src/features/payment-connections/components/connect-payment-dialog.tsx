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
              aria-describedby={
                errors.bankBin ? "payment-bank-bin-error" : undefined
              }
              aria-invalid={Boolean(errors.bankBin)}
              className="w-full"
              {...register("bankBin")}
            />
            {errors.bankBin && (
              <p
                className="text-xs text-destructive"
                id="payment-bank-bin-error"
                role="alert"
              >
                {paymentValidationMessage(errors.bankBin.message)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-account-number">
              {m.paymentAccountNumberLabel()}
            </Label>
            <Input
              id="payment-account-number"
              aria-describedby={
                errors.accountNumber
                  ? "payment-account-number-error"
                  : undefined
              }
              aria-invalid={Boolean(errors.accountNumber)}
              className="w-full"
              {...register("accountNumber")}
            />
            {errors.accountNumber && (
              <p
                className="text-xs text-destructive"
                id="payment-account-number-error"
                role="alert"
              >
                {paymentValidationMessage(errors.accountNumber.message)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-account-name">
              {m.paymentAccountNameLabel()}
            </Label>
            <Input
              id="payment-account-name"
              aria-describedby={
                errors.accountName ? "payment-account-name-error" : undefined
              }
              aria-invalid={Boolean(errors.accountName)}
              className="w-full"
              {...register("accountName")}
            />
            {errors.accountName && (
              <p
                className="text-xs text-destructive"
                id="payment-account-name-error"
                role="alert"
              >
                {paymentValidationMessage(errors.accountName.message)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-api-key">{m.paymentApiKeyLabel()}</Label>
            <Input
              id="payment-api-key"
              type="password"
              autoComplete="off"
              aria-describedby={
                errors.apiKey ? "payment-api-key-error" : undefined
              }
              aria-invalid={Boolean(errors.apiKey)}
              className="w-full"
              {...register("apiKey")}
            />
            {errors.apiKey && (
              <p
                className="text-xs text-destructive"
                id="payment-api-key-error"
                role="alert"
              >
                {paymentValidationMessage(errors.apiKey.message)}
              </p>
            )}
          </div>
          {serverError && (
            <p
              className="text-xs text-destructive"
              role="alert"
              aria-live="polite"
            >
              {serverError}
            </p>
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

function paymentValidationMessage(message?: string) {
  switch (message) {
    case "bankBin must be 6 digits":
      return "Nhập mã ngân hàng gồm 6 chữ số.";
    case "Too small: expected string to have >=1 characters":
      return "Trường này không được để trống.";
    default:
      return message ?? "Kiểm tra lại thông tin.";
  }
}
