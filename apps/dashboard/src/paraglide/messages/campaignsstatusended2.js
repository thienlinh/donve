/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsstatusended2Inputs */

const vi_campaignsstatusended2 =
  /** @type {(inputs: Campaignsstatusended2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã kết thúc`;
  };

const en_campaignsstatusended2 =
  /** @type {(inputs: Campaignsstatusended2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ended`;
  };

/**
 * | output |
 * | --- |
 * | "Ended" |
 *
 * @param {Campaignsstatusended2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsstatusended2 =
  /** @type {((inputs?: Campaignsstatusended2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsstatusended2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsstatusended2(inputs);
      return vi_campaignsstatusended2(inputs);
    }
  );
export { campaignsstatusended2 as "campaignsStatusEnded" };
