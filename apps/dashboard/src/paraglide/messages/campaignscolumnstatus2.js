/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignscolumnstatus2Inputs */

const vi_campaignscolumnstatus2 =
  /** @type {(inputs: Campaignscolumnstatus2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trạng thái`;
  };

const en_campaignscolumnstatus2 =
  /** @type {(inputs: Campaignscolumnstatus2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Status`;
  };

/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Campaignscolumnstatus2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignscolumnstatus2 =
  /** @type {((inputs?: Campaignscolumnstatus2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignscolumnstatus2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignscolumnstatus2(inputs);
      return vi_campaignscolumnstatus2(inputs);
    }
  );
export { campaignscolumnstatus2 as "campaignsColumnStatus" };
