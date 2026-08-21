import { parsePhoneNumberWithError } from "libphonenumber-js";

// libphonenumber-js's own .d.ts declares `class PhoneNumber implements IPhoneNumber` with only
// a constructor in the class body — `implements` doesn't inject members into a .d.ts class type,
// so `.isValid()`/`.number` (real at runtime) are invisible on the declared return type.
interface ParsedPhoneNumber {
  isValid(): boolean;
  number: string;
  country?: string;
}

/**
 * FR-D-02: server is the source of truth for VN phone validation/normalization (the client-side
 * `apps/landing-runtime/src/phone.ts` regex is UX-only). Returns +84 E.164 or null if invalid.
 * `"VN"` is only libphonenumber-js's *default* country for a number with no `+` prefix — an
 * explicitly `+`-prefixed foreign number (e.g. `+12025550143`) parses as valid against its own
 * country, so `country` must be checked too or a US/GB/etc. number would sail through as "VN".
 */
export function normalizeVnPhone(raw: string): string | null {
  try {
    const parsed = parsePhoneNumberWithError(
      raw,
      "VN"
    ) as unknown as ParsedPhoneNumber;
    return parsed.isValid() && parsed.country === "VN" ? parsed.number : null;
  } catch {
    return null;
  }
}
