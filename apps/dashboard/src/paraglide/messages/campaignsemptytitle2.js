/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsemptytitle2Inputs */

const vi_campaignsemptytitle2 =
  /** @type {(inputs: Campaignsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có chiến dịch nào`;
  };

const en_campaignsemptytitle2 =
  /** @type {(inputs: Campaignsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No campaigns yet`;
  };

/**
 * | output |
 * | --- |
 * | "No campaigns yet" |
 *
 * @param {Campaignsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsemptytitle2 =
  /** @type {((inputs?: Campaignsemptytitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsemptytitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsemptytitle2(inputs);
      return vi_campaignsemptytitle2(inputs);
    }
  );
export { campaignsemptytitle2 as "campaignsEmptyTitle" };
