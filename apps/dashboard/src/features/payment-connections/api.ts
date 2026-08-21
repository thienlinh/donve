import {
  paymentConnectionGuideSchema,
  publicPaymentConnectionSchema,
  type ConnectPaymentConnectionInput,
  type PaymentConnectionGuide,
  type PublicPaymentConnection
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/ai-connections/api.ts` — cookie session lives on the API origin. */
async function paymentsFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/payments${path}`,
    { ...init, credentials: "include", headers }
  );
  if (!res.ok) throw new Error(`payments api ${path} failed: ${res.status}`);
  return res;
}

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
