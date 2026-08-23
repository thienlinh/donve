/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignssavesubmit2Inputs */

const vi_campaignssavesubmit2 =
  /** @type {(inputs: Campaignssavesubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu`;
  };

const en_campaignssavesubmit2 =
  /** @type {(inputs: Campaignssavesubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save`;
  };

/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Campaignssavesubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignssavesubmit2 =
  /** @type {((inputs?: Campaignssavesubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignssavesubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignssavesubmit2(inputs);
      return vi_campaignssavesubmit2(inputs);
    }
  );
export { campaignssavesubmit2 as "campaignsSaveSubmit" };
