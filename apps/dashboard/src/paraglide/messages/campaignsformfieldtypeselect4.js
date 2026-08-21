/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldtypeselect4Inputs */

const vi_campaignsformfieldtypeselect4 =
  /** @type {(inputs: Campaignsformfieldtypeselect4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dropdown`;
  };

const en_campaignsformfieldtypeselect4 =
  /** @type {(inputs: Campaignsformfieldtypeselect4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dropdown`;
  };

/**
 * | output |
 * | --- |
 * | "Dropdown" |
 *
 * @param {Campaignsformfieldtypeselect4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldtypeselect4 =
  /** @type {((inputs?: Campaignsformfieldtypeselect4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldtypeselect4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldtypeselect4(inputs);
      return vi_campaignsformfieldtypeselect4(inputs);
    }
  );
export { campaignsformfieldtypeselect4 as "campaignsFormFieldTypeSelect" };
