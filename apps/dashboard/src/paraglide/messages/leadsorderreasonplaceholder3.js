/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderreasonplaceholder3Inputs */

const vi_leadsorderreasonplaceholder3 =
  /** @type {(inputs: Leadsorderreasonplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Vì sao bạn đổi trạng thái đơn này?`;
  };

const en_leadsorderreasonplaceholder3 =
  /** @type {(inputs: Leadsorderreasonplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Why are you changing this order's status?`;
  };

/**
 * | output |
 * | --- |
 * | "Why are you changing this order's status?" |
 *
 * @param {Leadsorderreasonplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderreasonplaceholder3 =
  /** @type {((inputs?: Leadsorderreasonplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderreasonplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderreasonplaceholder3(inputs);
      return vi_leadsorderreasonplaceholder3(inputs);
    }
  );
export { leadsorderreasonplaceholder3 as "leadsOrderReasonPlaceholder" };
