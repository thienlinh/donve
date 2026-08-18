/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeleteconfirmaction3Inputs */

const vi_studiodeleteconfirmaction3 =
  /** @type {(inputs: Studiodeleteconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá`;
  };

const en_studiodeleteconfirmaction3 =
  /** @type {(inputs: Studiodeleteconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete`;
  };

/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Studiodeleteconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeleteconfirmaction3 =
  /** @type {((inputs?: Studiodeleteconfirmaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeleteconfirmaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeleteconfirmaction3(inputs);
      return vi_studiodeleteconfirmaction3(inputs);
    }
  );
export { studiodeleteconfirmaction3 as "studioDeleteConfirmAction" };
