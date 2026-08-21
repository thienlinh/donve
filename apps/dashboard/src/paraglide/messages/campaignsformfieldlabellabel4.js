/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldlabellabel4Inputs */

const vi_campaignsformfieldlabellabel4 =
  /** @type {(inputs: Campaignsformfieldlabellabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhãn hiển thị`;
  };

const en_campaignsformfieldlabellabel4 =
  /** @type {(inputs: Campaignsformfieldlabellabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Label`;
  };

/**
 * | output |
 * | --- |
 * | "Label" |
 *
 * @param {Campaignsformfieldlabellabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldlabellabel4 =
  /** @type {((inputs?: Campaignsformfieldlabellabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldlabellabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldlabellabel4(inputs);
      return vi_campaignsformfieldlabellabel4(inputs);
    }
  );
export { campaignsformfieldlabellabel4 as "campaignsFormFieldLabelLabel" };
