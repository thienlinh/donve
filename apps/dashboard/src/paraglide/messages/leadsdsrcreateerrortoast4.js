/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrcreateerrortoast4Inputs */

const vi_leadsdsrcreateerrortoast4 =
  /** @type {(inputs: Leadsdsrcreateerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể ghi nhận yêu cầu này. Vui lòng thử lại.`;
  };

const en_leadsdsrcreateerrortoast4 =
  /** @type {(inputs: Leadsdsrcreateerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't log this request. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't log this request. Try again." |
 *
 * @param {Leadsdsrcreateerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrcreateerrortoast4 =
  /** @type {((inputs?: Leadsdsrcreateerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrcreateerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrcreateerrortoast4(inputs);
      return vi_leadsdsrcreateerrortoast4(inputs);
    }
  );
export { leadsdsrcreateerrortoast4 as "leadsDsrCreateErrorToast" };
