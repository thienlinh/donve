/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldrequiredlabel4Inputs */

const vi_campaignsformfieldrequiredlabel4 =
  /** @type {(inputs: Campaignsformfieldrequiredlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bắt buộc`;
  };

const en_campaignsformfieldrequiredlabel4 =
  /** @type {(inputs: Campaignsformfieldrequiredlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Required`;
  };

/**
 * | output |
 * | --- |
 * | "Required" |
 *
 * @param {Campaignsformfieldrequiredlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldrequiredlabel4 =
  /** @type {((inputs?: Campaignsformfieldrequiredlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldrequiredlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldrequiredlabel4(inputs);
      return vi_campaignsformfieldrequiredlabel4(inputs);
    }
  );
export { campaignsformfieldrequiredlabel4 as "campaignsFormFieldRequiredLabel" };
