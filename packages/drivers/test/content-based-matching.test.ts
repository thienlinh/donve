import { describe, expect, it } from "vitest"

import { matchContentBasedTransaction } from "../src/payments/content-based-matching.js"
import { encodeOrderCode } from "../src/payments/order-code.js"
import type {
  OrderMatchCandidate,
  VerifiedPaymentEvent,
} from "../src/payments/types.js"

const PREFIX = "DV"
const NOW = new Date("2026-08-16T00:00:00Z")

function event(
  overrides: Partial<VerifiedPaymentEvent> = {}
): VerifiedPaymentEvent {
  return {
    provider: "sepay",
    providerTxId: "tx-1",
    amount: 100_000,
    content: null,
    orderRef: null,
    occurredAt: NOW,
    rawPayload: {},
    ...overrides,
  }
}

function candidate(
  overrides: Partial<OrderMatchCandidate> = {}
): OrderMatchCandidate {
  return {
    id: "order-1",
    code: "",
    amount: 100_000,
    status: "pending",
    expiresAt: null,
    ...overrides,
  }
}

describe("matchContentBasedTransaction", () => {
  it("auto-matches an exact code against a single eligible order", async () => {
    const code = encodeOrderCode("406789")
    const order = candidate({ id: "order-1", code })

    const result = await matchContentBasedTransaction({
      event: event({ content: `chuyen tien DV${code}` }),
      prefix: PREFIX,
      findOrderCandidates: (extracted) => (extracted === code ? [order] : []),
    })

    expect(result).toEqual({
      outcome: "matched",
      orderId: "order-1",
      matchType: "auto",
    })
  })

  it("fuzzy-matches after a confusable-character typo", async () => {
    const code = encodeOrderCode("406789")
    const mangled = `4O6789${code[6]}`
    const order = candidate({ id: "order-1", code })

    const result = await matchContentBasedTransaction({
      event: event({ content: `DV${mangled}` }),
      prefix: PREFIX,
      findOrderCandidates: (extracted) => (extracted === code ? [order] : []),
    })

    expect(result).toEqual({
      outcome: "matched",
      orderId: "order-1",
      matchType: "fuzzy",
    })
  })

  it("reports no_candidate when content has no valid code", async () => {
    const result = await matchContentBasedTransaction({
      event: event({ content: "chuyen tien 500k" }),
      prefix: PREFIX,
      findOrderCandidates: () => [],
    })

    expect(result).toEqual({
      outcome: "unmatched",
      reason: "no_candidate",
      candidateOrderIds: [],
    })
  })

  it("reports ambiguous when more than one order is eligible", async () => {
    const code = encodeOrderCode("406789")
    const orderA = candidate({ id: "order-a", code })
    const orderB = candidate({ id: "order-b", code })

    const result = await matchContentBasedTransaction({
      event: event({ content: `DV${code}` }),
      prefix: PREFIX,
      findOrderCandidates: () => [orderA, orderB],
    })

    expect(result).toEqual({
      outcome: "unmatched",
      reason: "ambiguous",
      candidateOrderIds: ["order-a", "order-b"],
    })
  })

  it("reports already_paid on a double-match against a settled order (FR-D-14)", async () => {
    const code = encodeOrderCode("406789")
    const order = candidate({ id: "order-1", code, status: "paid" })

    const result = await matchContentBasedTransaction({
      event: event({ content: `DV${code}` }),
      prefix: PREFIX,
      findOrderCandidates: () => [order],
    })

    expect(result).toEqual({
      outcome: "unmatched",
      reason: "already_paid",
      candidateOrderIds: ["order-1"],
    })
  })

  it("does not match when the amount is wrong", async () => {
    const code = encodeOrderCode("406789")
    const order = candidate({ id: "order-1", code, amount: 50_000 })

    const result = await matchContentBasedTransaction({
      event: event({ content: `DV${code}`, amount: 100_000 }),
      prefix: PREFIX,
      findOrderCandidates: () => [order],
    })

    expect(result).toEqual({
      outcome: "unmatched",
      reason: "no_candidate",
      candidateOrderIds: [],
    })
  })

  it("does not match an expired order", async () => {
    const code = encodeOrderCode("406789")
    const order = candidate({
      id: "order-1",
      code,
      expiresAt: new Date("2026-08-15T00:00:00Z"),
    })

    const result = await matchContentBasedTransaction({
      event: event({ content: `DV${code}` }),
      prefix: PREFIX,
      findOrderCandidates: () => [order],
    })

    expect(result).toEqual({
      outcome: "unmatched",
      reason: "no_candidate",
      candidateOrderIds: [],
    })
  })
})
