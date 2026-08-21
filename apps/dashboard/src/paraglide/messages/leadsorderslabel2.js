/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderslabel2Inputs */

const vi_leadsorderslabel2 =
  /** @type {(inputs: Leadsorderslabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đơn hàng`;
  };

const en_leadsorderslabel2 =
  /** @type {(inputs: Leadsorderslabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Orders`;
  };

/**
 * | output |
 * | --- |
 * | "Orders" |
 *
 * @param {Leadsorderslabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderslabel2 =
  /** @type {((inputs?: Leadsorderslabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderslabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderslabel2(inputs);
      return vi_leadsorderslabel2(inputs);
    }
  );
export { leadsorderslabel2 as "leadsOrdersLabel" };
