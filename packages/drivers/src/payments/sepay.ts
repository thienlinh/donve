import { z } from "zod"

import { matchContentBasedTransaction } from "./content-based-matching.js"
import type {
  MatchTransactionInput,
  MatchTransactionResult,
  PaymentConnectionGuide,
  PaymentsDriver,
  VerifiedPaymentEvent,
  VerifyWebhookInput,
} from "./types.js"
import { PaymentWebhookVerificationError } from "./types.js"

const sepayWebhookPayloadSchema = z.object({
  id: z.union([z.string(), z.number()]),
  transferAmount: z.coerce.number(),
  content: z.string().default(""),
  transactionDate: z.string(),
})

export interface SepayDriverConfig {
  /** campaign/org `paymentConfig.transferPrefix`, e.g. "DV" — needed to scan transfer content for order codes. */
  transferPrefix: string
}

export function createSepayPaymentsDriver(
  config: SepayDriverConfig
): PaymentsDriver {
  return {
    provider: "sepay",

    async verifyWebhook(
      input: VerifyWebhookInput
    ): Promise<VerifiedPaymentEvent> {
      const authHeader =
        input.headers.authorization ?? input.headers.Authorization
      if (authHeader !== `Apikey ${input.connection.apiKey}`) {
        throw new PaymentWebhookVerificationError(
          "invalid SePay webhook Authorization header"
        )
      }

      let json: unknown
      try {
        json = JSON.parse(input.rawBody)
      } catch {
        throw new PaymentWebhookVerificationError(
          "SePay webhook body is not valid JSON"
        )
      }

      const parsed = sepayWebhookPayloadSchema.safeParse(json)
      if (!parsed.success) {
        throw new PaymentWebhookVerificationError(
          "unrecognized SePay webhook payload shape"
        )
      }

      return {
        provider: "sepay",
        providerTxId: String(parsed.data.id),
        amount: parsed.data.transferAmount,
        content: parsed.data.content,
        orderRef: null,
        occurredAt: new Date(parsed.data.transactionDate),
        rawPayload: parsed.data,
      }
    },

    matchTransaction(
      input: MatchTransactionInput
    ): Promise<MatchTransactionResult> {
      return matchContentBasedTransaction({
        ...input,
        prefix: config.transferPrefix,
      })
    },

    getConnectionGuide(): PaymentConnectionGuide {
      return {
        provider: "sepay",
        steps: [
          {
            title: "Đăng ký tài khoản SePay",
            body: "Truy cập sepay.vn, tạo tài khoản và liên kết tài khoản ngân hàng/ví muốn nhận thanh toán.",
          },
          {
            title: "Lấy API Key webhook",
            body: "Vào SePay > Cấu hình > Webhook, tạo API Key mới — đây là secret riêng chỉ tổ chức của bạn biết, không chia sẻ.",
          },
          {
            title: "Dán API Key vào nền tảng",
            body: "Vào Cài đặt > Thanh toán > SePay trên dashboard, dán API Key cùng số tài khoản và mã ngân hàng (BIN).",
          },
          {
            title: "Kiểm tra kết nối",
            body: 'Nhấn "Kiểm tra kết nối" để xác nhận webhook SePay hoạt động đúng trước khi bật tự động đối soát.',
          },
        ],
      }
    },
  }
}
