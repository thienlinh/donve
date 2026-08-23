/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldtypetext4Inputs */

const vi_campaignsformfieldtypetext4 =
  /** @type {(inputs: Campaignsformfieldtypetext4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Văn bản`;
  };

const en_campaignsformfieldtypetext4 =
  /** @type {(inputs: Campaignsformfieldtypetext4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Text`;
  };

/**
 * | output |
 * | --- |
 * | "Text" |
 *
 * @param {Campaignsformfieldtypetext4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldtypetext4 =
  /** @type {((inputs?: Campaignsformfieldtypetext4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldtypetext4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldtypetext4(inputs);
      return vi_campaignsformfieldtypetext4(inputs);
    }
  );
export { campaignsformfieldtypetext4 as "campaignsFormFieldTypeText" };
