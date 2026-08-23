/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsstatusactive2Inputs */

const vi_campaignsstatusactive2 =
  /** @type {(inputs: Campaignsstatusactive2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang chạy`;
  };

const en_campaignsstatusactive2 =
  /** @type {(inputs: Campaignsstatusactive2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Active`;
  };

/**
 * | output |
 * | --- |
 * | "Active" |
 *
 * @param {Campaignsstatusactive2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsstatusactive2 =
  /** @type {((inputs?: Campaignsstatusactive2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsstatusactive2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsstatusactive2(inputs);
      return vi_campaignsstatusactive2(inputs);
    }
  );
export { campaignsstatusactive2 as "campaignsStatusActive" };
