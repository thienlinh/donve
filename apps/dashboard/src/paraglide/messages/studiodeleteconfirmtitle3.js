/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeleteconfirmtitle3Inputs */

const vi_studiodeleteconfirmtitle3 =
  /** @type {(inputs: Studiodeleteconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá section này?`;
  };

const en_studiodeleteconfirmtitle3 =
  /** @type {(inputs: Studiodeleteconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete this section?`;
  };

/**
 * | output |
 * | --- |
 * | "Delete this section?" |
 *
 * @param {Studiodeleteconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeleteconfirmtitle3 =
  /** @type {((inputs?: Studiodeleteconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeleteconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeleteconfirmtitle3(inputs);
      return vi_studiodeleteconfirmtitle3(inputs);
    }
  );
export { studiodeleteconfirmtitle3 as "studioDeleteConfirmTitle" };
