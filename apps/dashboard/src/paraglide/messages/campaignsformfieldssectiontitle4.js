/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldssectiontitle4Inputs */

const vi_campaignsformfieldssectiontitle4 =
  /** @type {(inputs: Campaignsformfieldssectiontitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trường trong form`;
  };

const en_campaignsformfieldssectiontitle4 =
  /** @type {(inputs: Campaignsformfieldssectiontitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Form fields`;
  };

/**
 * | output |
 * | --- |
 * | "Form fields" |
 *
 * @param {Campaignsformfieldssectiontitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldssectiontitle4 =
  /** @type {((inputs?: Campaignsformfieldssectiontitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldssectiontitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldssectiontitle4(inputs);
      return vi_campaignsformfieldssectiontitle4(inputs);
    }
  );
export { campaignsformfieldssectiontitle4 as "campaignsFormFieldsSectionTitle" };
