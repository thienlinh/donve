/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignszalourllabel3Inputs */

const vi_campaignszalourllabel3 =
  /** @type {(inputs: Campaignszalourllabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Link nhóm Zalo`;
  };

const en_campaignszalourllabel3 =
  /** @type {(inputs: Campaignszalourllabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo group link`;
  };

/**
 * | output |
 * | --- |
 * | "Zalo group link" |
 *
 * @param {Campaignszalourllabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignszalourllabel3 =
  /** @type {((inputs?: Campaignszalourllabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignszalourllabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignszalourllabel3(inputs);
      return vi_campaignszalourllabel3(inputs);
    }
  );
export { campaignszalourllabel3 as "campaignsZaloUrlLabel" };
