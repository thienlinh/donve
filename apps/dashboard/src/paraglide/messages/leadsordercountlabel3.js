/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsordercountlabel3Inputs */

const vi_leadsordercountlabel3 =
  /** @type {(inputs: Leadsordercountlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số đơn hàng`;
  };

const en_leadsordercountlabel3 =
  /** @type {(inputs: Leadsordercountlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Orders`;
  };

/**
 * | output |
 * | --- |
 * | "Orders" |
 *
 * @param {Leadsordercountlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsordercountlabel3 =
  /** @type {((inputs?: Leadsordercountlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsordercountlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsordercountlabel3(inputs);
      return vi_leadsordercountlabel3(inputs);
    }
  );
export { leadsordercountlabel3 as "leadsOrderCountLabel" };
