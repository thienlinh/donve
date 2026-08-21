/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldaddbutton4Inputs */

const vi_campaignsformfieldaddbutton4 =
  /** @type {(inputs: Campaignsformfieldaddbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm trường`;
  };

const en_campaignsformfieldaddbutton4 =
  /** @type {(inputs: Campaignsformfieldaddbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add field`;
  };

/**
 * | output |
 * | --- |
 * | "Add field" |
 *
 * @param {Campaignsformfieldaddbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldaddbutton4 =
  /** @type {((inputs?: Campaignsformfieldaddbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldaddbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldaddbutton4(inputs);
      return vi_campaignsformfieldaddbutton4(inputs);
    }
  );
export { campaignsformfieldaddbutton4 as "campaignsFormFieldAddButton" };
