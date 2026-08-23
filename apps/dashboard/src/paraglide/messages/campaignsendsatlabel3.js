/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsendsatlabel3Inputs */

const vi_campaignsendsatlabel3 =
  /** @type {(inputs: Campaignsendsatlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết thúc`;
  };

const en_campaignsendsatlabel3 =
  /** @type {(inputs: Campaignsendsatlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ends`;
  };

/**
 * | output |
 * | --- |
 * | "Ends" |
 *
 * @param {Campaignsendsatlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsendsatlabel3 =
  /** @type {((inputs?: Campaignsendsatlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsendsatlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsendsatlabel3(inputs);
      return vi_campaignsendsatlabel3(inputs);
    }
  );
export { campaignsendsatlabel3 as "campaignsEndsAtLabel" };
