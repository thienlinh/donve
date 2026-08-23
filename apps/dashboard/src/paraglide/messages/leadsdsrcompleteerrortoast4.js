/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrcompleteerrortoast4Inputs */

const vi_leadsdsrcompleteerrortoast4 =
  /** @type {(inputs: Leadsdsrcompleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể đánh dấu yêu cầu này đã xử lý. Vui lòng thử lại.`;
  };

const en_leadsdsrcompleteerrortoast4 =
  /** @type {(inputs: Leadsdsrcompleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't mark this request handled. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't mark this request handled. Try again." |
 *
 * @param {Leadsdsrcompleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrcompleteerrortoast4 =
  /** @type {((inputs?: Leadsdsrcompleteerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrcompleteerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrcompleteerrortoast4(inputs);
      return vi_leadsdsrcompleteerrortoast4(inputs);
    }
  );
export { leadsdsrcompleteerrortoast4 as "leadsDsrCompleteErrorToast" };
