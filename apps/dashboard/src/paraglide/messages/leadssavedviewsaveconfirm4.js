/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewsaveconfirm4Inputs */

const vi_leadssavedviewsaveconfirm4 =
  /** @type {(inputs: Leadssavedviewsaveconfirm4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu bộ lọc`;
  };

const en_leadssavedviewsaveconfirm4 =
  /** @type {(inputs: Leadssavedviewsaveconfirm4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save view`;
  };

/**
 * | output |
 * | --- |
 * | "Save view" |
 *
 * @param {Leadssavedviewsaveconfirm4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewsaveconfirm4 =
  /** @type {((inputs?: Leadssavedviewsaveconfirm4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewsaveconfirm4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewsaveconfirm4(inputs);
      return vi_leadssavedviewsaveconfirm4(inputs);
    }
  );
export { leadssavedviewsaveconfirm4 as "leadsSavedViewSaveConfirm" };
