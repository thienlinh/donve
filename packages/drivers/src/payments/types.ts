export type PaymentProviderId = "sepay" | "vnpay" | "momo" | "casso" | "payos"

export type OrderStatus =
  | "pending"
  | "awaiting_confirmation"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded"

/** Already-decrypted per-org connection secret (paymentConnections row, key-vault decrypted by the caller) — drivers never see ciphertext or the master key. */
export interface PaymentConnectionSecrets {
  provider: PaymentProviderId
  apiKey: string
  bankBin: string
  accountNumber: string
}

export interface VerifyWebhookInput {
  headers: Record<string, string>
  rawBody: string
  connection: PaymentConnectionSecrets
}

export interface VerifiedPaymentEvent {
  provider: PaymentProviderId
  providerTxId: string
  amount: number
  /** Free-text transfer content — set by "read balance + content" providers (SePay, Casso). */
  content: string | null
  /** Order reference returned directly by gateway-callback providers (VNPAY, MoMo) — set instead of `content`. */
  orderRef: string | null
  occurredAt: Date
  rawPayload: unknown
}

export class PaymentWebhookVerificationError extends Error {}

export interface OrderMatchCandidate {
  id: string
  code: string
  amount: number
  status: OrderStatus
  expiresAt: Date | null
}

export type MatchTransactionResult =
  | { outcome: "matched"; orderId: string; matchType: "auto" | "fuzzy" }
  | {
      outcome: "unmatched"
      reason: "no_candidate" | "ambiguous" | "already_paid"
      candidateOrderIds: string[]
    }

export interface MatchTransactionInput {
  event: VerifiedPaymentEvent
  /**
   * Looks up orders by an extracted/ref code. Injected by the caller so this package never
   * depends on @dv/db — order status rules live here (FR-D-05), but the actual query and
   * org-scoping stay at the app layer inside this callback's implementation.
   */
  findOrderCandidates: (
    code: string
  ) => Promise<OrderMatchCandidate[]> | OrderMatchCandidate[]
}

export interface PaymentConnectionGuideStep {
  title: string
  body: string
  imageUrl?: string
  videoUrl?: string
}

export interface PaymentConnectionGuide {
  provider: PaymentProviderId
  steps: PaymentConnectionGuideStep[]
}

/**
 * FR-D-10: the payments driver boundary. SePay is the first concrete impl; VNPAY/MoMo/Casso/PayOS
 * add later as new impls of this same interface, never a signature change.
 */
export interface PaymentsDriver {
  readonly provider: PaymentProviderId
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedPaymentEvent>
  matchTransaction(
    input: MatchTransactionInput
  ): Promise<MatchTransactionResult>
  /** Content for the dashboard's step-by-step "connect this provider" guide (FR-D-15). */
  getConnectionGuide(): PaymentConnectionGuide
}
