import { extractOrderCodes } from "./order-code.js";
import type {
  MatchTransactionInput,
  MatchTransactionResult,
  OrderMatchCandidate,
  VerifiedPaymentEvent
} from "./types.js";

async function resolveCandidates(
  codes: string[],
  findOrderCandidates: MatchTransactionInput["findOrderCandidates"]
): Promise<OrderMatchCandidate[]> {
  const lists = await Promise.all(
    codes.map((code) => Promise.resolve(findOrderCandidates(code)))
  );
  return lists.flat();
}

function pickEligible(
  candidates: OrderMatchCandidate[],
  event: VerifiedPaymentEvent
): OrderMatchCandidate[] {
  return candidates.filter(
    (candidate) =>
      (candidate.status === "pending" ||
        candidate.status === "awaiting_confirmation") &&
      candidate.amount === event.amount &&
      (!candidate.expiresAt || candidate.expiresAt > event.occurredAt)
  );
}

/**
 * Shared matcher for the "read balance + free-text content" provider family (SePay, Casso — see
 * FR-D-05). Gateway-callback providers (VNPAY, MoMo) resolve `event.orderRef` directly against
 * `findOrderCandidates` instead and don't need this.
 */
export async function matchContentBasedTransaction(
  input: MatchTransactionInput & { prefix: string }
): Promise<MatchTransactionResult> {
  const { event, findOrderCandidates, prefix } = input;

  if (!event.content) {
    return {
      outcome: "unmatched",
      reason: "no_candidate",
      candidateOrderIds: []
    };
  }

  const { exact, corrected } = extractOrderCodes(event.content, prefix);
  const passes: Array<{ codes: string[]; matchType: "auto" | "fuzzy" }> = [
    { codes: exact, matchType: "auto" },
    { codes: corrected, matchType: "fuzzy" }
  ];

  for (const pass of passes) {
    if (pass.codes.length === 0) continue;

    // oxlint-disable-next-line no-await-in-loop -- passes are sequential by design: fuzzy must only run once exact has conclusively failed.
    const candidates = await resolveCandidates(pass.codes, findOrderCandidates);
    const eligible = pickEligible(candidates, event);

    const [onlyEligible] = eligible;
    if (onlyEligible && eligible.length === 1) {
      return {
        outcome: "matched",
        orderId: onlyEligible.id,
        matchType: pass.matchType
      };
    }
    if (eligible.length > 1) {
      return {
        outcome: "unmatched",
        reason: "ambiguous",
        candidateOrderIds: eligible.map((candidate) => candidate.id)
      };
    }

    const alreadySettled = candidates.filter(
      (candidate) =>
        candidate.status === "paid" || candidate.status === "refunded"
    );
    if (alreadySettled.length > 0) {
      return {
        outcome: "unmatched",
        reason: "already_paid",
        candidateOrderIds: alreadySettled.map((candidate) => candidate.id)
      };
    }
  }

  return {
    outcome: "unmatched",
    reason: "no_candidate",
    candidateOrderIds: []
  };
}
