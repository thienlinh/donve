/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterpaidno3Inputs */

const vi_leadsfilterpaidno3 =
  /** @type {(inputs: Leadsfilterpaidno3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa thanh toán`;
  };

const en_leadsfilterpaidno3 =
  /** @type {(inputs: Leadsfilterpaidno3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Not paid`;
  };

/**
 * | output |
 * | --- |
 * | "Not paid" |
 *
 * @param {Leadsfilterpaidno3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterpaidno3 =
  /** @type {((inputs?: Leadsfilterpaidno3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterpaidno3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterpaidno3(inputs);
      return vi_leadsfilterpaidno3(inputs);
    }
  );
export { leadsfilterpaidno3 as "leadsFilterPaidNo" };
