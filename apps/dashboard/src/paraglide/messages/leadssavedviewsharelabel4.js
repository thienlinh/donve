/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewsharelabel4Inputs */

const vi_leadssavedviewsharelabel4 =
  /** @type {(inputs: Leadssavedviewsharelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chia sẻ cho cả team`;
  };

const en_leadssavedviewsharelabel4 =
  /** @type {(inputs: Leadssavedviewsharelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Share with the whole team`;
  };

/**
 * | output |
 * | --- |
 * | "Share with the whole team" |
 *
 * @param {Leadssavedviewsharelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewsharelabel4 =
  /** @type {((inputs?: Leadssavedviewsharelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewsharelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewsharelabel4(inputs);
      return vi_leadssavedviewsharelabel4(inputs);
    }
  );
export { leadssavedviewsharelabel4 as "leadsSavedViewShareLabel" };
