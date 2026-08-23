/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivityordercreated3Inputs */

const vi_leadsactivityordercreated3 =
  /** @type {(inputs: Leadsactivityordercreated3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo đơn hàng`;
  };

const en_leadsactivityordercreated3 =
  /** @type {(inputs: Leadsactivityordercreated3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Order created`;
  };

/**
 * | output |
 * | --- |
 * | "Order created" |
 *
 * @param {Leadsactivityordercreated3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivityordercreated3 =
  /** @type {((inputs?: Leadsactivityordercreated3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivityordercreated3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivityordercreated3(inputs);
      return vi_leadsactivityordercreated3(inputs);
    }
  );
export { leadsactivityordercreated3 as "leadsActivityOrderCreated" };
