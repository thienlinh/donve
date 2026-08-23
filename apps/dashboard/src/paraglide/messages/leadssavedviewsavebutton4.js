/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewsavebutton4Inputs */

const vi_leadssavedviewsavebutton4 =
  /** @type {(inputs: Leadssavedviewsavebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu bộ lọc`;
  };

const en_leadssavedviewsavebutton4 =
  /** @type {(inputs: Leadssavedviewsavebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save view`;
  };

/**
 * | output |
 * | --- |
 * | "Save view" |
 *
 * @param {Leadssavedviewsavebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewsavebutton4 =
  /** @type {((inputs?: Leadssavedviewsavebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewsavebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewsavebutton4(inputs);
      return vi_leadssavedviewsavebutton4(inputs);
    }
  );
export { leadssavedviewsavebutton4 as "leadsSavedViewSaveButton" };
