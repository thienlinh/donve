/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeleteconfirmcancel3Inputs */

const vi_studiodeleteconfirmcancel3 =
  /** @type {(inputs: Studiodeleteconfirmcancel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Huỷ`;
  };

const en_studiodeleteconfirmcancel3 =
  /** @type {(inputs: Studiodeleteconfirmcancel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cancel`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Studiodeleteconfirmcancel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeleteconfirmcancel3 =
  /** @type {((inputs?: Studiodeleteconfirmcancel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeleteconfirmcancel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeleteconfirmcancel3(inputs);
      return vi_studiodeleteconfirmcancel3(inputs);
    }
  );
export { studiodeleteconfirmcancel3 as "studioDeleteConfirmCancel" };
