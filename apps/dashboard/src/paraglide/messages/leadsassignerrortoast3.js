/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignerrortoast3Inputs */

const vi_leadsassignerrortoast3 =
  /** @type {(inputs: Leadsassignerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không gán được lead này. Thử lại.`;
  };

const en_leadsassignerrortoast3 =
  /** @type {(inputs: Leadsassignerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't assign this lead. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't assign this lead. Try again." |
 *
 * @param {Leadsassignerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignerrortoast3 =
  /** @type {((inputs?: Leadsassignerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignerrortoast3(inputs);
      return vi_leadsassignerrortoast3(inputs);
    }
  );
export { leadsassignerrortoast3 as "leadsAssignErrorToast" };
