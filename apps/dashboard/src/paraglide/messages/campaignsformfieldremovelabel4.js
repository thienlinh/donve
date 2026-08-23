/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldremovelabel4Inputs */

const vi_campaignsformfieldremovelabel4 =
  /** @type {(inputs: Campaignsformfieldremovelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá trường`;
  };

const en_campaignsformfieldremovelabel4 =
  /** @type {(inputs: Campaignsformfieldremovelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove field`;
  };

/**
 * | output |
 * | --- |
 * | "Remove field" |
 *
 * @param {Campaignsformfieldremovelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldremovelabel4 =
  /** @type {((inputs?: Campaignsformfieldremovelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldremovelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldremovelabel4(inputs);
      return vi_campaignsformfieldremovelabel4(inputs);
    }
  );
export { campaignsformfieldremovelabel4 as "campaignsFormFieldRemoveLabel" };
