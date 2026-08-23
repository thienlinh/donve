/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterutmsourceplaceholder4Inputs */

const vi_leadsfilterutmsourceplaceholder4 =
  /** @type {(inputs: Leadsfilterutmsourceplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `vd: facebook`;
  };

const en_leadsfilterutmsourceplaceholder4 =
  /** @type {(inputs: Leadsfilterutmsourceplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `e.g. facebook`;
  };

/**
 * | output |
 * | --- |
 * | "e.g. facebook" |
 *
 * @param {Leadsfilterutmsourceplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterutmsourceplaceholder4 =
  /** @type {((inputs?: Leadsfilterutmsourceplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterutmsourceplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterutmsourceplaceholder4(inputs);
      return vi_leadsfilterutmsourceplaceholder4(inputs);
    }
  );
export { leadsfilterutmsourceplaceholder4 as "leadsFilterUtmSourcePlaceholder" };
