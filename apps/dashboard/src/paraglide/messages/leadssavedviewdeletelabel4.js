/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewdeletelabel4Inputs */

const vi_leadssavedviewdeletelabel4 =
  /** @type {(inputs: Leadssavedviewdeletelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá bộ lọc`;
  };

const en_leadssavedviewdeletelabel4 =
  /** @type {(inputs: Leadssavedviewdeletelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete view`;
  };

/**
 * | output |
 * | --- |
 * | "Delete view" |
 *
 * @param {Leadssavedviewdeletelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewdeletelabel4 =
  /** @type {((inputs?: Leadssavedviewdeletelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewdeletelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewdeletelabel4(inputs);
      return vi_leadssavedviewdeletelabel4(inputs);
    }
  );
export { leadssavedviewdeletelabel4 as "leadsSavedViewDeleteLabel" };
