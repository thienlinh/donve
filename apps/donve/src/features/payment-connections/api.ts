import {
  paymentConnectionGuideSchema,
  publicPaymentConnectionSchema,
  type ConnectPaymentConnectionInput,
  type PaymentConnectionGuide,
  type PublicPaymentConnection
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const paymentsFetch = createApiFetch("payments");

const connectionListResponseSchema = z.object({
  connections: z.array(publicPaymentConnectionSchema)
});

export async function fetchPaymentConnections(): Promise<
  PublicPaymentConnection[]
> {
  const res = await paymentsFetch("/connections");
  return connectionListResponseSchema.parse(await res.json()).connections;
}

export async function fetchPaymentConnectionGuide(): Promise<PaymentConnectionGuide> {
  const res = await paymentsFetch("/connections/guide");
  return paymentConnectionGuideSchema.parse(await res.json());
}

export async function connectPaymentConnection(
  input: ConnectPaymentConnectionInput
): Promise<PublicPaymentConnection> {
  const res = await paymentsFetch("/connections", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return publicPaymentConnectionSchema.parse(await res.json());
}

export async function removePaymentConnection(id: string): Promise<void> {
  await paymentsFetch(`/connections/${id}`, { method: "DELETE" });
}
